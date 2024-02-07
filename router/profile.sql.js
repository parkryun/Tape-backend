const getProfile = `
    SELECT 
    nickname, profileImageurl, introduce 
    FROM 
    User 
    WHERE id = ?
`;
// 데이터 추가

const getFollower = `
    SELECT 
    COUNT(*) AS followers 
    FROM 
    relation 
    WHERE followed_id = ?
`;

const getFollowing = `
    SELECT 
    COUNT(*) AS followings 
    FROM 
    relation 
    WHERE follower_id = ?
`;

const updateProfile = `
    UPDATE 
    User 
    SET 
    nickname = ?, introduce = ?, profileImageurl = ? 
    WHERE id = ?
`;

module.exports = {
    getProfile: getProfile,
    updateProfile: updateProfile,
    getFollowing: getFollowing,
    getFollower: getFollower
}