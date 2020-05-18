const { gql } = require('apollo-server');

const ProductType = gql`
    "Product Type Enum"
    enum ProductType{
        "Single",
        SINGLE,
        
        "Group"
        GROUP
    }
`;

module.exports = ProductType;