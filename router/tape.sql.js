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