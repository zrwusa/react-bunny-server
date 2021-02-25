const {NearbyFilm} = require('./schema')
const {storeNearbyFilm, findNearbyFilms} = require('./control')
module.exports = {
    NearbyFilm,
    storeNearbyFilm,
    findNearbyFilms
}
