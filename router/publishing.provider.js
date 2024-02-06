const query = require("./publishing.sql")
const router = require("express").Router()
const authVerify = require("../module/verify")
const db = require('../data/database')


// 오늘의 테이프 등록 api
router.post("/today",authVerify, async (req, res) => { 

    // const userIndex = req.decoded.userIndex
    const userIndex = 1
    // const tapeImg = req.body.tapeImg
    const tapeTitle = req.body.tapeTitle
    const tapeContent = req.body.tapeContent
    
    const musicId = req.body.tapeMusicData[0].musicId
    const content = req.body.tapeMusicData[0].content

    const result = { 
        "success": false,
        "message": null
    }
    
    if (tapeTitle == undefined || tapeContent == undefined || musicId == undefined || content == undefined ||
        tapeTitle.length == 0 || tapeContent.length == 0 || musicId.length == 0 || content.length == 0) 
        {
        result.message = "테이프 정보 부적합"
        res.send(result)
        return
    } // 회원정보 예외처리
    
    try { 

        await db.getConnection

        const tapeValues = [userIndex, tapeTitle, tapeContent, false] // 이미지 추가
        await db.query(query.postTodayTape, tapeValues)
        
        data = await db.query(`SELECT id FROM tape WHERE user_id = ${userIndex} ORDER BY created_at DESC limit 1`) // tape_id 가져오기

        tapeId = data[0][0].id

        const musicValues = [tapeId, musicId, content] // 음악 여러개 넣는거 해야됨
        await db.query(query.postTapeMusic, musicValues)
        
        result.success = true 
    } catch(err) { 
        result.message = err.message 
    }

    res.send(result) 
})

// 테이프 게시물 등록 api
router.post("/",authVerify, async (req, res) => { 

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

        await db.query(query.postTape, values)
        result.success = true 
    } catch(err) { 
        result.message = err.message 
    }

    if (client) client.end() 

    res.send(result) 
})

// 사용자 ID 찾는 함수
async function findOwnerId(tapeId) {
    const [rows] = await db.query(`SELECT user_id FROM tape WHERE id = ?`, [tapeId]);
    if (rows.length > 0) {
        return rows[0].user_id;
    } else {
        return null; 
    }
}

// 테이프 삭제 API
router.delete("/", authVerify, async (req, res) => {
    const userIndex = req.decoded.userIndex;
    const tapeId = req.body.tapeId;

    const result = {
        "success": false,
        "message": null
    };

    if (tapeId == undefined || tapeId.length == 0) {
        result.message = "게시물 정보 부적합";
        return res.send(result);
    }

    try {

        await db.getConnection
        // 테이프 소유자 ID를 찾기
        const tapeOwnerId = await findOwnerId(tapeId);

        if (tapeOwnerId === null) {
            result.message = "해당 테이프가 존재하지 않습니다.";
            return res.status(404).send(result);
        }

        // 현재 사용자가 테이프의 소유자인지 확인
        if (userIndex !== tapeOwnerId) {
            result.message = "삭제 권한이 없습니다.";
            return res.status(403).send(result);
        }

        // 삭제 권한이 확인되면 테이프 삭제
        await db.query(query.deleteTape, [tapeId]);
        result.success = true;
    } catch (err) {
        result.message = err.message;
    }

    res.send(result);
});

// 테이프 좋아요 API
router.post("/tape/like/",authVerify, async (req, res) => {

    const userId = req.decoded.userIndex; 
    const tapeId = req.body.tapeId;

    const result = {
        "success": false,
        "message": ""
    };

    try {

        await db.getConnection

        const [likes] = await db.query(query.checkTapeLike, [userId, tapeId]);
        if (likes.length > 0) {
            // 좋아요가 있다면 삭제
            await db.query(query.removeTapeLike, [userId, tapeId]);
            
        } else {
            // 좋아요가 없다면 추가
            await db.query(query.addTapeLike, [userId, tapeId]);
            
        }
        result.success = true;
    } catch (err) {
        result.message = err.message;
        
    }
    res.send(result);
});

// 테이프 내 음악 좋아요 API
router.post("/tape/music/like/", authVerify, async (req, res) => {
    const userId = req.decoded.userIndex; // JWT에서 사용자 ID 추출
    const { tapeId, tapeMusicId } = req.body;

    const result = {
        "success": false,
        "message": ""
    };

    try {
        await db.getConnection;

        const [musicLikes] = await db.query(query.checkMusicLike, [userId, tapeMusicId]);
        if (musicLikes.length > 0) {
            // 좋아요가 있다면 삭제
            await db.query(query.removeMusicLike, [userId, tapeMusicId]);
        } else {
            // 좋아요가 없다면 추가
            await db.query(query.addMusicLike, [userId, tapeId, tapeMusicId]);
        }
        result.success = true;
    } catch (err) {
        result.message = err.message;
    }

    res.send(result);
});

// 테이프 듣기 API 
router.get("/tape/listen", authVerify, async (req, res) => {
    const tapId = parseInt(req.query.tapId, 10); 

    const result = {
        success: false,
        message: "",
        tapeMusicData: []
    };

    if (isNaN(tapId)) {
        result.message = "tapId가 유효하지 않습니다.";
        return res.status(400).send(result);
    }

    try {
        const [rows] = await db.query(query.getTapeMusicByTapeId, [tapId]);

        if (rows.length > 0) {
            result.success = true;
            result.tapeMusicData = rows;
        } else {
            result.message = "해당 테이프에 대한 음악 데이터가 없습니다.";
        }
    } catch (err) {
        result.message = `데이터 조회 중 오류가 발생했습니다: ${err.message}`;
    }

    res.send(result);
});

module.exports = router