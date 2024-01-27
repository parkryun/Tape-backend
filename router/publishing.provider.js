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

// 테이프 상세 정보 불러오기 API 
router.get('/tape/:tapeid', async (req, res) => {
  const { tapeId } = req.params.tapeid;

  try {
    const tapeDetails = await db.query(getTapeDetailsById, [tapeId]);

    if (tapeDetails.length > 0) {
      const tapeData = tapeDetails.map((detail) => ({
        tapeImg: detail.tapeimageurl,
        tapeTitle: detail.title,
        tapeIntro: detail.content,
        postDate: detail.created_at, 
        tapeMusicData: {
          musicId: detail.music_id,
          content: detail.music_content 
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

// 테이프 듣기 API
router.get('/tape/listen/:tapeid', async (req, res) => {
  const { tapeId } = req.params.tapeid;

  try {
    // 특정 tape ID에 해당하는 상세 데이터를 조회합니다.
    const tapeDetails = await db.query(getTapeDetailsById, [tapeId]);

    if (tapeDetails.length > 0) {
      const tapeMusicData = tapeDetails.map((detail) => ({
        musicId: detail.music_id,
        content: detail.music_content 
      }));

      res.status(200).json({
        query: { tapeId },
        result: {
          success: true,
          message: '테이프 정보 조회 성공',
          tapeMusicData: tapeMusicData
        }
      });
    } else {
      res.status(404).json({
        query: { tapeId },
        result: {
          success: false,
          message: '테이프 정보를 찾을 수 없습니다.'
        }
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      query: { tapeId },
      result: {
        success: false,
        message: '데이터베이스 오류가 발생했습니다.'
      }
    });
  }
});

module.exports = router;
