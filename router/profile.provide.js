const getProfile = require("./profile.sql")
const router = require("express").Router()
const authVerify = require("../module/verify")
const db = require('../data/database')
// db client 추가

// 사용자 프로필 불러오기 api
router.get("/", authVerify, async (req, res) => { 

    const userIndex = req.decoded.userIndex

    const result = { 
        "success": false,
        "message": null,
        "data": []
    }
    
    try { 

        await db.getConnection
        
        const values = [userIndex] 

        const data = await db.query(getProfile, values)

        const row = data[0]
 
        if (row.length > 0) { 
            result.data.push(row)
        } else { 
            result.message = '회원정보가 존재하지 않습니다.'
        }
        
        result.success = true 
    } catch(err) { 
        result.message = err.message 
    }

    if (client) client.end() 

    res.send(result) 
})

module.exports = router