const express = require('express');
const router = express.Router();
const db = require('../data/db');
const { insertTape, insertTodayTape, insertTapeMusic } = require('./publishing.sql');

// 기존의 테이프 등록 API
router.post('/', async (req, res) => {
  const { musicId, tapeImage, tapeIntroduce } = req.body;

  try {
    const result = await db.query(insertTape, [musicId, tapeImage, tapeIntroduce]);

    if (result.affectedRows > 0) {
      res.status(201).json({
        success: true,
        message: '게시글 등록',
        tapeId: result.insertId
      });
    } else {
      throw new Error('생성 실패');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: '데이터베이스 오류가 발생했습니다.'
    });
  }
});

// 오늘의 테이프 정보 등록 API
router.post('/today', async (req, res) => {
  const { tapeImg, tapeTitle, tapeIntro, tapeComment, tapeMusicData } = req.body;

  try {
    // 먼저 tape 테이블에 오늘의 테이프 정보를 등록합니다.
    const tapeResult = await db.query(insertTodayTape, [tapeImg, tapeTitle, tapeIntro]);
    const tapeId = tapeResult.insertId;

    // tape_music 테이블에 음악 정보를 등록합니다.
    if (tapeMusicData && tapeMusicData.length > 0) {
      await Promise.all(tapeMusicData.map(music =>
        db.query(insertTapeMusic, [tapeId, music.musicId, music.content])
      ));
    }

    res.status(201).json({
      success: true,
      message: '오늘의 테이프 정보가 등록되었습니다.',
      tapeId
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: '데이터베이스 오류가 발생했습니다.'
    });
  }
});

module.exports = router;
