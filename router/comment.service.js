
const express = require('express')
const router = express.Router();
const jwt = require('jsonwebtoken');
const authVerify = require("../module/verify");
const db = require('../data/database');
const commentsql = require("./comment.sql");

function findIdByComment(id) {
    const values = [id]
    const userId = db.query(commentsql.comment.getIdByComment, values,(data) => {
        return data
    });
    return userId;
}

function findIdByTape(id) {
    const values = [id]
    const userId = db.query(commentsql.comment.getIdByTape, values,(data) => {
        return data
    });
    return userId;
}

// 댓글작성
// 회원
router.post("/tape/:tapeId/comment", authVerify,(req, res) => { 
    const result = { 
        "success": false,
        "message": null,
        "data": []
    }
    const values = [req.params.tapeId, req.decoded.userIndex, req.body.tapeCommentContent]
    db.query(commentsql.comment.save, values,(err)=>{
        result.success = true
        console.log(result)
        if(err) result.message = err.message;
    });
    res.redirect(`/tape/${req.params.tapeId}`)   
});

// 댓글삭제
// 테이프 작성자, 댓글 작성자
router.delete("/tape/:tapeId/comment/:id", authVerify, async (req, res) => { 
    const result = { 
        "success": false,
        "message": null,
        "data": []
    }
    const params = req.params
    const commentOwnerId = findIdByComment(params.id)
    const tapeOwnerId = findIdByTape(params.id)
    if(req.decoded.userIndex === commentOwnerId || req.decoded.userIndex === tapeOwnerId){
        const values = [params.id] 
        db.query(commentsql.comment.delete, values, (err) => {
            result.success = true
            console.log(result)
            if(err) result.message = err.message
        })
        res.redirect(`/tape/${req.params.tapeId}`)
    }
});

// 댓글수정
// 댓글 작성자
router.patch("/tape/:tapeId/comment/:id", authVerify, async (req, res) => { 
    const result = { 
        "success": false,
        "message": null,
        "data": []
    }
    const params = req.params
    const commentOwnerId = findIdByComment(params.id)
    if(req.decoded.userIndex === commentOwnerId){
        const values = [req.body.tapeCommentContent, params.id] 
        db.query(commentsql.comment.edit, values, (err) => {
            result.success = true
            console.log(result)
            if(err) result.message = err.message
        })
        res.redirect(`/tape/${params.tapeId}`)
    }
});


module.exports = router