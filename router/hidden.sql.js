// AUTOINCREMENT 설정 후 id = NULL로 변경 필요
const insertHiddenTapeQuery = `
    INSERT INTO tape_hidden (id, tape_id, user_id) VALUES (1, ?, ?)
`;

module.exports = insertHiddenTapeQuery

