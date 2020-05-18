const { gql } = require('apollo-server');

const SortBy = gql`
    "Sort By"
    enum SortBy{
        "Id"
        ID,
        
        "Name"
        NAME
    }
`;

module.exports = SortBy;