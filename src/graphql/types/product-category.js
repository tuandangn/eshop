const { GraphQLObjectType, GraphQLID, GraphQLNonNull, GraphQLBoolean, GraphQLInt } = require('graphql');
const { getProductService, getCategoryService } = require('../../common/service.factory');
const IProductCategory = require('../interfaces/product-category.interface');
const IProduct = require('../interfaces/product.interface');
const ICategory = require('../interfaces/category.interface');

const productService = getProductService();
const categoryService = getCategoryService();

const ProductCategoryType = new GraphQLObjectType({
    name: 'ProductCategory',
    description: 'Product Category',
    interfaces: [IProductCategory],
    fields: () => ({
        productId: {
            type: GraphQLNonNull(GraphQLID),
            description: 'Product id'
        },
        categoryId: {
            type: GraphQLNonNull(GraphQLID),
            description: 'Category id'
        },
        displayOrder: {
            type: GraphQLNonNull(GraphQLInt),
            description: 'Display order'
        },
        show: {
            type: GraphQLNonNull(GraphQLBoolean),
            description: 'Show'
        },
        feature: {
            type: GraphQLNonNull(GraphQLBoolean),
            description: 'Feature'
        },
        product: {
            type: GraphQLNonNull(IProduct),
            description: 'Product',
            resolve: ({ productId }) => productService.getProductById(productId, true)
        },
        category: {
            type: GraphQLNonNull(ICategory),
            description: 'Category',
            resolve: ({ categoryId }) => categoryService.getCategoryById(categoryId, true)
        }
    })
});

module.exports = ProductCategoryType;