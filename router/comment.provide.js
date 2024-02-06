const express = require('express')
const router = express.Router();
const jwt = require('jsonwebtoken');
const authVerify = require("../module/verify");
const db = require('../data/database.js');
const commentsql = require("./comment.sql")

router.get("/tape/:tapeId", (req, res) => {
    const result = { 
        "success": false,
        "message": null,
        "data": [],
    }
    console.log(req.query)
    try {
        const values = [req.params.tapeId]
        const data = db.query(commentsql.comment.get, values, (err,data) => {
            result.success = true
            result.data = data
            // result.data = JSON.stringify(data)
            console.log(result) 
            res.send(result) 
        })
    }catch(err){
        result.message = err.message 
    }

});

module.exports = router