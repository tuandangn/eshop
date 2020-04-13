const mongoose = require('mongoose');

function connect(conString) {
    return new Promise((resolve, reject) => {
        //db
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        };

        mongoose.connect(conString, options);

        const db = mongoose.connection;
        db.once('error', error => reject(error));
        db.once('open', () => resolve(true));
    });
}

module.exports = { connect };