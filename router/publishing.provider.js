const db = require('../data/database');
const { insertTapeData, insertTapeMusicData, getAllTapesData, getTapeMusicByTapeId } = require('./publishing.sql');
const router = require('express').Router();

// 테이프 등록 라우트
router.post('/tape/today', async (req, res) => {
    // 클라이언트로부터 받은 데이터 (임시 데이터)
    const userId = 1; 
    const tapeImg = 'http://example.com/path/to/image.png';
    const tapeTitle = '테스트 제목';
    const tapeIntro = '테스트 소개';
    const tapeComment = '테스트 댓글';
    const tapeMusicData = [
        { musicId: 1, content: '첫 번째 음악 설명' },
    ];

    try {
        // 현재 날짜와 시간을 생성
        const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

        // tape 테이블에 데이터를 삽입하고 삽입된 행의 ID를 가져옵니다 (id 컬럼은 자동 증가됨)
        const [insertResult] = await db.query(insertTapeData, [
            userId,
            tapeTitle,
            tapeIntro,
            createdAt,
            tapeImg,
            false // is_profile
        ]);

        const tapeId = insertResult.insertId; // 삽입된 tape의 id를 가져옴, 외래키

        // tape_music 테이블에 데이터를 삽입합니다.
        for (const { musicId, content } of tapeMusicData) {
            await db.query(insertTapeMusicData, [
                tapeId, // 새로 생성된 tape의 id
                musicId,
                content
            ]);
        }

        res.status(201).send({
            result: {
                success: true,
                message: '테이프와 음악 데이터 저장 성공',
                tapeId: tapeId // 새로 생성된 tape의 id를 응답에 포함
            }
        });
    } catch (err) {
        res.status(500).send({
            result: {
                success: false,
                message: '데이터 저장 실패: ' + err.message
            }
        });
    }
});

// 테이프 데이터 조회 라우트
router.get('/tape', async (req, res) => {
    try {
        const [tapes] = await db.query(getAllTapesData);
        res.status(200).json({
            success: true,
            data: tapes
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "데이터 조회에 실패했습니다: " + err.message
        });
    }
});

module.exports = router;
