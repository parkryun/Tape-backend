const query = require("./tape.sql")
const router = require("express").Router()
const authVerify = require("../module/verify")
const db = require('../data/database')

// 테이프 상세 정보, 댓글 불러오기
router.get("/", async (req, res) => { 
    const tapeId = req.query.tapeId;
    const result = { 
        "success": false,
        "message": null,
        "tapeData": [],
        "musicData": [],
        "comment": []
    }
    
    try { 
        
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

// 오늘의 테이프 불러오기 (본인)
router.get("/user", authVerify, async (req, res) => {
    const userId = req.decoded.uid;
    const result = {
       success: false,
       message: null,
       data: []
    };
    
    try {
    
    await db.getConnection();
      
    const [myTape] = await db.query(query.getMyTape, userId);

       if (myTape.length > 0) {
        
           const [user] = await conn.query(query.getUser, userId);
           
           const myTapeData = myTape.map(t => ({
               userName: user[0].name,
               userProfileImage: user[0].profileimageurl,
               tapeId: t.id,
               title: t.title,
               artist: t.content,
               image: t.tapeimageurl
           }));
               result.data = myTapeData;
       } else {
           result.message = "등록된 나의 테이프가 없습니다.";
       }
       result.success = true;


   } catch (err) {
       result.message = err.message;
   }
   res.send(result);
});

// 오늘의 테이프 불러오기 (친구)
router.get("/friends", authVerify, async (req, res) => {
   const userId = req.decoded.uid;
   const cursor = req.query.cursor;
   const limit = 4;

   const result = {
       success: false,
       message: null,
       data: []
   }

   try{

       await db.getConnection();

       const [followedUsers] = await db.query(query.getFollowedUsers, userId);
       
       const friendsId = followedUsers.map(user => user.followed_id);

       if(friendsId.length === 0){
           result.message = "팔로우하는 친구가 없습니다";
           res.send(result);
           conn.release();
           return;
       }

       let cursorQuery = query.getCursorByLastTapeId;
      
       const [friendsTape] = await db.query(cursorQuery, [friendsId,cursor,limit]);
      
       if(friendsTape.length > 0) {
   
           const isWatched = await db.query(query.getWatchedTape, userId);

           const friendsTapeData = friendsTape.map((tape)=> ({
               userName: tape.nickname,
               userProfileImage: tape.profileimageurl,
               tapeId: tape.id,
               title: tape.title,
               artist: tape.content,
               image: tape.tapeimageurl,
               isWatched: isWatched.some(w => w.tape_id === tape.id)
           }));

           result.data = friendsTapeData;
           result.success = true;
       
       }else{ 
          result.message = "다음 게시물이 없습니다.";
       }

   }catch(err){
       result.message = err.message
   }
   res.send(result);
  
}

);

module.exports = router;

