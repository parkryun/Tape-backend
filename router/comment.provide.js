const express = require('express')
const router = express.Router();
const jwt = require('jsonwebtoken');
const authVerify = require("../module/verify");
const db = require('../data/database.js');
const commentsql = require("./comment.sql")
//테이프 댓글 조회
//누구나
router.get("/tape", authVerify ,(req, res) => {
    const result = { 
        "success": false,
        "message": null,
        "data": [],
    }

    const values = [req.query.tapeId]
    db.query(commentsql.comment.get, values, (err,data) => {
        if(err) {
            result.message = err.message
            res.send(result)
        }  
        else{
            result.success = true
            result.data = data
            res.send(result)
        }
    })
});

module.exports = router