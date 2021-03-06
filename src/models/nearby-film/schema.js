import mongoose from "mongoose"

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

export const DOCUMENT_NAME = 'NearbyFilm';
export const COLLECTION_NAME = 'nearby_films';

const NearbyFilmSchema = new Schema({
    _id: ObjectId,
    "coordinate": {
        "latitude": Number,
        "longitude": Number
    },
    "title": String,
    "description": String,
    "image": {
        "uri": String
    }
});

export const NearbyFilmModel = mongoose.model(DOCUMENT_NAME, NearbyFilmSchema, COLLECTION_NAME);
