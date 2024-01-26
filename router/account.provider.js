const express = require('express')
const router = express.Router();

const passport = require('passport');
const session = require('express-session');
const multer = require('multer'); //이미지
const KakaoStrategy = require('passport-kakao').Strategy;
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const db = require('../data/database');
const query = require('./account.sql');
require("dotenv").config(); //환경변수


//session 설정
router.use(session({
    secret: 'super-secret',
    resave: false,
    saveUninitialized: false,
    cookie:{
        secure: false, //개발하는동안엔 false
        maxAge: 2*24*60*60*1000,
    }
}));
router.use(cookieParser());

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
    )
)

//카카오 로그인 창 가져오기
router.get('/kakao',passport.authenticate('kakao',{session:false})); 

//회원가입 여부 판단
router.get('/kakao/callback', passport.authenticate('kakao',{session:false}), async (req,res) => {
        const user = await db.query(query.findUserByEmail, req.user.email);
        const userData = {
            email : req.user.email,
        };
        if(user[0].length!==0){ //tape에 가입한 유저
            const getUserId = await db.query(query.findUserByEmail, userData.email);
            const data = {
                isAuth: true,
                uid: getUserId[0][0].user_id,
            }
            res.cookie("TAPE", jwt.sign(data,process.env.JWT_SECRET_KEY));
            res.redirect('/tape');
        } else { //tape에 가입해야하는 유저
            res.cookie("userData", jwt.sign(userData,process.env.JWT_SECRET_KEY));
            res.redirect('/account/nickname');
        }
        return;
    }
)

//닉네임 작성 창 가져오기
router.get('/account/nickname', (req,res)=>{
    console.log("cookie : ", jwt.verify(req.cookies.userData,process.env.JWT_SECRET_KEY));
    const nicknameForm = `
        <form action="/account/nickname" method="POST">
            <label>nickname : </label>
            <input type="text" name="nickname" required>
            <button>next</button>
        </form>
    `;
    res.send(nicknameForm);
});

//닉네임 유효성 검사
router.post('/account/nickname', async (req,res)=>{
    const regex = /^[A-Za-z0-9._]+$/;
    const nickname = req.body.nickname;
    const existingUser = await db.query(query.findUserByNickname, nickname);
    if(!regex.test(nickname)){ // 정규표현식 불만족
        data = {
            hasError: true,
            message: '사용자 이름은 영문, 숫자, 마침표, 밑줄만 사용할 수 있습니다.',
            nickname: nickname
        }
        res.cookie("signin", jwt.sign(data, process.env.JWT_SECRET_KEY));
        res.redirect('/account/nickname');
        return;
    }
    if(nickname.trim().length>20){ // 닉네임 길이 최대 제한 초과
        data = {
            hasError: true,
            message: '사용자 이름은 20자 이내로 작성해주세요.',
            nickname: nickname
        }
        res.cookie("signin", jwt.sign(data, process.env.JWT_SECRET_KEY));
        res.redirect('/account/nickname');
        return;
    }
    if(existingUser[0].length!==0){ // 이미 존재하는 닉네임
        data = {
            hasError: true,
            message: '이 닉네임은 이미 사용중입니다.',
            nickname: nickname
        }
        res.cookie("signin", jwt.sign(data, process.env.JWT_SECRET_KEY));
        res.redirect('/account/nickname');
        return;
    }
    res.clearCookie("signin");

    userData = jwt.verify(req.cookies.userData,process.env.JWT_SECRET_KEY);
    userData.nickname = nickname;

    res.cookie("userData",  jwt.sign(userData, process.env.JWT_SECRET_KEY));
    res.redirect('/account/profile');
    return;

});

//프로필 작성 창 가져오기
router.get('/account/profile',(req,res)=>{
    console.log("cookie : ", jwt.verify(req.cookies.userData, process.env.JWT_SECRET_KEY));
    const userInputForm = `
        <form action="/account/profile" method="POST" enctype="multipart/form-data">
            <label>introduce : </label>
            <input type="text" name="introduce">
            <labe>image : </label>
            <input type="file" id="image" name="image" accept="image/png,image/jpg">
            <button>next</button>
        </form>
    `;
    res.send(userInputForm);
}); 

//프로필 저장 및 회원가입
router.post('/account/profile', upload.single('image'), async (req,res)=>{
    const profileImage = req.file;
    const profileImageUrl = profileImage ? profileImage.path : null;
    const introduce = req.body.introduce;
    if(introduce.length > 150){ //소개문 글자수 초과
        data = {
            hasError: true,
            message: '소개문은 150자 이내로 작성해주세요.',
            profileImage: profileImage,
            introduce: introduce
        }
        res.cookie("signin", jwt.sign(data, process.env.JWT_SECRET_KEY));
        res.redirect('/account/profile');
        return;
    }
    res.clearCookie("signin");

    const userData = jwt.verify(req.cookies.userData, process.env.JWT_SECRET_KEY);

    const userInfo = {
        email: userData.email,
        nickname: userData.nickname,
        profileImg: profileImageUrl,
        introduce: introduce,
        created_at: new Date(),
        updated_at: new Date(),
        is_deactived: 1,
    }
    console.log("userInfo : ", userInfo);

    await db.query(query.userRegister, Object.values(userInfo));

    const getUserId = await db.query(query.findUserByEmail, userInfo.email);

    const data = {
        isAuth: true,
        uid: getUserId[0][0].user_id,
    }
    res.cookie("TAPE", jwt.sign(data,process.env.JWT_SECRET_KEY));
    res.redirect('/tape');
    return;
});

router.get('/tape',(req,res)=>{
    console.log(jwt.verify(req.cookies.TAPE, process.env.JWT_SECRET_KEY));
    res.send('tape main page');
})

router.get("/test", (req, res) => {
    const payload = { //value
      isAuth: true,
      uid: 'test'
    };
    const secretKey = 'TAPE'; //key
    const token = jwt.sign(payload, secretKey);//jwt token 발급
    res.cookie("test", token); //test라는 제목으로 token 저장
    console.log(token);
    const decoded = jwt.verify(token,secretKey); //token 디코딩
    console.log(decoded);
    res.send("tset page");
});

module.exports = router;