const getAlarm = require("./alarm.sql")
const router = require("express").Router()
const authVerify = require("../module/verify")
const db = require('../data/database')
// db client 추가


router.get("/", async (req, res) => { 
    
})

module.exports = router