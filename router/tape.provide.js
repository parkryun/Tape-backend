const getTapePost = require("./tape.sql")
const getTapeOrderbyLike = require("./tape.sql")
const router = require("express").Router()
const authVerify = require("../module/verify")
const db = require('../data/database')
// db client 추가

// 테이프 게시물 불러오기 api
router.get("/post/all", async (req, res) => { 

    const userIndex = 2

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
router.get("/orderby/like", async (req, res) => { 

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