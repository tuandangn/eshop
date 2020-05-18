const {gql} = require('apollo-server');

const ProductPagedList = gql`
    "Product Paged List"
    type ProductPagedList{
        "Data"
        data: [Product!]!,
        
        "Page info"
        pageInfo: PageInfo
    }
`;

module.exports = ProductPagedList;