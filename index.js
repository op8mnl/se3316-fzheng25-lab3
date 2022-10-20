const express = require('express');
const app = express();
app.use(express.json());
const csv = require('csv-parser')
const fs = require('fs')

//Assigning Port
const port = process.env.PORT || 3000;

//using express to load front end files from static
app.use('/',express.static('static')); 

//Reading all csv information and storing in local arrays of json objects
const genres = [];
fs.createReadStream('assets/genres.csv')
  .pipe(csv())
  .on('data', (data) => genres.push(data))
  .on('end', () => {
    console.log("Loaded genres");
  });
const tracks = [];
  fs.createReadStream('assets/raw_tracks.csv')
    .pipe(csv())
    .on('data', (data) => tracks.push(data))
    .on('end', () => {
        console.log("Loaded tracks");
    });
const albums = [];
fs.createReadStream('assets/raw_albums.csv')
  .pipe(csv())
  .on('data', (data) => albums.push(data))
  .on('end', () => {
    console.log("Loaded albums");
  });
const artists = [];
fs.createReadStream('assets/raw_artists.csv')
  .pipe(csv())
  .on('data', (data) => artists.push(data))
  .on('end', () => {
    console.log("Loaded artists");
  });

//middleware for logging 
app.use((req,res,next)=>{
    console.log(`${req.method} request for ${req.url}`)
    next();
});

//routing for all tracks
app.get('/api/tracks/', (req,res) =>{
    res.send(tracks)
});

//routing for specific tracks using parameter
app.get('/api/tracks/:track_id', (req,res) =>{
    const id = req.params.track_id;
    
    const track = tracks.find(t => t.track_id == parseInt(id));
    if (track){ 
        res.send(track)
    }else{
        res.status(404).send(`Track ${id} was not found`);
    }
});
//routing for all genres
app.get('/api/genres/', (req,res) =>{
    res.send(genres)
});

//routing for specific genres using parameter
app.get('/api/genres/:genre_id', (req,res) =>{
    const id = req.params.genre_id;
    
    const genre = genres.find(t => t.genre_id == parseInt(id));
    if (genre){ 
        res.send(genre)
    }else{
        res.status(404).send(`Genre ${id} was not found`);
    }
});

//routing for all albums
app.get('/api/albums/', (req,res) =>{
    res.send(albums)
});

//routing for specific albums using parameter
app.get('/api/albums/:album_id', (req,res) =>{
    const id = req.params.album_id;
    
    const album = albums.find(t => t.album_id == parseInt(id));
    if (album){ 
        res.send(album)
    }else{
        res.status(404).send(`Album ${id} was not found`);
    }
});


app.listen(port,() => { console.log(`listening on port ${port}...`)});