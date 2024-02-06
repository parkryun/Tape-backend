const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

const validateKakaoToken = require('../config/validateKakaoToken');
const db = require('../data/database');
const query = require('./account.sql');

require("dotenv").config();

router.get('/callback', async (req,res) => {
    const kakaoToken = req.query.accessToken;
    const email = req.query.email;
    const result = {
        "success": false,
        "message": null,
        "data":{ }
    }

    const errorMessage = await validateKakaoToken(kakaoToken);
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
    result.success = true;

    if(user[0].length!==0){ //tape에 가입한 유저
        const token = {
            isAuth: true,
            uid: user[0][0].id,
        }
        res.cookie("token", jwt.sign(token, process.env.JWT_SECRET_KEY));
        result.data.isSignin = true;
        res.json(result);
        return;
    }

    //tape에 가입해야하는 유저
    res.json(result);
    return;
});

module.exports = router;