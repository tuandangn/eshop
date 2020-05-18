const { gql } = require('apollo-server');

const CategoryQuery = gql`
    "Category Query"
    type CategoryQuery{
        "All"
        all(
            "Include hidden categories"
            showHidden: Boolean = false
        ): [Category!]!,

        "One"
        one(
            "Id"
            id: ID!,
            "Allow hidden category"
            showHidden: Boolean = false
        ): Category,

        "Search"
        search(
            "Name"
            name: String!,
            "Include hidden categories"
            showHidden: Boolean = false
        ): [Category!]!
    }
`;

module.exports = CategoryQuery;