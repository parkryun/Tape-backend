// const comment = "SELECT * FROM comment WHERE tape_id = ?;";
const comment = {
    get : "SELECT user_id, content, created_at FROM comment WHERE tape_id = ? ;",
    save : "INSERT INTO comment (tape_id, user_id, content) VALUES (?, ?, ?);",
    edit : "UPDATE comment SET content = ? WHERE id = ?;",
    delete : "DELETE FROM comment WHERE id = ?",
    getIdByComment : "SELECT user_id FROM comment WHERE id = ?;",
    getIdByTape : "SELECT tape.user_id FROM comment JOIN tape ON comment.tape_id = tape.id WHERE comment.id = ? ;"
}
module.exports = {
    comment
};