comment.sql

const comment = {
    get : "SELECT * FROM comment WHERE tape_id = ? ORDER BY created_at DESC;",
    save : "INSERT INTO comment (tape_id, user_id, content) VALUES (?, ?, ?);",
    edit : "UPDATE comment SET content = ? WHERE id = ?;",
    delete : "DELETE FROM comment WHERE tape_id = ?",
    getId : "SELECT user_id FROM tape WHERE id = ?;",
}
module.exports = {
    comment
};