const express = require('express');
const { connect } = require('../core/data/mongoose.context');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('../graphql/typeDefs');
const resolvers = require('../graphql/resolvers');

const defaultBuilder = {
    _port: 0,
    _middlewares: [],
    _db: null,
    _db_initializers: [],
    _graphql: false,

    graphql() {
        this._graphql = true;
        return this;
    },

    mongoose(conString) {
        this._db = () => connect(conString);
        return Object.assign(this, {
            initializer: initializer => {
                this._db_initializers.push(initializer);
                return this;
            }
        });
    },

    port(port) {
        this._port = port;
        return this;
    },

    middleware(middleware) {
        this._middlewares.push(middleware);
        return this;
    },

    build() {
        const app = express();

        for (const middleware of this._middlewares) {
            app.use(middleware);
        }

        if (this._graphql) {

            const apolloServer = new ApolloServer({
                typeDefs,
                resolvers
            });
            apolloServer.applyMiddleware({ app });
        }

        const db = this._db;
        const dbInitializers = Array.from(this._db_initializers);
        const port = this._port;

        app.start = async () => {
            if (db) {
                await db();
            }

            if (dbInitializers.length > 0) {
                for (const initializer of dbInitializers)
                    await initializer();
            }

            app.listen(port);
        }

        return app;
    }
};

module.exports = {
    get default() {
        return defaultBuilder;
    }
};