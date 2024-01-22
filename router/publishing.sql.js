const insertTape = `
  INSERT INTO tape (music_id, tapeimageurl, content)
  VALUES (?, ?, ?)
`;

// tape 테이블에서 모든 데이터를 조회
const getAllTapes = `
  SELECT * FROM tape
`;

// 특정 tape ID에 해당하는 데이터를 조회
const getTapeById = `
  SELECT * FROM tape WHERE id = ?
`;

// 내보낼 쿼리문들을 객체로 정리
module.exports = {
  insertTape,
  getAllTapes,
  getTapeById
};
