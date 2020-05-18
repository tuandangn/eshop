const { gql } = require('apollo-server');

const Category= gql`
    "Category Type"
    type Category implements ICategory & IPageableEntity{
        "ID"
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
        show: Boolean!,

        "Parent"
        parent(
            "Allow hidden parent"
            showHidden: Boolean = false
        ): Category,

        "Children"
        children(
            "Include hidden children"
            showHidden: Boolean = false
        ): [Category!]!,
        
        "Products"
        products(
            "Include hidden products"
            showHidden: Boolean = false
        ): [IProduct!]!
    }
`;

module.exports = Category;