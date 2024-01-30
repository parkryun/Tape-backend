const postTape = `
    INSERT INTO 
    tape_post 
    VALUES 
    (?, ?)
`

const deleteTape = `
    DELETE FROM 
    tape_post 
    WHERE 
    id = ?
`

module.exports = {
    postTape: postTape,
    deleteTape: deleteTape
}