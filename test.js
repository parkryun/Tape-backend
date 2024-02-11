const authVerify = require("./module/verify")
const router = require("express").Router()


router.get("/test", authVerify, async (req, res) => { 
    const uid = req.decoded.uid
    console.log(uid)
})

module.exports = router