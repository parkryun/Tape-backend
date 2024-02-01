// tape 테이블에 데이터를 삽입
const insertTapeData = `
    INSERT INTO tape (id, user_id, title, content, created_at, tapeimageurl, is_profile)
    VALUES (?, ?, ?, ?, STR_TO_DATE(?, '%Y-%m-%d %H:%i:%s'), ?, ?)
`;

// tape_music 테이블에 데이터를 삽입
const insertTapeMusicData = `
    INSERT INTO tape_music (tape_id, music_id, content)
    VALUES (?, ?, ?)
`;

module.exports = {
    insertTapeData,
    insertTapeMusicData
};
