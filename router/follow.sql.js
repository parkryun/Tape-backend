const postfollow = `
    INSERT 
    INTO 
    relation 
    (follower_id, followed_id)
    VALUES 
    (?, ?)
`
const deletefollow = `
    DELETE 
    FROM relation
    WHERE follower_id = ? AND followed_id = ?
`

module.exports = {
    postfollow: postfollow,
    deletefollow: deletefollow
}
