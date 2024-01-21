const express = require('express')
const router = express.Router();

const passport = require('passport');
const session = require('express-session');
const multer = require('multer'); //이미지
const KakaoStrategy = require('passport-kakao').Strategy;

const db = require('../data/database');
const query = require('./account.sql');
require("dotenv").config(); //환경변수


//session 설정
router.use(session({
    secret: 'super-secret',
    resave: false,
    saveUninitialized: false,
    cookie:{secure:false}
  }));
router.use(passport.initialize());
router.use(passport.session());

//이미지 저장 방식 설정
const storageConfig = multer.diskStorage({
  destination: function(req,file,cb){
    cb(null, 'images');
  },
  filename: function(req,file,cb){
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({storage: storageConfig});


//passport 설정
passport.use('kakao', new KakaoStrategy(
        {
            clientID: process.env.KAKAO_RESTAPI_KEY,
            callbackURL: '/kakao/callback',
        },
        async (accessToken, refreshToken, profile, done) => {        
            // console.log('kakao profile', profile);
            // console.log(accessToken)
            // console.log(refreshToken)
            const email = profile._json.kakao_account.email;//로그인한 사용자 email
            const id = profile._json.id; //카카오에서 설정된 id
            try{
                const user = await db.query(query.getKakaoUserByEmail, email);
                if(user[0].length===0){ //처음 카카오 로그인 시
                    await db.query(query.kakaoRegister, [email, id]);
                }
                done(null, {email: email, id: id}); //사용자 인증 성공 -> serializeUser 실행
            }catch(error){
                console.log(error);
            }
        }
    )
)
passport.serializeUser(function (user, done) { //사용자 인증 성공시 호출
    console.log("serializerUser 호출");
    done(null, user.email);
});
passport.deserializeUser(async function (email, done) { //인증 이후 요청시마다 호출
    console.log("deserializeUser 호출");
    const user = await db.query(query.getKakaoUserByEmail, email);
    done(null, user[0]);
});



//카카오 로그인 창 가져오기
router.get('/kakao',passport.authenticate('kakao')); 

//회원가입 여부 판단
router.get('/kakao/callback', passport.authenticate('kakao'), async (req,res) => {
        const user = await db.query(query.findUserByEmail, req.user.id);
        if(user[0].length!==0){ //tape에 가입한 유저
            res.redirect('/tape');
        } else { //tape에 가입해야하는 유저
            res.redirect('/account/nickname');
        }
    }
)

//닉네임 작성 창 가져오기
router.get('/account/nickname', (req,res)=>{
    // console.log(req.user[0]);
    res.send("/account/nickname page");
});

//닉네임 유효성 검사
router.post('/account/nickname', async (req,res)=>{
    const regex = /^[A-Za-z0-9._]+$/;
    const nickname = req.body.nickname;
    const existingUser = await db.query(query.findUserByEmail, nickname);
    if(!regex.test(nickname)){ // 정규표현식 불만족
        req.session.inputData = {
            hasError: true,
            message: '사용자 이름은 영문, 숫자, 마침표, 밑줄만 사용할 수 있습니다.',
            nickname: nickname
        }
        req.session.save(()=>{res.redirect('/account/nickname');});
    }
    if(nickname.trim().length>20){ // 닉네임 길이 최대 제한 초과
        req.session.inputData = {
            hasError: true,
            message: '사용자 이름은 20자 이내로 작성해주세요.',
            nickname: nickname
        }
        req.session.save(()=>{res.redirect('/account/nickname');});
    }
    if(existingUser){ // 이미 존재하는 닉네임
        req.session.inputData = {
            hasError: true,
            message: '이 닉네임은 이미 사용중입니다.',
            nickname: nickname
        }
        req.session.save(()=>{res.redirect('/account/nickname');});
    }

    req.session.userData = {
        userEmail: req.session.passport.user,
        userNickname: nickname,
    }
    req.session.save(()=>{res.redirect('/account/profile');});
    return;

});

//프로필 작성 창 가져오기
router.get('/account/profile',(req,res)=>{
    res.send("/account/profile page");
}); 

//프로필 저장 및 회원가입
router.post('/account/profile', upload.single('image'), async (req,res)=>{
    const profileImage = req.file;
    const introduce = req.body.introduce;

    if(introduce.length>150){ //소개문 글자수 초과
        req.session.inputData = {
            hasError: true,
            message: '소개문은 150자 이내로 작성해주세요.',
            profileImage: profileImage,
            introduce: introduce
        }
        req.session.save(()=>{res.redirect('/account/profile');});
    }

    const userInfo = {
        userEmail: req.session.userData.userEmail,
        userNickname: req.session.userData.userNickname,
        userProfileImg: profileImage.path,
        userIntroduce: introduce
    }
    await db.query(query.userRegister, userInfo);

    res.redirect('/tape');
});

module.exports = router;