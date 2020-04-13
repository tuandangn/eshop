const builder = require('./common/builder');

const port = process.env.PORT || 3000;
const connectionString = 'mongodb://localhost/eshop-catalog';

const server = builder.default.port(port)
    .mongoose(connectionString)
    //.initializer(require('./data/empty.initializer'))
    .initializer(require('./core/data/data.initializer'))
    .graphql()
    //.middleware((req, res) => res.end('Hello world'))
    .build();

module.exports = { start: server.start };