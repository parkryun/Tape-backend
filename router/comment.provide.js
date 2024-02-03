comment.provide.js

const express = require('express')
const router = express.Router();
const jwt = require('jsonwebtoken');
const authVerify = require("../module/verify");
const db = require('../data/database');


router.get(`tape/:tapeId`,async (req, res) => { 
    const result = { 
        "success": false,
        "message": null,
        "data": []
    }
    try {
        const values = [req.params.tapeId] 
        const data = db.query(commentsql.get, values, (err, data))
        const row = data.rows
        if (row.length > 0) { 
            result.data.push(row)
        } else { 
            result.message = err.message
        }
        result.success = true 
    } catch(err) { 
        result.message = err.message 
    }
    res.send(result) 
});

