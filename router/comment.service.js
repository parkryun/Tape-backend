
const express = require('express')
const router = express.Router();
const jwt = require('jsonwebtoken');
const authVerify = require("../module/verify");
const db = require('../data/database');
const commentsql = require("./comment.sql");

async function findIdByComment(id) {
    const values = [id]
    return new Promise((resolve, reject) => {
        db.query(commentsql.comment.getIdByComment, values, (err, data) => {
            if(err)reject(0)
            else {
                const value = data[0].user_id
                resolve(value)
                
            }
        });
    })
}

async function findIdByTape(commentId) {
    const values = [commentId]
    return new Promise((resolve, reject) => {
        db.query(commentsql.comment.getIdByTape, values, (err, data) => {
            if(err) reject(0)
            else{
                const value = data[0].user_id
                resolve(value)
            }
        });
    })
}

// 댓글작성
// 회원
router.post("/tape/comment", authVerify, (req, res) => { 
    const result = { 
        "success": false,
        "message": null,
        "data": []
    }
    const values = [req.query.tapeId ,req.decoded.userId, req.body.tapeCommentContent]
    db.query(commentsql.comment.save, values,(err)=>{
        if(err) {
            result.message = err.message;
            res.send(result)
        }
        else {
            result.success = true
            res.send(result)
        }
    });
    // res.redirect(`/tape/${req.params.tapeId}`)   
});

// 댓글삭제
// 테이프 작성자, 댓글 작성자
router.delete("/tape/comment", authVerify ,async (req, res) => { 
    const result = { 
        "success": false,
        "message": null,
        "data": []
    }

    const query = req.query
    const commentOwnerId = await findIdByComment(query.commentId)
    const tapeOwnerId = await findIdByTape(query.commentId)
    if(req.decoded.userId == commentOwnerId || req.decoded.userId == tapeOwnerId){
        const values = [query.commentId] 
        db.query(commentsql.comment.delete, values, (err) => {
            if(err) {
                result.message = err.message
                res.send(result)
            }
            else{
                result.success = true
                res.send(result)
            }
        })
    }
}
);

// 댓글수정
// 댓글 작성자
router.patch("/tape/comment", authVerify, async (req, res) => { 
    const result = { 
        "success": false,
        "message": null,
        "data": []
    }
    const query = req.query
    const commentOwnerId = await findIdByComment(query.id)
    if(req.decoded.userId == commentOwnerId){
        const values = [req.body.tapeCommentContent, query.commentId] 
        db.query(commentsql.comment.edit, values, (err) => {
            if(err) {
                result.message = err.message
                res.send(result)
            }
            else{
                result.success = true
                res.send(result)
            }
        })
    }
});

router.get("/tape/test", async (req,res) => {
    const query = req.query
    const commentOwnerId = await findIdByComment(16)
    const tapeOwnerId = await findIdByTape(16)
    console.log(commentOwnerId)
    console.log(tapeOwnerId)
})



module.exports = router