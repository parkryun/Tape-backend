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
        "data":{ 
            "nickname": nickname
        }
    };

    try{
        const errorMessage = await validateNickname(nickname);
        if(errorMessage){
            result.message = errorMessage;
            res.json(result);
            return;
        }
    } catch(error){
        result.message = "Can't connect to database";
        res.json(result);
        return;
    }

    result.success = true;
    res.json(result);
});

//프로필 저장 및 회원가입
router.post('/profile', upload.single('image'), async (req,res)=>{
    const email = req.body.email;
    const nickname = req.body.nickname;
    const introduce = req.body.introduce;
    const profileImage = req.file;
    const profileImageUrl = profileImage ? profileImage.path : null;
    const result = {
        "success": false,
        "message": null,
        "data":{ 
            "introduce": introduce
        }
    }

    if(introduce.length > 150){ //소개문 글자수 초과
        result.message = "소개문은 150자 이내로 작성해주세요.";
        res.json(result);
        return;
    }
    const userInfo = {
        email: email,
        nickname: nickname,
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
        return;
    }

    const token = {
        isAuth: true,
        uid: getUserId[0][0].id,
    }
    res.cookie("token", jwt.sign(token, SECRET_KEY));
    
    result.success = true;
    res.json(result);
});

//로그아웃
router.post('/logout', async(req,res)=>{
    const result = {
        "success": true,
        "message": null,
    }
    res.clearCookie("token");
    res.json(result);
});

module.exports = router;