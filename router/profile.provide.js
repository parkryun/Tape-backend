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
        "data": { }

    }
    try { 
        const values = [userIndex] 

        const data = await db.query(query.getProfile, values)

        const row = data[0][0];
        
        const followerData = await db.query(query.getFollower, values)
        const followerRow = followerData[0][0].followers
        
        const followingData = await db.query(query.getFollowing, values)

        const followingRow = followingData[0][0].followings

        const tapeData = await db.query(query.getTapeById, values);

        if (row!==null) { 
            result.data.userNickname = row.nickname;
            result.data.userImage = row.profileImageurl;// 사진은 보류
            result.data.introduce = row.introduce;
        } else { 
            result.message = '회원정보가 존재하지 않습니다.'
        }
        result.data.followers = followerRow;
        result.data.followings = followingRow;
        
        result.data.tapeData = tapeData[0][0]; //사진은 보류

        result.success = true 
    } catch(err) { 
        result.message = err.message 
    }

    res.send(result) 
})

module.exports = router