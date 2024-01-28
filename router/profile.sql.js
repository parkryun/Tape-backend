export const getProfile = "SELECT nickname, profileImageurl, introduce FROM User WHERE id = $1"
// 데이터 추가