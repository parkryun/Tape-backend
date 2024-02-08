const query = require("./profile.sql")
const router = require("express").Router()
const authVerify = require("../module/verify")
const db = require('../data/database')

// 사용자 프로필 불러오기 api
router.get("/", authVerify, async (req, res) => { 

    const userIndex = req.decoded.uid
    const result = { 
        "success": false,
        "message": null,
        "data": []
    }
    try { 

        await db.getConnection
        
        const values = [userIndex] 

        const data = await db.query(query.getProfile, values)

        const row = data[0]
        
        const followerData = await db.query(query.getFollower, values)
        
        const followerRow = followerData[0][0]
        
        const followingData = await db.query(query.getFollowing, values)

        const followingRow = followingData[0][0]

        if (row.length > 0) { 
            result.data.push(row)
        } else { 
            result.message = '회원정보가 존재하지 않습니다.'
        }

        if (followerRow.followers > 0) { 
            result.data.push(followerRow)
        } else { 
            result.message = '팔로워 정보가 존재하지 않습니다'
        }

        if (followingRow.followings > 0) { 
            result.data.push(followingRow)
        } else { 
            result.message = '팔로우 정보가 존재하지 않습니다.'
        }
        
        result.success = true 
    } catch(err) { 
        result.message = err.message 
    }

    res.send(result) 
})

module.exports = router