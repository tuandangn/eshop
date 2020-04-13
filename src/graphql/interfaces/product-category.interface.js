const { GraphQLInterfaceType, GraphQLNonNull, GraphQLID, GraphQLBoolean, GraphQLInt } = require('graphql');

const IProductCategory = new GraphQLInterfaceType({
    name: 'IProductCategory',
    description: 'Product Category Interface',
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
        }
    })
});

module.exports = IProductCategory;