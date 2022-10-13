const { response } = require('express');
const express = require('express');
const app = express();
const api_url = "https://arxiv.org/abs/1612.01840";

app.use(express.json());

async function getData(api_url) {
    const res = await fetch(api_url)
    var data = await response.json()
}

app.get('/', (req, res) => {
    res.send('Hello World')
});

//Assigning Port
const port = process.env.PORT || 3000
app.listen(port,() => { console.log(`listening on port ${port}...`)});