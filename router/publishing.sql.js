const postTape = `
    INSERT INTO 
    tape_post 
    VALUES 
    (?, ?)
`;

const deleteTape = `
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

const checkTapeLike = `
    SELECT * FROM tape_like 
    WHERE user_id = ? AND tape_id = ?;
`;

const addTapeLike = `
    INSERT INTO tape_like (user_id, tape_id, created_at) 
    VALUES (?, ?, CURRENT_TIMESTAMP);
`;

const removeTapeLike = `
    DELETE FROM tape_like 
    WHERE user_id = ? AND tape_id = ?;
`;

const checkMusicLike = `
    SELECT * FROM music_like 
    WHERE user_id = ? AND music_id = ?;
`;

const addMusicLike = `
    INSERT INTO music_like (user_id, tape_id, music_id, created_at) 
    VALUES (?, ?, ?, CURRENT_TIMESTAMP);
`;

const removeMusicLike = `
    DELETE FROM music_like 
    WHERE user_id = ? AND music_id = ?;
`;

module.exports = {
    postTape: postTape,
    deleteTape: deleteTape,
    getTapePost: getTapePost,
    getTapeOrderbyLike: getTapeOrderbyLike,
    addTapeLike: addTapeLike,
    checkTapeLike: checkTapeLike,
    removeTapeLike: removeTapeLike,
    checkMusicLike: checkMusicLike,
    addMusicLike: addMusicLike,
    removeMusicLike: removeMusicLike
}