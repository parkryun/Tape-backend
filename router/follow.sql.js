const postfollow = `
    INSERT 
    INTO 
    relation 
    (follower_id, followed_id)
    VALUES 
    (?, ?)
`

module.exports = {
    postfollow: postfollow
}