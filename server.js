const express = require("express")
const cookieParser = require("cookie-parser")
const path = require("path")
const app = express()
const port = 3000

require("dotenv").config()

const alarmApi = require("./router/alarm.js")
const followApi = require("./router/follow.js")
const profileApi = require("./router/profile.js")

// app.use ---------------------------------------------------
app.use(express.json())
app.use(cookieParser())
app.use("/alarm", alarmApi)
app.use("/follow", followApi)
app.use("/profile", profileApi)

// app.get ---------------------------------------------------
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html")
})

app.listen(port, () => {
    console.log(`${port} 번에서 웹 서버가 시작됨`)
})