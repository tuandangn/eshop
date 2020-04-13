const { GraphQLInputObjectType, GraphQLNonNull, GraphQLBoolean, GraphQLID, GraphQLString, GraphQLInt } = require('graphql');

const DEFAULT_DISPLAY_ORDER = 1;
const DEFAULT_SHOW = true;
const DEFAULT_FEATURE = false;

const ProductCategoryInputType = new GraphQLInputObjectType({
    name: 'ProductCategoryInput',
    description: 'Product Category Input',
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
            type:GraphQLInt,
            description: 'Display order',
            defaultValue: DEFAULT_DISPLAY_ORDER
        },
        show: {
            type:GraphQLBoolean,
            description: 'Show',
            defaultValue: DEFAULT_SHOW
        },
        feature: {
            type: GraphQLBoolean,
            description: 'Feature',
            defaultValue: DEFAULT_FEATURE
        }
    }
});

module.exports = ProductCategoryInputType;