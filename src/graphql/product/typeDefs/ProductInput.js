const { gql } = require('apollo-server');
const { DEFAULT_PRODUCT_INDIVIDUAL_VISIBILITY, DEFAULT_PRODUCT_SHOW, DEFAULT_PRODUCT_DISPLAY_ORDER } = require('../../../common/defaults');

const ProductInput = gql`
    "Product Input Type"
    input ProductInput{
        "Name"
        name: String!,

        "Type"
        type: ProductType!,

        "Short desc"
        shortDesc: String!,

        "Full desc"
        fullDesc: String,

        "Individual visibility"
        individualVisibility: Boolean = ${DEFAULT_PRODUCT_INDIVIDUAL_VISIBILITY},

        "Cost"
        cost: Float,

        "Price"
        price: Float!,

        "Old price"
        oldPrice: Float,

        "Show"
        show: Boolean = ${DEFAULT_PRODUCT_SHOW},

        "Display order"
        displayOrder: Int = ${DEFAULT_PRODUCT_DISPLAY_ORDER}
    }
`;

module.exports = ProductInput;