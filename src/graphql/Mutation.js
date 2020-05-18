const { gql } = require('apollo-server');

const MutationType = gql`
    "Mutation"
    type Mutation{
        "Category Mutation"
        categories: CategoryMutation!,

        "Product Mutation"
        products: ProductMutation!
    },

`;

module.exports = MutationType;