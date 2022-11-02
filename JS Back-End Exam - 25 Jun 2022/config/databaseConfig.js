let mongoose = require('mongoose');

let { DB_Connection_String } = require('../constants');

function databaseConfig() {
    mongoose.connect(DB_Connection_String)
        .then(() => {
            console.log('DB connected successfully');
        })
        .catch((err) => {
            console.log(`DB error: ${err}`);
        })
}

module.exports = databaseConfig;