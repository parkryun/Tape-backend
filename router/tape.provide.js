const query = require("./tape.sql")
const router = require("express").Router()
const authVerify = require("../module/verify")
const db = require('../data/database')

// 테이프 상세 정보, 댓글 불러오기
router.get("/", async (req, res) => { 

    const result = { 
        "success": false,
        "message": null,
        "tapeData": [],
        "musicData": [],
        "comment": []
    }
    
    try { 
        await db.getConnection
        
        // 테이브 정보 가져오기
        const tapeValues = [tapeId] 

        const tapeData = await db.query(query.getTape, tapeValues) // 테이프 정보
        
        const tapeInfo = tapeData[0]
 
        if (tapeInfo.length > 0) { 
            result.tapeData.push(tapeInfo)
        } else { 
            result.message = '테이프가 존재하지 않습니다.'
        }
        // 음악 정보 가져오기
        const musicValues = [tapeId] 

        const musicData = await db.query(query.getMusic, musicValues) // 음악 정보
        
        const musicInfo = musicData[0]
 
        if (musicInfo.length > 0) { 
            result.musicData.push(musicInfo)
        } else { 
            result.message = '음악이 존재하지 않습니다.'
        }
        
        // 댓글 정보 가져오기
        const commentValues = [tapeId] 

        const commentData = await db.query(query.getComment, commentValues) // 음악 정보
        
        const commentInfo = commentData[0]
 
        if (commentInfo.length > 0) { 
            result.comment.push(commentInfo)
        } else { 
            result.message = '댓글이 존재하지 않습니다.'
        }
        
        result.success = true 
    } catch(err) { 
        result.message = err.message 
    }


    res.send(result) 
})

// 테이프 게시물 불러오기 api
router.get("/post/all", authVerify, async (req, res) => { 

    const userIndex = req.decoded.uid

    const result = { 
        "success": false,
        "message": null,
        "data": []
    }
    
    try { 
        await db.getConnection
        
        const values = [userIndex] 

        const data = await db.query(getTapePost, values)
        
        const row = data[0]
 
        if (row.length > 0) { 
            result.data.push(row)
        } else { 
            result.message = '게시물이 존재하지 않습니다.'
        }
        
        result.success = true 
    } catch(err) { 
        result.message = err.message 
    }


    res.send(result) 
})

// 좋아요 순 테이프 불러오기 api
router.get("/orderby/like", authVerify, async (req, res) => { 

    const userIndex = req.decoded.uid
    const result = { 
        "success": false,
        "message": null,
        "data": []
    }
    
    try { 
        await db.getConnection
        

        const data = await db.query(getTapeOrderbyLike)
        
        const row = data[0]
 
        if (row.length > 0) { 
            result.data.push(row)
        } else { 
            result.message = '테이프가 존재하지 않습니다.'
        }
        
        result.success = true 
    } catch(err) { 
        result.message = err.message 
    }


    res.send(result) 
})


module.exports = router