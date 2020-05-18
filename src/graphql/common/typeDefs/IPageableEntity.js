const { gql } = require('apollo-server');

const IPageableEntity = gql`
    "Pageable Entity Interface"
    interface IPageableEntity{
        "Id"
        id: ID!,

        "Name"
        name: String!
    }
`;

module.exports = IPageableEntity;