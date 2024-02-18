const router = require("express").Router();
const insertHiddenTapeQuery = require("./hidden.sql.js");
const pool = require("../data/database.js");

// 테이프 안보기
router.post('/', async(req, res) => {
    const tapeId = req.body.tapeId;
    const userId = req.body.userId;

    const result = { 
        "success": false,
        "message": null,
    }
    try {
        const conn = await pool.getConnection();
        const values = [tapeId, userId];
        await pool.query(insertHiddenTapeQuery,values);
        result.success = true;

        conn.release();
        
    } catch(error) {
        result.message = error.message;
    }
    res.send(result);
});

module.exports = router;