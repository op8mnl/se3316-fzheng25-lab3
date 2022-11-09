import { Schema, model } from 'mongoose';

const PlaylistSchema = new Schema({
    playlist_id: {
        type: String,
        required: false,
    },
    playlist_name: {
        type: String,
        required: false,
    },
    no_of_tracks: {
        type: Number,
        required: true,
    },
    tracks: [{
        _id: false,
        track_id: Number,
        album_name:String,
        track_name:String,
        artist:String,
        duration: String,
        album_id: Number,
        artist_id: Number,
        tags: String,
        track_date_created: String,
        track_date_recorded: String,
        track_genres: String,
    }],
    total_duration: String,
});

export default model("Playlist", PlaylistSchema); 