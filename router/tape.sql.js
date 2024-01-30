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
    tape_post 
    WHERE id = ?;
`;

module.exports = {
    postTape: postTape,
    deleteTape: deleteTape,
    getTapePost: getTapePost,
    getTapeOrderbyLike: getTapeOrderbyLike
}