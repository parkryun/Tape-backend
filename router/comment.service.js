
const express = require('express')
const router = express.Router();
const jwt = require('jsonwebtoken');
const authVerify = require("../module/verify");
const db = require('../data/database');
const commentsql = require("./comment.sql");

function findId(id) {
    const values = [id]
    const row = db.query(commentsql.comment.getId, values);
    if (row.length > 0) {
        return row.user_id;
    } else {
        return null; 
    }
}

// 댓글작성
// 회원
router.post("/tape/:tapeId/comment", authVerify ,(req, res) => { 
    const result = { 
        "success": false,
        "message": null,
        "data": []
    }
    try {
        const values = [req.params.tapeId, req.body.userIndex, req.body.tapeCommentContent] 
        db.query(commentsql.comment.save, values)
        result.success = true
        console.log(result)   
    } catch(err) { 
        result.message = err.message 
    }
    res.redirect(`/tape/${req.params.tapeId}`)   
});

// 댓글삭제
// 테이프 작성자, 댓글 작성자
router.delete(`tape/:tapeId/comment/:id`, authVerify, async (req, res) => { 
    const result = { 
        "success": false,
        "message": null,
        "data": []
    }
    const params = req.params
    const commentOwnerId = findId(params.tapeId)
    const tapeOwnerId = findId(params.id)
    if(req.decoded.userIndex === commentOwnerId || req.decoded.userIndex === tapeOwnerId){
        try {
            const values = [req.params.id] 
            db.query(commentsql.comment.delete, values)
            result.success = true 
        } catch(err) { 
            result.message = err.message 
        }
        res.redirect(`tape/:tapeId`)
    }
});

// 댓글수정
// 댓글 작성자
router.patch(`/tape/:tapeId/comment/:id`, authVerify, async (req, res) => { 
    const result = { 
        "success": false,
        "message": null,
        "data": []
    }
    const commentOwnerId = findId(params.id)
    if(req.decoded.userIndex === commentOwnerId){
        try {
            const values = [req.params.tapeId, req.decoded.userId, req.body.tapeCommentContent] 
            db.query(commentsql.comment.save, values, (err) => {
                if(err) result.message = err.message
            })
            result.success = true 
        } catch(err) { 
            result.message = err.message 
        }
        res.redirect(`tape/:tapeId`)
    }
});



module.exports = router