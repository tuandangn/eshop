const { gql } = require('apollo-server');

const PageInfo = gql`
    "Page Info"
    type PageInfo implements IPageInfo{
        "Page"
        page: Int!,

        "Size"
        size: Int!,

        "Total items"
        totalItems: Int!,
        
        "Total pages"
        totalPages: Int!
    }
`;

module.exports = PageInfo;