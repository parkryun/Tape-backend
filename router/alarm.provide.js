const getAlarm = require("./alarm.sql")
const router = require("express").Router()
const authVerify = require("../module/verify")
// db client 추가

// 알림 불러오기 api
router.get("/all", authVerify, async (req, res) => { 

    const userIndex = req.decoded.userIndex

    const result = { 
        "success": false,
        "message": null,
        "data": []
    }
    
    try { 

        client = new Client()

        await client.connect()
        
        const values = [userIndex] 

        const data = await client.query(getAlarm, values)
        const row = data.rows
 
        if (row.length > 0) { 
            result.data.push(row)
        } else { 
            result.message = '알림이 존재하지 않습니다.'
        }
        
        result.success = true 
    } catch(err) { 
        result.message = err.message 
    }

    if (client) client.end() 

    res.send(result) 
})

module.exports = router