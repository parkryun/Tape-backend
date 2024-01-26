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

// 오늘의 테이프 정보를 등록하는 쿼리문
const insertTodayTape = `
  INSERT INTO tape (tapeimageurl, title, content)
  VALUES (?, ?, ?)
`;

// 오늘의 테이프에 등록된 음악 정보를 등록하는 쿼리문
const insertTapeMusic = `
  INSERT INTO tape_music (tape_id, music_id, content)
  VALUES (?, ?, ?)
`;

// 오늘의 테이프 정보와 음악 정보를 함께 조회하는 쿼리문
const getTodayTapeWithMusic = `
  SELECT t.*, tm.music_id, tm.content as music_content
  FROM tape t
  JOIN tape_music tm ON t.id = tm.tape_id
  WHERE t.id = ?  // 혹은 오늘 날짜를 기준으로 조회하는 조건을 추가할 수 있습니다.
`;

// 특정 tape ID에 해당하는 상세 데이터를 조회하는 쿼리문
const getTapeDetailsById = `
  SELECT tape.*, tm.music_id, tm.content as music_content
  FROM tape
  LEFT JOIN tape_music tm ON tape.id = tm.tape_id
  WHERE tape.id = ?
`;

// 내보낼 쿼리문들을 객체로 정리
module.exports = {
  insertTape,
  getAllTapes,
  getTapeById,
  insertTodayTape,
  insertTapeMusic,
  getTodayTapeWithMusic
};
