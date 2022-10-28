import { Schema, model } from 'mongoose';

const PlaylistSchema = new Schema({
    playlist_id: {
        type: Number,
        required: true,
      },
    no_of_tracks: {
    type: Number,
    required: true,
    },
    tracks: [{
        playlist_name: {
            type: String,
            required: false,
        },
        track_id: {
            type: Number,
            required: false,
        },
        album_name: {
            type: Number,
            required: false,
        },
        track_name: {
            type: String,
            required: false,
        },
        artist: {
            type: String,
            required: false,
        },
        duration: {
            type: String,
            required: false,
        }
    }],
    total_duration: {
        type: String,
        required: false,
    }
});

export default model("Playlist", PlaylistSchema); 