const postfollow = require("./follow.sql")
const router = require("express").Router()
const authVerify = require("../module/verify")
const db = require('../data/database')

router.post("/", authVerify, async (req, res) => { 

    const userIndex = req.decoded.userIndex
    const followerId = userIndex
    const followedId = req.body.followedId

    const result = { 
        "success": false,
        "message": null,
    }
    
    if (followedId == undefined || followerId == undefined || followedId.length == 0 || followerId.length == 0) {
        result.message = "회원정보 부적합"
        res.send(result)
        return
    } // 회원정보 예외처리
    
    try { 

        await db.getConnection
        
        const values = [followerId, followedId] 

        await db.query(postfollow, values)
        
        result.success = true 
    } catch(err) { 
        result.message = err.message 
    }

    if (client) client.end() 

    res.send(result) 
})


module.exports = router