import express from 'express';
const app = express();
const router = express.Router();
import csv from 'csv-parser';
import { createReadStream } from 'fs';
import mongoose from 'mongoose';
import Playlist from './playlist.js';
import Track from './tracks.js';

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
  .on('end', async () => {
    const state = await Track.find();
    if (state.length == 0){
      for (var i = 0; i < 1000; i++) {
        const track = new Track({
          track_id: tracks[i].track_id,
          album_name:tracks[i].album_title,
          track_name:tracks[i].track_title,
          artist:tracks[i].artist_name,
          duration: tracks[i].track_duration,
          album_id:tracks[i].album_id,
          artist_id: tracks[i].artist_id,
          tags:tracks[i].tags,
          track_genres:tracks[i].track_genres,
          track_date_created: tracks[i].track_date_created,
          track_date_recorded: tracks[i].track_date_recorded,
        });
        track.save(function(err, doc) {
          if (err) return console.error(err);
        });
      console.log(`Progress: ${i+1}/1000`);
      }
    }
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
    console.log(artists[0]);
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
    })
router.route('/genres')
    .get((req,res) => {
        res.send(genres);
    })

//routing for specific tracks using parameter
router.route('/tracks/:track_id')
  .get( (req,res) =>{
      const id = req.params.track_id;
      var result = []
      for (var i = 0; i < tracks.length;i++) {
        if (tracks[i].track_id.indexOf(id) > -1) {
          const trackObj = {
            track_id: tracks[i].track_id,
            album_name:tracks[i].album_name,
            track_name:tracks[i].track_name,
            artist:tracks[i].artist,
            duration:tracks[i].duration,
            album_id: tracks[i].album_id,
            artist_id: tracks[i].artist_id,
            tags: tracks[i].tags,
            track_date_created: tracks[i].track_date_created,
            track_date_recorded: tracks[i].track_date_recorded,
            track_genres: tracks[i].track_genres,
          }
          result.push(trackObj);
        }
      }
      res.send(result.slice(0,3))
  });
router.route('/artistid/:id')
  .get( (req,res) =>{
      const id = req.params.id;
      var result = []
      for (var i = 0; i < artists.length;i++) {
        if (artists[i].artist_id.indexOf(id) > -1) {
          const artistObj = {
            id: artists[i].artist_id,
            startYear:artists[i].artist_active_year_begin,
            endYear:artists[i].artist_active_year_end,
            name:artists[i].artist_name,
            favorites:artists[i].artist_favorites,
            location: artists[i].artist_location,
          }
          result.push(artistObj);
        }
      }
      res.send(result.slice(0,3))
  });
  router.route('/artistname/:id')
  .get( (req,res) =>{
      const id = req.params.id;
      var result = []
      for (var i = 0; i < artists.length;i++) {
        if ((artists[i].artist_name).toUpperCase().indexOf(id.toUpperCase()) > -1) {
          const artistObj = {
            id: artists[i].artist_id,
            startYear:artists[i].artist_active_year_begin,
            endYear:artists[i].artist_active_year_end,
            name:artists[i].artist_name,
            favorites:artists[i].artist_favorites,
            location: artists[i].artist_location,
          }
          result.push(artistObj);
        }
      }
      res.send(result.slice(0,3))
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
var playlists = [];
async function updatePlaylists(){
  const data = await Playlist.find();
  playlists = [...data];
}
router.route('/playlists') 
    .get(async (req,res)  =>  {
        updatePlaylists()
        res.send(playlists);
    })
    .post((req,res)=>{
        const data = new Playlist({
          playlist_id: req.body.playlist_id,
          playlist_name: req.body.playlist_name,
          no_of_tracks: req.body.no_of_tracks,
          total_duration: req.body.total_duration,
          tracks: req.body.tracks,
        })
        data.save(function(err, doc) {
          if (err) return console.error(err);
          console.log("Document inserted succussfully!");
        });
        playlists.push(data);
        res.send(req.body);
    })
    .delete(async (req,res)=>{
        Playlist.findByIdAndDelete(req.body._id, function(err) { 
          if(err) console.log(err);
          console.log(`Playlist with id ${req.body._id} deleted`) 
        });
        // Playlist.remove({}, function(err) { 
        //   console.log('collection removed') 
        // });
        updatePlaylists()
        res.send(playlists);
    })
router.route('/playlists/:id')
  .get (async (req,res) => {
    const playlist = await Playlist.find({"_id":req.params.id});
    res.send(playlist)
  })
  .post (async (req, res)=>{
    const track = await Track.find({"track_id":req.body.track});
    const playlistAttr = await Playlist.find({"playlist_id":req.params.id});
    const trackObj = {
      track_id: track[0].track_id,
      album_name:track[0].album_name,
      track_name:track[0].track_name,
      artist:track[0].artist,
      duration:track[0].duration,
      album_id: track[0].album_id,
      artist_id: track[0].artist_id,
      tags: track[0].tags,
      track_date_created: track[0].track_date_created,
      track_date_recorded: track[0].track_date_recorded,
      track_genres: track[0].track_genres,
    }
    const newDuration = () =>{
      var arr1 = String(playlistAttr[0].total_duration).split(':');
      var arr2 = String(track[0].duration).split(':');
      var min = parseInt(arr1[0]) + parseInt(arr2[0]);
      var seconds = parseInt(arr1[1]) + parseInt(arr2[1]);
      if (seconds >= 60){
        seconds = seconds - 60;
        min += 1
      }
      return `${String(min).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`
    }
    await Playlist.updateOne(
      {playlist_id:req.params.id},
      {
        total_duration: newDuration(),
        no_of_tracks:parseInt(playlistAttr[0].no_of_tracks) + 1,
        $addToSet: {tracks: trackObj},
      },
      function(err, doc) {
        if (err) return console.error(err);
        console.log("Document updated succussfully!");
      }).clone();
    updatePlaylists();
    res.send(playlists)
  })

app.use("/api",router)

app.listen(port,() => { console.log(`listening on port ${port}...`)});