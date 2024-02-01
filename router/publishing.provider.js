const db = require('../data/database');
const { insertTapeData, insertTapeMusicData } = require('./publishing.sql');
const router = require('express').Router();

// 테이프 등록
router.post('/tape/today', async (req, res) => {
    try {
        await db.getConnection();

        // 임의의 데이터
        const id = 1; // 기본 키 id
        const userId = 2; // 외래 키 user_id
        const tapeImg = 'C:\\Users\\land8\\OneDrive\\바탕 화면\\sign_junsoo.png';
        const tapeTitle = '제목';
        const tapeIntro = '소개';
        const tapeComment = '댓글';
        const tapeMusicData = [
            { musicId: 1, content: '첫 번째 음악 설명' }
        ];

        // 현재 날짜와 시간을 생성
        const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

        // tape 테이블에 데이터를 삽입 
        await db.query(insertTapeData, [
            id,
            userId,
            tapeTitle,
            tapeIntro,
            createdAt, // 수정된 부분: 현재 시간으로 변경
            tapeImg,
            false
        ]);

        // tape_music 테이블에 데이터를 삽입합니다.
        for (const tapeMusic of tapeMusicData) {
            await db.query(insertTapeMusicData, [
                tapeMusic.musicId,
                tapeMusic.content
            ]);
        }

        res.status(201).send({
            result: {
                success: true,
                message: '테이프와 음악 데이터 저장 성공'
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

module.exports = router;
