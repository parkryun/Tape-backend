require('dotenv').config(); 
const express = require("express");
const app = express();
const port = process.env.PORT || 3000; 
const publishingApi = require('./router/publishing.provider'); 

app.use(express.json());
app.use('/tape', publishingApi); 

app.get("/", (req, res) => {
  res.send("good");
})

app.listen(port, () => {
    console.log(`${port}번 포트에서 서버가 시작됨`);
});