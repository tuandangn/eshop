const { gql } = require('apollo-server');

const IPagedList = gql`
    "Paged List Interface"
    interface IPagedList{
        "Data"
        data: [IPageableEntity!]!,
        
        "Page info"
        pageInfo: IPageInfo
    }
`;

module.exports = IPagedList;