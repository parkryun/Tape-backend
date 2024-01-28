export const getProfile = "SELECT nickname, profileImageurl, introduce FROM User WHERE id = $1"
// 데이터 추가

export const updateProfile = "UPDATE User SET nickname = $1, introduce = $2, profileImageurl = $3 WHERE id = $4"