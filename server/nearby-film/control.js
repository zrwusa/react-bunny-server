const mongoose = require('mongoose')
const {NearbyFilm} = require('./schema')

const storeNearbyFilm = async function (pNearbyFilm) {
    const exist = await NearbyFilm.find(pNearbyFilm)
    if (exist.length < 1) {
        const nearbyFilm = new NearbyFilm();
        nearbyFilm._id = mongoose.Types.ObjectId()
        nearbyFilm.coordinate = pNearbyFilm.coordinate;
        nearbyFilm.title = pNearbyFilm.title;
        nearbyFilm.description = pNearbyFilm.description;
        nearbyFilm.image = pNearbyFilm.image;

        const saved = await nearbyFilm.save();
        console.log('---saved nearbyFilm', saved);
        return saved;
    } else {
        console.log('---exist save nearbyFilm already exists', exist);
        return exist;
    }
}

const findNearbyFilms = async function (pNearbyFilm) {
    return NearbyFilm.find(pNearbyFilm);
}
module.exports = {
    storeNearbyFilm,
    findNearbyFilms
}
