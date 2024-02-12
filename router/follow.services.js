const query = require("./follow.sql")
const router = require("express").Router()
const authVerify = require("../module/verify")
const db = require('../data/database')

router.post("/", authVerify, async (req, res) => { 

    const followerId = req.decoded.uid
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
        
        const values = [followerId, followedId] 

        await db.query(query.postfollow, values)
        
        result.success = true 
        result.message = "팔로우 성공"
    } catch(err) { 
        result.message = err.message 
    }
    res.send(result) 
})

//언팔
router.post("/cancel", authVerify, async (req,res)=>{
    const followerId = req.decoded.uid
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
        
        const values = [followerId, followedId] 

        await db.query(query.deletefollow, values)
        
        result.success = true 
        result.message = "팔로우 취소 성공"
    } catch(err) { 
        result.message = err.message 
    }
    res.send(result) 
})


module.exports = router