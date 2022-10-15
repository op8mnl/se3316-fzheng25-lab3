const express = require('express');
const app = express();
//Assigning Port
const port = process.env.PORT || 3000;

app.use(express.json());

const tracks = [
    {genre_id: 1,noTracks:8693,parent_id:38,genre: 'Avant-Garde',topLevel:38},
];


//using express to load front end files from static
app.use('/',express.static('static')); 

//routing for all tracks
app.get('/api/tracks/', (req,res) =>{
    console.log(`GET response for ${req.url}`)
    res.send(tracks)
});
//routing for specific tracks using parameter
app.get('/api/tracks/:track_id', (req,res) =>{
    const id = req.params.track_id;
    console.log(`GET response for ${req.url}`)
    const track = tracks.find(t => t.id === parseInt(id));
    if (track){ 
        res.send(track)
    }else{
        res.status(404).send(`Part ${id} was not found`);
    }
});

app.listen(port,() => { console.log(`listening on port ${port}...`)});