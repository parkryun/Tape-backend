const getProfile = `
    SELECT 
    nickname, profileImageurl, introduce 
    FROM 
    user 
    WHERE id = ?
`;
// 데이터 추가

const updateProfile = `
    UPDATE 
    User 
    SET 
    nickname = ?, introduce = ?, profileImageurl = ? 
    WHERE id = ?
`;

module.exports = {
    getProfile: getProfile,
    updateProfile: updateProfile
}