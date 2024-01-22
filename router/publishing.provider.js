const express = require('express');
const router = express.Router();
const db = require('../data/db'); 
const { insertTape } = require('../router/publishing.sql'); 

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

module.exports = router;
