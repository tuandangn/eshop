const { gql } = require('apollo-server');

const CategoryType = gql`
    "Category Type Enum"
    enum CategoryType{
        "Products"
        PRODUCTS,
        
        "News"
        NEWS
    }
`;

module.exports = CategoryType;