const mongoose = require("mongoose");

const PlaylistSchema = new mongoose.Schema({
  playlist_name: {
    type: String,
    required: true,
  },
  track_id: {
    type: Number,
    required: true,
  },
  album_name: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  track_name: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
});

const Playlist = mongoose.model("Playlist", PlaylistSchema);

module.exports = Playlist;