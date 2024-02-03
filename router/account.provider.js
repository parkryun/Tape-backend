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

//닉네임 유효성 검사
router.post('/nickname', async (req,res)=>{
    const nickname = req.body.nickname;
    const result = {
        "success": false,
        "message": null,
    };

    const errorMessage = await validateNickname(nickname);
    if(errorMessage){
        result.message = errorMessage;
        result.data.nickname = nickname;
        res.json(result);
        return;
    }

    try{
        const userData = jwt.verify(req.cookies.userData,SECRET_KEY);
        userData.nickname = nickname;
        res.cookie("userData",  jwt.sign(userData, SECRET_KEY));
    } catch(error){
        result.message = "token error";
        res.json(result);
        return;
    }
    result.success = true;
    res.json(result);
});

//프로필 저장 및 회원가입
router.post('/profile', upload.single('image'), async (req,res)=>{
    const introduce = String(req.body.introduce);
    const profileImage = req.file;
    const profileImageUrl = profileImage ? profileImage.path : null;

    const result = {
        "success": false,
        "message": null,
    }
    if(introduce.length > 150){ //소개문 글자수 초과
        result.message = "소개문은 150자 이내로 작성해주세요.";
        result.data.introduce = introduce;
        res.json(result);
        return;
    }

    let email, nickname;
    try{
        const userData = jwt.verify(req.cookies.userData, SECRET_KEY);
        email = userData.email;
        nickname = userData.nickname;
        res.clearCookie("userData");
    } catch(error){
        result.message = "token error";
        res.json(result);
        return;
    }

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
        result.message = "Can't connect to database";
        res.json(result);
    }

    const token = {
        isAuth: true,
        uid: getUserId[0][0].id,
    }
    res.cookie("token", jwt.sign(token, SECRET_KEY));
    
    res.success = true;
    res.json(result);
});

router.post('/logout', async(req,res)=>{
    const result = {
        "success": true,
        "message": null,
    }
    res.clearCookie("token");
    res.json(result);
});

module.exports = router;