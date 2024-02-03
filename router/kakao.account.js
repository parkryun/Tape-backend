const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

const verifyKakaoToken = require('../module/verify-kakaoToken');
const db = require('../data/database');
const query = require('./account.sql');
const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;

require("dotenv").config(); //환경변수

// //passport 설정
// passport.use('kakao', new KakaoStrategy(
//     {
//         clientID: process.env.KAKAO_RESTAPI_KEY,
//         callbackURL: '/kakao/callback',
//     },
//     async (accessToken, refreshToken, profile, done) => {        
//         const email = profile._json.kakao_account.email;//로그인한 사용자 email
//         const id = profile._json.id; //카카오에서 설정된 id
//         console.log(accessToken);
//         try{
//             const user = await db.query(query.getKakaoUserByEmail, email);
//             if(user[0].length===0){ //처음 카카오 로그인 시
//                 await db.query(query.kakaoRegister, [email, id, accessToken]);
//             }
//             done(null, {email: email, id: id, accessToken: accessToken});
//         }catch(error){
//             console.log(error);
//         }
//     }
// ))

// //카카오 로그인 창 가져오기
// router.get('/',passport.authenticate('kakao',{session:false})); 

// // //회원가입 여부 판단
// router.get('/callback', passport.authenticate('kakao',{session:false}), async (req,res,next) => {
//     let user;
//     try{
//         user = await db.query(query.findUserByEmail, req.user.email);
//     } catch(error) {
//         next(error);
//     }
//     const result = {
//         "success": true,
//         "message": false,
//         "data":{
//             "isSignin": false, //isSignin = false면 로그인 필요
//         }
//     };

//     if(user[0].length!==0){ //tape에 가입한 유저
//         const token = {
//             isAuth: true,
//             uid: user[0][0].id,
//         }
//         res.cookie("token", jwt.sign(token,process.env.JWT_SECRET_KEY));
//         result.data.isSignin = true;
//         res.json(result);
//     } else { //tape에 가입해야하는 유저
//         const userData = {
//             email : req.user.email,
//         };
//         res.cookie("userData", jwt.sign(userData,process.env.JWT_SECRET_KEY));
//         res.json(result);
//     }
//     return;
// });

router.get('/callback', async (req,res) => {
    const result = {
        "success": false,
        "message": null,
        "data":{

        }
    }
    const kakaoToken = req.query.accessToken;
    const email = req.query.email;
    const errorMessage = await verifyKakaoToken(kakaoToken);
    if(errorMessage){ //카카오 토큰 검사 불통과
        result.message = errorMessage;
        res.json(result);
        return;
    }
    
    let user;
    try{
        user = await db.query(query.findUserByEmail, email);
    } catch(error) {
        result.message = "Can't connect to database";
        res.json(result);
        return;
    }
    result.data.isSignin = false;

    if(user[0].length!==0){ //tape에 가입한 유저
        const token = {
            isAuth: true,
            uid: user[0][0].id,
        }
        res.cookie("token", jwt.sign(token, process.env.JWT_SECRET_KEY));
        result.data.isSignin = true;
        res.json(result);
    } else { //tape에 가입해야하는 유저
        const userData = {
            email : email,
        };
        res.cookie("userData", jwt.sign(userData, process.env.JWT_SECRET_KEY));
        console.log(jwt.sign(userData, process.env.JWT_SECRET_KEY));
        res.json(result);
    }

    return;
});

module.exports = router;