const query = require("./tape.sql")

const router = require("express").Router()
const authVerify = require("../module/verify")
const db = require('../data/database')

// 오늘의 테이프 등록 api
router.post("/today", authVerify, async (req, res) => { 

    const userIndex = req.decoded.uid
    
    // const tapeImg = req.body.tapeImg
    const tapeTitle = req.body.tapeTitle
    const tapeContent = req.body.tapeContent
    
    const musicId = req.body.tapeMusicData[0].musicId

    const result = { 
        "success": false,
        "message": null
    }
    
    if (tapeTitle == undefined || tapeContent == undefined || musicId == undefined ||
        tapeTitle.length == 0 || tapeContent.length == 0 || musicId.length == 0 ) 
        {
        result.message = "테이프 정보 부적합"
        res.send(result)
        return
    } // 회원정보 예외처리
    
    try { 

        await db.getConnection

        const tapeValues = [userIndex, tapeTitle, tapeContent] // 이미지 추가
        await db.query(query.postTodayTape, tapeValues)
        
        data = await db.query(`SELECT id FROM tape WHERE user_id = ${userIndex} ORDER BY created_at DESC limit 1`) // tape_id 가져오기

        tapeId = data[0][0].id

        const musicValues = [tapeId, musicId] // 음악 여러개 넣는거 해야됨
        await db.query(query.postTapeMusic, musicValues)
        
        result.success = true 
        result.message = "테이프 등록 성공"
    } catch(err) { 
        result.message = err.message 
    }

    res.send(result) 
})

// 테이프 게시물 등록 api > sql 바꾸기
router.post("/", authVerify, async (req, res) => { 

    const userIndex = req.decoded.uid
    const tapeId = req.query.tapeId
    const tapeIntroduce = req.query.tapeIntroduce

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

        await db.query(query.postTape, values)
        result.success = true 
    } catch(err) { 
        result.message = err.message 
    }

    res.send(result) 
})

// 테이프 음악 좋아요 api
router.post("/music/like", authVerify, async (req, res) => { 

    const userIndex = req.decoded.uid
    const tapeMusicId = req.query.tapeMusicId

    const result = { 
        "success": false,
        "message": null
    }
    
    if (tapeMusicId == undefined ||
        tapeMusicId.length == 0) 
        {
        result.message = "테이프 음악 정보 부적합"
        res.send(result)
        return
    } // 회원정보 예외처리
    
    try { 

        await db.getConnection

        const values = [tapeMusicId, userIndex] 

        await db.query(query.postMusicLike, values)
        result.success = true 
    } catch(err) { 
        result.message = err.message 
    }

    res.send(result) 
})

// 테이프 삭제 api
router.delete("/", authVerify, async (req, res) => { 

    const userIndex = req.decoded.uid
    const tapeId = req.query.tapeId
    
    const result = { 
        "success": false,
        "message": null
    }
    
    if (tapeId == undefined || tapeId.length == 0) 
        {
        result.message = "테이프 정보 부적합"
        res.send(result)
        return
    } // 회원정보 예외처리
    
    try { 

        await db.getConnection

        const values = [tapeId] 

        await db.query(query.deleteTape, values)
        result.success = true 
    } catch(err) { 
        result.message = err.message 
    }

    res.send(result) 
})

// 테이프 게시물 삭제 api
router.delete("/post", authVerify, async (req, res) => { 

    const userIndex = req.decoded.uid
    const tapePostId = req.query.tapePostId

    const result = { 
        "success": false,
        "message": null
    }
    
    if (tapePostId == undefined || tapePostId.length == 0) 
        {
        result.message = "게시물 정보 부적합"
        res.send(result)
        return
    } // 회원정보 예외처리
    
    try { 

        await db.getConnection

        const values = [tapePostId] 

        await db.query(query.deleteTapePost, values)
        result.success = true 
    } catch(err) { 
        result.message = err.message 
    }

    res.send(result) 
})

module.exports = router