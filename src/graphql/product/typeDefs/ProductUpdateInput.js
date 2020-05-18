const { gql } = require('apollo-server');

const ProductUpdateInput = gql`
    "Product Update Input"
    input ProductUpdateInput{
        "Name"
        name: String,

        "Type"
        type: ProductType,

        "Short desc"
        shortDesc: String,

        "Full desc"
        fullDesc: String,

        "Individual visibility"
        individualVisibility: Boolean,

        "Cost"
        cost: Float,

        "Price"
        price: Float,

        "Old price"
        oldPrice: Float,

        "Show"
        show: Boolean,

        "Display order"
        displayOrder: Int
    }
`;

module.exports = ProductUpdateInput;