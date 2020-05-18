const { gql } = require('apollo-server');

const IPageInfo = gql`
    "Page Info Interface"
    interface IPageInfo{
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

module.exports = IPageInfo;