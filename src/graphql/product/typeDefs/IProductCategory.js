const { gql } = require('apollo-server');

const IProductCategory = gql`
    "Product Category Interface"
    interface IProductCategory{
        "Product id"
        productId: ID!,

        "Category id"
        categoryId: ID!,

        "Display order"
        displayOrder: Int!,

        "Show"
        show: Boolean!,

        "Feature"
        feature: Boolean!
    }
`;

module.exports = IProductCategory;