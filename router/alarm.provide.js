const query = require("./alarm.sql")
const router = require("express").Router()
const authVerify = require("../module/verify")
const db = require('../data/database')
// db client 추가

// 알림 불러오기 api
router.get("/all", authVerify, async (req, res) => { 

    const userIndex = req.decoded.uid

    const result = { 
        "success": false,
        "message": null,
        "data": []
    }
    
    try { 
        
        const values = [userIndex] 

        const data = await db.query(query.getAlarm, values)

        const row = data[0]
 
        if (row.length > 0) { 
            result.data.push(row)
        } else { 
            result.message = '알림이 존재하지 않습니다.'
        }
        
        result.success = true 
        result.message = "알림 정보 전달"
    } catch(err) { 
        result.message = err.message 
    }


    res.send(result) 
})

module.exports = router