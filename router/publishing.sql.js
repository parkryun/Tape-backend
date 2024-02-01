// tape 테이블에 데이터를 삽입
const insertTapeData = `
    INSERT INTO tape (user_id, title, content, created_at, tapeimageurl, is_profile)
    VALUES (?, ?, ?, ?, ?, ?)
`;

// tape_music 테이블에 데이터를 삽입
const insertTapeMusicData = `
    INSERT INTO tape_music (tape_id, music_id, content)
    VALUES (?, ?, ?)
`;

// tape 테이블에서 모든 데이터를 조회하는 쿼리
const getAllTapesData = `
    SELECT * FROM tape
`;

// 특정 tape_id에 해당하는 tape_music 테이블 데이터를 조회하는 쿼리
const getTapeMusicByTapeId = `
    SELECT * FROM tape_music WHERE tape_id = ?
`;

// tape 테이블에서 특정 id의 데이터를 삭제하는 쿼리
const deleteTapeById = `
    DELETE FROM tape WHERE id = ?
`;

module.exports = {
    insertTapeData,
    insertTapeMusicData,
    getAllTapesData,
    getTapeMusicByTapeId,
    deleteTapeById 
};
