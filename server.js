const express = require("express")
const path = require("path")

const app = express()
const port = 3000


// app.use ---------------------------------------------------
app.use(express.json())

// app.get ---------------------------------------------------
app.get("/", (req, res) => {
  res.send("asdf")
})

app.listen(port, () => {
    console.log(`${port} 번에서 웹 서버가 시작됨`)
})