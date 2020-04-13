const { GraphQLSchema, GraphQLObjectType, GraphQLIncludeDirective, GraphQLSkipDirective } = require('graphql');
const ProductQueryType = require('./product/product.query');
const CategoryQueryType = require('./category/category.query');
const CategoryMutationType = require('./category/category.mutation');
const ProductMutationType = require('./product/product.mutation');
const ProductCategoryMutationType = require('./product-category/product-category.mutation');
const ShowHiddenDirective = require('../graphql/directives/show-hidden.directive');

const productSchema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'RootQuery',
        description: 'Root Query',
        fields: {
            products: {
                type: ProductQueryType,
                description: 'Product Root Query',
                resolve: () => ProductQueryType
            },
            categories: {
                type: CategoryQueryType,
                description: 'Category Root Query',
                resolve: () => CategoryQueryType
            }
        }
    }),
    mutation: new GraphQLObjectType({
        name: 'RootMutation',
        description: 'Root Mutation',
        fields: {
            categories: {
                type: CategoryMutationType,
                description: 'Category Root Mutation',
                resolve: () => CategoryMutationType
            },
            products: {
                type: ProductMutationType,
                description: 'Product Root Mutation',
                resolve: () => ProductMutationType
            },
            productCategories: {
                type: ProductCategoryMutationType,
                description: 'Product Category Root Mutation',
                resolve: () => ProductCategoryMutationType
            }
        }
    }),
    directives: [ShowHiddenDirective, GraphQLSkipDirective, GraphQLIncludeDirective]
});

module.exports = productSchema;