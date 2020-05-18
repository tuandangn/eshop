const { gql } = require('apollo-server');
const { DEFAULT_PRODUCTCATEGORY_DISPLAY_ORDER, DEFAULT_PRODUCTCATEGORY_SHOW, DEFAULT_PRODUCTCATEGORY_FEATURE } = require('../../../common/defaults');

const ProductCategoryUpdateInput = gql`
    "Product Category Update Input"
    input ProductCategoryUpdateInput{
        "Product id"
        productId: ID!,

        "Category id"
        categoryId: ID!,

        "Display order"
        displayOrder: Int = ${DEFAULT_PRODUCTCATEGORY_DISPLAY_ORDER},

        "Show"
        show: Boolean = ${DEFAULT_PRODUCTCATEGORY_SHOW},

        "Feature"
        feature: Boolean = ${DEFAULT_PRODUCTCATEGORY_FEATURE}
    }
`;

module.exports = ProductCategoryUpdateInput;