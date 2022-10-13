const express = require('express');
const app = express();
const https = require('https');
const api_url = "https://arxiv.org/abs/1612.01840";

app.use(express.json());

https.get()

app.get('/', (req, res) => {
    res.send(getData(api_url))
});

//Assigning Port
const port = process.env.PORT || 3000
app.listen(port,() => { console.log(`listening on port ${port}...`)});