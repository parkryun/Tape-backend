const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

const db = require('../data/database');
const query = require('./account.sql');
const createImageStorageConfig = require('../config/imagesStorage');
const validateNickname = require('../config/validateNickname');
require("dotenv").config(); //환경변수

//이미지 저장 방식 설정
const upload = createImageStorageConfig();
const SECRET_KEY = process.env.JWT_SECRET_KEY;

//닉네임 작성 창 가져오기
router.get('/nickname', (req,res)=>{

    let nickname, message, success;
    if(req.cookies.signin!==undefined){
        const errdata = jwt.verify(req.cookies.signin, SECRET_KEY);
        nickname = errdata.nickname;
        message = errdata.message;
        success = errdata.success;
    }

    const result = {
        "success": success,
        "message": message || false,
        "data": {
            nickname : nickname || null,
        }
    };

    /** test */
    const nicknameForm = `
        <form action="/account/nickname" method="POST">
            <label>nickname : </label>
            <input type="text" name="nickname" required>
            <button>next</button>
        </form>
    `;
    res.send(nicknameForm);
    const cookies = jwt.verify(req.cookies.userData, SECRET_KEY);
    console.log("/nickname get cookie : ", cookies);
    console.log("/nickname get result : ", result);

});

//닉네임 유효성 검사
router.post('/nickname', async (req,res,next)=>{
    const nickname = req.body.nickname;

    const errorMessage = await validateNickname(nickname,next);
    if(errorMessage){
        const data = {
            "success" : false,
            "nickname" : nickname,
            "message" : errorMessage || null
        };
        res.cookie("signin", jwt.sign(data, SECRET_KEY));
        res.redirect('/account/nickname');
        return;
    }
    res.clearCookie("signin");
    
    const userData = jwt.verify(req.cookies.userData,SECRET_KEY);
    userData.nickname = nickname;
    res.cookie("userData",  jwt.sign(userData, SECRET_KEY));
    
    const result = {
        "success": true,
        "message": null,
    }
    res.redirect('/account/profile');

    /** test */
    console.log("/nickname post result : ", result);
});

//프로필 작성 창 가져오기
router.get('/profile', (req,res)=>{

    let introduce, message, success;
    if(req.cookies.signin!==undefined){
        const errdata = jwt.verify(req.cookies.signin, SECRET_KEY);
        introduce = errdata.introduce;
        message = errdata.message;
        success = errdata.success;
    }

    const result = {
        "success": success || true,
        "message": message || false,
        "data": {
            "introduce" : introduce || null,
        }
    };

    /** test */
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
    console.log("/profile get cookie : ", jwt.verify(req.cookies.userData, SECRET_KEY));
    console.log("/profile get result : ", result);
}); 

//프로필 저장 및 회원가입
router.post('/profile', upload.single('image'), async (req,res,next)=>{
    const introduce = req.body.introduce;
    if(introduce.length > 150){ //소개문 글자수 초과
        const data = {
            message: '소개문은 150자 이내로 작성해주세요.',
            introduce: introduce
        }
        res.cookie("signin", jwt.sign(data, SECRET_KEY));
        res.redirect('/account/profile');
        return;
    }
    res.clearCookie("signin");

    const userData = jwt.verify(req.cookies.userData, SECRET_KEY);
    res.clearCookie("userData");

    const profileImage = req.file;
    const profileImageUrl = profileImage ? profileImage.path : null;
    const userInfo = {
        email: userData.email,
        nickname: userData.nickname,
        profileImg: profileImageUrl,
        introduce: introduce,
        created_at: new Date(),
        updated_at: new Date(),
        is_deactived: 1,
    }

    let getUserId;
    try{
        await db.query(query.userRegister, Object.values(userInfo));
        getUserId = await db.query(query.findUserByEmail, userInfo.email);
    } catch (error){
        next(error);
    }

    const data = {
        isAuth: true,
        uid: getUserId[0][0].user_id,
    }
    res.cookie("TAPE", jwt.sign(data, SECRET_KEY));
    res.redirect('/account/tape');
    const result = {
        "success": true,
        "message": null,
    }
    /** test */
    console.log("/profile post result : ", result);
});

/** -------------- test --------------- */

router.get('/tape',(req,res)=>{
    console.log("cookie : ",jwt.verify(req.cookies.TAPE, process.env.JWT_SECRET_KEY));
    res.send('tape main page');

});

router.get("/test", (req, res) => {
    const payload = { //value
      isAuth: true,
      uid: 'test'
    };
    const SECRET_KEY = 'TAPE'; //key
    const token = jwt.sign(payload, SECRET_KEY);//jwt token 발급
    res.cookie("test", token); //test라는 제목으로 token 저장
    console.log(token);
    const decoded = jwt.verify(token,SECRET_KEY); //token 디코딩
    console.log(decoded);
    res.send("test page");
});

module.exports = router;