const query = require("./profile.sql")
const router = require("express").Router()
const authVerify = require("../module/verify")
const db = require('../data/database')

// 사용자 프로필 수정 api
router.put("/", authVerify, async (req, res) => { 
    
    const userIndex = req.decoded.uid
    const userNickname = req.body.userNickname
    const introduce = req.body.introduce
    const profileImage = req.body.profileImage // 사진 보류

    const result = { 
        "success": false,
        "message": null
    }
    
    if (userNickname == undefined || introduce == undefined ||
        userNickname.length == 0 || introduce.length == 0) 
        {
        result.message = "회원정보 부적합"
        res.send(result)
        return
    } // 회원정보 예외처리
    
    try { 

        const values = [userNickname, introduce, profileImage, userIndex] 

        await db.query(query.updateProfile, values)

        result.success = true 
        result.message = "회원정보 수정 완료"
    } catch(err) { 
        result.message = err.message 
    }

    res.send(result) 
})

module.exports = router