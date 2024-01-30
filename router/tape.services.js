const postTape = require("./tape.sql")
const deleteTape = require("./tape.sql")

const router = require("express").Router()
const authVerify = require("../module/verify")
const db = require('../data/database')

// 테이프 게시물 등록 api
router.post("/", authVerify, async (req, res) => { 

    const userIndex = req.decoded.userIndex
    const tapeId = req.body.tapeId
    const tapeIntroduce = req.body.tapeIntroduce

    const result = { 
        "success": false,
        "message": null
    }
    
    if (tapeId == undefined || tapeIntroduce == undefined ||
        tapeId.length == 0 || tapeIntroduce.length == 0) 
        {
        result.message = "게시물 정보 부적합"
        res.send(result)
        return
    } // 회원정보 예외처리
    
    try { 

        await db.getConnection

        const values = [tapeId, tapeIntroduce] 

        await db.query(postTape, values)
        result.success = true 
    } catch(err) { 
        result.message = err.message 
    }

    if (client) client.end() 

    res.send(result) 
})

// 테이프 게시물 삭제 api
router.delete("/", authVerify, async (req, res) => { 

    const userIndex = req.decoded.userIndex
    const tapeId = req.body.tapeId

    const result = { 
        "success": false,
        "message": null
    }
    
    if (tapeId == undefined || tapeId.length == 0) 
        {
        result.message = "게시물 정보 부적합"
        res.send(result)
        return
    } // 회원정보 예외처리
    
    try { 

        await db.getConnection

        const values = [tapeId] 

        await db.query(deleteTape, values)
        result.success = true 
    } catch(err) { 
        result.message = err.message 
    }

    if (client) client.end() 

    res.send(result) 
})

module.exports = router