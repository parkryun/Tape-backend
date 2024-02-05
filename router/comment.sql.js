// const comment = "SELECT * FROM comment WHERE tape_id = ?;";
const comment = {
    get : "SELECT user_id, content, created_at FROM comment WHERE tape_id = ? ;",
    save : "INSERT INTO comment (id, tape_id, user_id, content) VALUES (?, ?, ?, ?);",
    edit : "UPDATE comment SET content = ? WHERE id = ?;",
    delete : "DELETE FROM comment WHERE tape_id = ?",
    getId : "SELECT user_id FROM tape WHERE id = ?;",
}
module.exports = {
    comment
};