const getAlarm = require("./alarm.sql")
const router = require("express").Router()
const authVerify = require("../module/verify")
const db = require('../data/database')
// db client 추가

// 알림 불러오기 api
router.get("/", async (req, res) => { 

    const userIndex = 2

    const result = { 
        "success": false,
        "message": null,
        "data": []
    }
    
    try { 
        await db.getConnection
        
        const values = [userIndex] 

        const data = await db.query(getAlarm, values)
        
        const row = data[0]
 
        if (row.length > 0) { 
            result.data.push(row)
        } else { 
            result.message = '알림이 존재하지 않습니다.'
        }
        
        result.success = true 
    } catch(err) { 
        result.message = err.message 
    }


    res.send(result) 
})

module.exports = router