const { GraphQLInputObjectType, GraphQLNonNull, GraphQLBoolean, GraphQLID, GraphQLString, GraphQLInt } = require('graphql');

const ProductCategoryUpdateInputType = new GraphQLInputObjectType({
    name: 'ProductCategoryUpdateInput',
    description: 'Product Category Update Input',
    fields: {
        productId: {
            type: GraphQLNonNull(GraphQLID),
            description: 'Product id'
        },
        categoryId: {
            type: GraphQLNonNull(GraphQLID),
            description: 'Category id'
        },
        displayOrder: {
            type: GraphQLInt,
            description: 'Display order'
        },
        show: {
            type: GraphQLBoolean,
            description: 'Show'
        },
        feature: {
            type: GraphQLBoolean,
            description: 'Feature'
        }
    }
});

module.exports = ProductCategoryUpdateInputType;