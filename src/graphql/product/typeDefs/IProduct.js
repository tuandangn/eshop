const { gql } = require('apollo-server');

const IProduct = gql`
    "Product Interface"
    interface IProduct{
        "Id"
        id: ID!,

        "Name"
        name: String!,

        "Short desc"
        shortDesc: String!,

        "Full desc"
        fullDesc: String,

        "Type"
        type: ProductType!,

        "Individual visibility"
        individualVisibility: Boolean!,

        "Cost"
        cost: Float,

        "Price"
        price: Float!,

        "Old price"
        oldPrice: Float,

        "Display order"
        displayOrder: Int!,

        "Show"
        show: Boolean!
    }
`;

module.exports = IProduct;