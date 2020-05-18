const { gql } = require('apollo-server');

const ICategory = gql`
    "Category Interface"
    interface ICategory {
        "Id"
        id: ID!,

        "Name"
        name: String!,

        "Type"
        type: CategoryType!,

        "Custom pagination"
        customPagination: Boolean!,

        "Default page size"
        defaultPageSize: Int!,

        "Page sizes"
        pageSizes: String,

        "Description"
        description: String,

        "Display order"
        displayOrder: Int!,
        
        "Show"
        show: Boolean!
    }
`;

module.exports = ICategory;