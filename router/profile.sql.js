const getProfile = `
    SELECT 
    nickname, profileImageurl, introduce 
    FROM 
    user 
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
    user 
    SET 
    nickname = ?, introduce = ?, profileImageurl = ? 
    WHERE id = ?
`;

const getTapeById = `
    SELECT id AS tapeId, tapeimageUrl AS tapeImage
    FROM tape
    WHERE user_id = ?
`



module.exports = {
    getProfile: getProfile,
    updateProfile: updateProfile,
    getFollowing: getFollowing,
    getFollower: getFollower,
    getTapeById: getTapeById
}