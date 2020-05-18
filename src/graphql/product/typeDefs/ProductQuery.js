const { gql } = require('apollo-server');

const ProductQuery = gql`
    "Product Query"
    type ProductQuery{
        "All"
        all(
            "Include hidden products"
            showHidden: Boolean = false
        ): [Product!]!,

        "List"
        list(
            "Page"
            page: Int!,
            "Size"
            size: Int!,
            "Sort"
            sort: [SortInput!],
            "Include hidden products"
            showHidden: Boolean = false
        ): ProductPagedList!,

        "Product"
        one(
            "Id"
            id: ID!,
            "Allow hidden product"
            showHidden: Boolean = false
        ): Product,

        "Search"
        search(
            "Name"
            name: String!,
            "Include hidden products"
            showHidden: Boolean = false
        ): [Product!]!,

        "Products in category"
        inCategory(
            "Category id"
            categoryId: ID!,
            "Include hidden products"
            showHidden: Boolean = false
        ): [Product!]!
    }
`;

module.exports = ProductQuery;