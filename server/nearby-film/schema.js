const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

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

const NearbyFilm = mongoose.model('nearby_film', NearbyFilmSchema);

module.exports = {
    NearbyFilm
}
