const { gql } = require('apollo-server');

const Query = gql`
    "Query"
    type Query{
        "Category Query"
        categories: CategoryQuery!

        "Product Query"
        products: ProductQuery!
    }
`;

module.exports = Query;