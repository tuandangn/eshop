const { gql } = require('apollo-server');

const ProductCategoryType = gql`
    "Product Category Type Enum"
    enum ProductCategoryType{
        "All",
        ALL,

        "Feature"
        FEATURE,

        "Non-Feature"
        NONFEATURE
    }
`;

module.exports = ProductCategoryType;