const getUser = `
    SELECT *
    FROM user
    WHERE id = ?;
`;

const getMyTape = `
    SELECT id,title, content, tapeimageurl
    FROM tape
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT 1;
`;

const getFollowedUsers = `
    SELECT followed_id 
    FROM relation 
    WHERE follower_id = ?
`
const getFriendsTape = `
    SELECT tape.id, user.nickname, user.profileimageurl, tape.title, tape.content, tape.tapeimageurl
    FROM tape
    JOIN user ON tape.user_id = User.id
    WHERE tape.user_id IN (?) AND tape.created_at >= NOW()- INTERVAL 1 DAY
    ORDER BY tape.created_at DESC
    LIMIT ?;
`
const getCursorByLastTapeId = `
    SELECT tape.id, user.nickname, user.profileimageurl, tape.title, tape.content, tape.tapeimageurl
    FROM tape
    JOIN user ON tape.user_id = User.id
    WHERE tape.user_id IN (?) AND tape.id > ?
    ORDER BY tape.created_at DESC
    LIMIT ?;
`     
const getWatchedTape = `
    SELECT *
    FROM tape_watch
    WHERE user_id = ?;
`;


module.exports = {
    getUser: getUser,
    getMyTape: getMyTape,
    getFollowedUsers: getFollowedUsers,
    getFriendsTape: getFriendsTape,
    getCursorByLastTapeId: getCursorByLastTapeId,
    getWatchedTape: getWatchedTape
}

