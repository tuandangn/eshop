const { gql } = require('apollo-server');

const ProductMutation = gql`
    "Product Mutation"
    type ProductMutation{
        "Create"
        create(
            "Product"
            product: ProductInput!
        ): Product!,

        "Delete"
        delete(
            "Id"
            id: ID!
        ): Boolean!,

        "Update"
        update(
            "Id"
            id: ID!,

            "Data"
            data: ProductUpdateInput!
        ): Product!,

        "Add to Category"
        addToCategory(
            "Product category"
            productCategory: ProductCategoryInput!
        ): ProductCategory!,

        "Remove from Category"
        removeFromCategory(
            "Product category"
            productCategory: ProductCategoryUpdateInput
        ): Boolean!,

        "Alter for Category"
        alterForCategory(
            "Product category"
            productCategory: ProductCategoryUpdateInput!
        ): ProductCategory!,

        "Add to Group"
        addToGroup(
            "Id"
            id: ID!,

            "Group"
            group: ID!
        ): Product!
    }
`;

module.exports = ProductMutation;