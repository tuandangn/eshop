const { gql } = require('apollo-server');

const Product = gql`
    "Product"
    type Product implements IProduct & IPageableEntity{
        "Id",
        id: ID!,

        "Name"
        name: String!,

        "Short Desc"
        shortDesc: String!,

        "Full Desc"
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
        show: Boolean!,

        "Group"
        group: [Product!]!,

        "Categories"
        categories(
            "Product category type"
            type: ProductCategoryType = ALL,
            "Include hidden categories"
            showHidden: Boolean = false
        ): [Category!]!
    }
`;

module.exports = Product;