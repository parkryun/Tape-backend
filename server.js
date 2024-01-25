const express = require("express")
const path = require("path")
const app = express()
const port = 3000
const acconutApi = require('./router/account.provider')

// app.use ---------------------------------------------------
app.use(express.urlencoded({extended:false}));
app.use(express.json())
app.use('/', acconutApi);

// app.get ---------------------------------------------------
app.get("/", (req, res) => {
  res.send("asd");
})

app.listen(port, () => {
    console.log(`${port} 번에서 웹 서버가 시작됨`)
})