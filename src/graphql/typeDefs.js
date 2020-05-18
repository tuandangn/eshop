const categoryTypeDefs = require('./category/typeDefs');
const productTypeDefs = require('./product/typeDefs');
const commonTypeDefs = require('./common/typeDefs');
const queryType = require('./Query');
const mutationType = require('./Mutation');

const typeDefs = [...categoryTypeDefs, ...productTypeDefs, ...commonTypeDefs, queryType, mutationType];

module.exports = typeDefs;