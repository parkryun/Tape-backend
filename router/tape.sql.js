const postTape = `
    INSERT INTO 
    tape_post 
    VALUES 
    (?, ?)
`;

const postMusicLike = `
    INSERT INTO 
    music_like 
    (music_id, user_id)
    VALUES 
    (?, ?)
`;

const postTapeMusic = `
    INSERT INTO 
    tape_music 
    (tape_id, music_id) 
    VALUES 
    (?, ?)
`;

const postTodayTape = `
    INSERT INTO 
    tape 
    (user_id, title, content) 
    VALUES 
    (?, ?, ?)
`;

const deleteTape = `
    DELETE FROM 
    tape 
    WHERE 
    id = ?
`;

const deleteTapePost = `
    DELETE FROM 
    tape_post 
    WHERE 
    id = ?
`;

const getTapePost = `
    SELECT 
    * 
    FROM 
    tape_post 
    WHERE id = ?;
`;

const getTapeOrderbyLike = `
    SELECT 
    * 
    FROM 
    tape ;
`;

const getTape = `
    SELECT 
    * 
    FROM 
    tape 
    WHERE 
    id = ?;
`;

const getMusic = `
    SELECT 
    * 
    FROM 
    tape_music 
    WHERE 
    tape_id = ?;
`;

const getComment = `
    SELECT 
    * 
    FROM 
    comment 
    WHERE 
    tape_id = ?;
`;

module.exports = {
    postTape: postTape,
    postMusicLike: postMusicLike,
    postTodayTape: postTodayTape,
    postTapeMusic: postTapeMusic,
    deleteTape: deleteTape,
    deleteTapePost: deleteTapePost,
    getTapePost: getTapePost,
    getTapeOrderbyLike: getTapeOrderbyLike,
    getTape: getTape,
    getMusic: getMusic,
    getComment: getComment

}
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

