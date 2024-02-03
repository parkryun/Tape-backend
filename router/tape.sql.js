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
    deleteTape: deleteTape,
    getTapePost: getTapePost,
    getTapeOrderbyLike: getTapeOrderbyLike,
    getTape: getTape,
    getMusic: getMusic,
    getComment: getComment

}