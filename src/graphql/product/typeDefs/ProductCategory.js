const { gql } = require('apollo-server');

const ProductCategory = gql`
    "Product Category"
    type ProductCategory implements IProductCategory {
        "Product id"
        productId: ID!,

        "Category id"
        categoryId: ID!,

        "Display order"
        displayOrder: Int!,

        "Show"
        show: Boolean!,

        "Feature"
        feature: Boolean!,

        "Product"
        product: Product!,

        "Category"
        category: Category!
    }
`;

module.exports = ProductCategory;