const query = require("./tape.sql.js");
const router = require("express").Router();
const authVerify = require("../module/verify.js");
const pool = require("../data/database.js");

// 오늘의 테이프 불러오기 (본인)
router.get("/", authVerify, async (req, res) => {
    // const userId = req.query.userId;
     const userId = req.decoded.uid;
    
    const result = {
        success: false,
        message: null,
        data: []
    };

    try {
        const conn = await pool.getConnection();
       
        const [myTape] = await conn.query(query.getMyTape, userId);

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
        conn.release();

    } catch (err) {
        result.message = err.message;
    }
    res.send(result);
});

// 오늘의 테이프 불러오기 (친구)
router.get("/friends", authVerify, async (req, res) => {

    const userId = req.decoded.uid;
    //const userId = req.query.userId;
    const cursor = req.query.cursor;
    const limit = 4;

    const result = {
        success: false,
        message: null,
        data: []
    }

    try{

        const conn = await pool.getConnection();

        const [followedUsers] = await pool.query(query.getFollowedUsers, userId);
        
        const friendsId = followedUsers.map(user => user.followed_id);

        if(friendsId.length === 0){
            result.message = "팔로우하는 친구가 없습니다";
            res.send(result);
            conn.release();
            return;
        }

        let cursorQuery = query.getCursorByLastTapeId;
       
        const [friendsTape] = await pool.query(cursorQuery, [friendsId,cursor,limit]);
       
        if(friendsTape.length > 0) {
    
            const isWatched = await conn.query(query.getWatchedTape, userId);

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
            conn.release();
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