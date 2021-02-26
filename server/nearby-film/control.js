import mongoose  from 'mongoose'
import {NearbyFilm}  from './schema.js'

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
        return saved;
    } else {
        return exist;
    }
}

const findNearbyFilms = async function (pNearbyFilm) {
    return NearbyFilm.find(pNearbyFilm);
}
export {
    storeNearbyFilm,
    findNearbyFilms
}
