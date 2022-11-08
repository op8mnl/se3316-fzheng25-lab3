import { Schema, model } from 'mongoose';

const TrackSchema = new Schema({
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
});

export default model("Track",TrackSchema);