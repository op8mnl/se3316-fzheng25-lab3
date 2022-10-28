import express from 'express';
const app = express();
const router = express.Router();
import csv from 'csv-parser';
import { createReadStream } from 'fs';
import mongoose from 'mongoose';
import Playlist from './playlist.js';

//connecting to mongoDB 
const username = "user";
const password = "t38fofCgATlfDaEL";
const cluster = "cluster0.jkogtcx";

mongoose.connect(
  `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/?retryWrites=true&w=majority`, 
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

//Assigning Port
const port = process.env.PORT || 3000;

app.use(express.json());

//using express to load front end files from static
app.use('/',express.static('static')); 

//Reading all csv information and storing in local arrays of json objects
const genres = [];
createReadStream('assets/genres.csv')
  .pipe(csv())
  .on('data', (data) => genres.push(data))
  .on('end', () => {
    console.log("Loaded genres");
  });
const tracks = [];
  createReadStream('assets/raw_tracks.csv')
    .pipe(csv())
    .on('data', (data) => {tracks.push(data)})
    .on('end', () => {
        console.log("Loaded tracks");
    });
const albums = [];
createReadStream('assets/raw_albums.csv')
  .pipe(csv())
  .on('data', (data) => albums.push(data))
  .on('end', () => {
    console.log("Loaded albums");
  });
const artists = [];
createReadStream('assets/raw_artists.csv')
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

//routing for all tracks, albums, artists and genres
router.route('/tracks')
    .get((req,res) => {
        res.send(tracks);
        // res.send(albums);
        // res.send(genres);
        // res.send(artists);
    })

//routing for specific tracks using parameter
router.get('/api/tracks/:track_id', (req,res) =>{
    const id = req.params.track_id;
    
    const track = tracks.find(t => t.track_id == parseInt(id));
    if (track){ 
        res.send(track)
    }else{
        res.status(404).send(`Track ${id} was not found`);
    }
});

//routing for specific genres using parameter
router.get('/api/genres/:genre_id', (req,res) =>{
    const id = req.params.genre_id;
    
    const genre = genres.find(t => t.genre_id == parseInt(id));
    if (genre){ 
        res.send(genre)
    }else{
        res.status(404).send(`Genre ${id} was not found`);
    }
});

//routing for specific albums using parameter
router.get('/api/albums/:album_id', (req,res) =>{
    const id = req.params.album_id;
    
    const album = albums.find(t => t.album_id == parseInt(id));
    if (album){ 
        res.send(album)
    }else{
        res.status(404).send(`Album ${id} was not found`);
    }
});
const playlists = [];
router.route('/playlists') 
    .get((req,res)  =>  {
        res.send(playlists)
    })
    .post((req,res)=>{
      
        const playlist = new Playlist({
          playlist_id: 1,
          playlistName: "name",
          no_of_tracks: 2,
          total_duration: "00:00"
        })
        playlist.save(function(err, doc) {
          if (err) return console.error(err);
          console.log("Document inserted succussfully!");
        });
        res.send(req.body);
    })
    .put((req,res)=>{
        
    })

app.use("/api",router)

app.listen(port,() => { console.log(`listening on port ${port}...`)});