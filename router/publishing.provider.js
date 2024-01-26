const express = require('express');
const router = express.Router();
const db = require('../data/db');
const { insertTape, insertTodayTape, insertTapeMusic } = require('./publishing.sql');

// 기존의 테이프 등록 API
router.post('/tape', async (req, res) => {
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
router.post('/tape/today', async (req, res) => {
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

router.get('/tape/tapeId', async (req, res) => {
  const { tapeId } = req.params;

  try {
    const tapeDetails = await db.query(getTapeDetailsById, [tapeId]);

    if (tapeDetails.length > 0) {
      const tapeData = tapeDetails.map((detail) => ({
        tapeImg: detail.tapeimageurl,
        tapeTitle: detail.title,
        tapeIntro: detail.content,
        postDate: detail.created_at, // 'created_at' 필드를 'postDate'로 매핑
        tapeMusicData: {
          musicId: detail.music_id,
          content: detail.music_content // 'music_content' 필드를 'content'로 매핑
        }
      }));

      res.status(200).json({
        success: true,
        message: '테이프 상세 정보 조회 성공',
        tapedata: tapeData[0]
      });
    } else {
      res.status(404).json({
        success: false,
        message: '테이프 정보를 찾을 수 없습니다.'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: '데이터베이스 오류가 발생했습니다.'
    });
  }
});

module.exports = router;
