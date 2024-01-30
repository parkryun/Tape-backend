const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

const db = require('../data/database');
const query = require('./account.sql');
const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;

//passport 설정
passport.use('kakao', new KakaoStrategy(
    {
        clientID: process.env.KAKAO_RESTAPI_KEY,
        callbackURL: '/kakao/callback',
    },
    async (accessToken, refreshToken, profile, done) => {        
        const email = profile._json.kakao_account.email;//로그인한 사용자 email
        const id = profile._json.id; //카카오에서 설정된 id
        try{
            const user = await db.query(query.getKakaoUserByEmail, email);
            if(user[0].length===0){ //처음 카카오 로그인 시
                await db.query(query.kakaoRegister, [email, id, accessToken]);
            }
            done(null, {email: email, id: id, accessToken: accessToken});
        }catch(error){
            console.log(error);
        }
    }
))

//카카오 로그인 창 가져오기
router.get('/',passport.authenticate('kakao',{session:false})); 

//회원가입 여부 판단
router.get('/callback', passport.authenticate('kakao',{session:false}), async (req,res,next) => {
    let user;
    try{
        user = await db.query(query.findUserByEmail, req.user.email);
    } catch(error) {
        next(error);
    }
    
    if(user[0].length!==0){ //tape에 가입한 유저
        const data = {
            isAuth: true,
            uid: user[0][0].user_id,
        }
        res.cookie("TAPE", jwt.sign(data,process.env.JWT_SECRET_KEY));
        res.redirect('/account/tape');
    } else { //tape에 가입해야하는 유저
        const userData = {
            email : req.user.email,
        };
        res.cookie("userData", jwt.sign(userData,process.env.JWT_SECRET_KEY));
        res.redirect('/account/nickname');
    }
    return;
});

module.exports = router;