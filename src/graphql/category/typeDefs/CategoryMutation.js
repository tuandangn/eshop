const { gql } = require('apollo-server');

const Mutation = gql`
    "Category Mutation"
    type CategoryMutation {
        "Create"
        create(
            "Category"
            category: CategoryInput!
        ): Category!,

        "Delete"
        delete(
            "Category id"
            id: ID!
        ): Boolean!,

        "Update"
        update(
            "Category id"
            id: ID!,
            "Data"
            data: CategoryInput!
        ): Category!
    }
`;

module.exports = Mutation;