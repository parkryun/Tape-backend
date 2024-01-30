const express = require("express")
const cookieParser = require("cookie-parser")
const path = require("path")
const app = express()
const port = 3000

require("dotenv").config()

const alarmApi = require("./router/alarm.provide.js")
const followApi = require("./router/follow.services.js")
const profileProviedApi = require("./router/profile.provide.js")
const profileServicesApi = require("./router/profile.services.js")
const tapeServicesApi = require("./router/tape.services.js")
const tapeProvideApi = require("./router/tape.provide.js")
const musicProvideApi = require("./router/music.provide.js")

// app.use ---------------------------------------------------
app.use(express.json())
app.use(cookieParser())
app.use("/alarm", alarmApi)
app.use("/follow", followApi)
app.use("/profile", profileProviedApi)
app.use("/profile", profileServicesApi)
app.use("/tape", tapeServicesApi)
app.use("/tape", tapeProvideApi)
app.use("/music", musicProvideApi)

// app.get ---------------------------------------------------
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html")
})

app.listen(port, () => {
    console.log(`${port} 번에서 웹 서버가 시작됨`)
})