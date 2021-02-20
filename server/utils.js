const mongoose = require('mongoose')

const assignToModelInstance = function (instance, obj) {
    for (let i in obj) {
        if (obj.hasOwnProperty(i)) {
            instance[i] = obj[i]
        }
    }
}

const toMilliSeconds = function (abbreviation) {
    const s = 1000;
    const m = 60 * s;
    const h = 60 * m;
    const units = {s, m, h};
    switch (typeof abbreviation) {
        case "string":
            const value = abbreviation.substring(0, abbreviation.length - 1);
            const unit = abbreviation.substr(abbreviation.length - 1, 1);
            return Number(value) * units[unit];
        case "number":
            return abbreviation;
        case "undefined":
            return abbreviation;
    }
}

const ObjectId = mongoose.Types.ObjectId
module.exports = {
    ObjectId,
    assignToModelInstance,
    toMilliSeconds
}


