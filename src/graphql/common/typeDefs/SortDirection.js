const { gql } = require('apollo-server');

const SortDirection = gql`
    "Sort Direction"
    enum SortDirection{
        "Asc"
        ASC,
        
        "Desc"
        DESC
    }
`;

module.exports = SortDirection;