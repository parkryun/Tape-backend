const query = require("./profile.sql")
const router = require("express").Router()
const authVerify = require("../module/verify")
const db = require('../data/database')

// 사용자 프로필 수정 api
router.patch("/", authVerify, async (req, res) => { 

    const userIndex = req.decoded.uid
    const userNickname = req.body.userNickname
    const introduce = req.body.introduce
    const profileImage = req.body.profileImage // 수정 사항

    const result = { 
        "success": false,
        "message": null
    }
    
    if (userNickname == undefined || introduce == undefined || profileImage == undefined ||
        userNickname.length == 0 || introduce.length == 0 || profileImage.length == 0) 
        {
        result.message = "회원정보 부적합"
        res.send(result)
        return
    } // 회원정보 예외처리
    
    try { 

        await db.getConnection
        
        const values = [userNickname, introduce, profileImage, userIndex] 

        await db.query(query.updateProfile, values)

        result.success = true 
    } catch(err) { 
        result.message = err.message 
    }

    res.send(result) 
})

module.exports = router