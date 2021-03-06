import mongoose from "mongoose"
import {NearbyFilmModel} from "../../models/nearby-film/schema.js"

const storeNearbyFilm = async (pNearbyFilm) => {
    const exist = await NearbyFilmModel.find(pNearbyFilm)
    if (exist.length < 1) {
        const nearbyFilm = new NearbyFilmModel();
        nearbyFilm._id = mongoose.Types.ObjectId()
        nearbyFilm.coordinate = pNearbyFilm.coordinate;
        nearbyFilm.title = pNearbyFilm.title;
        nearbyFilm.description = pNearbyFilm.description;
        nearbyFilm.image = pNearbyFilm.image;
        return await nearbyFilm.save();
    } else {
        return exist;
    }
}

export const findNearbyFilms = async (pNearbyFilm) => {
    return NearbyFilmModel.find(pNearbyFilm);
}

export const find = async (ctx) => {
    ctx.body = await findNearbyFilms({})
}
