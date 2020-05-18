const { gql } = require('apollo-server');

const SortInput = gql`
    "Sort Input"
    input SortInput{
        "By"
        by: SortBy!
        
        "Direction"
        direction: SortDirection!
    }
`;

module.exports = SortInput;