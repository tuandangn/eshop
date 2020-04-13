const { GraphQLInputObjectType, GraphQLString, GraphQLInt, GraphQLBoolean, GraphQLFloat } = require('graphql');
const ProductTypeEnum = require('../enums/product-type.enum');

const ProductUpdateInputType = new GraphQLInputObjectType({
    name: 'ProductUpdateInput',
    description: 'Product Update Input',
    fields: () => ({
        name: {
            type: GraphQLString,
            description: 'Name'
        },
        type: {
            type: ProductTypeEnum,
            description: 'Type'
        },
        shortDesc: {
            type: GraphQLString,
            description: 'Short description'
        },
        fullDesc: {
            type: GraphQLString,
            description: 'Full description'
        },
        individualVisibility: {
            type: GraphQLBoolean,
            description: 'Individual Visibility',
            defaultValue: true
        },
        cost: {
            type: GraphQLFloat,
            description: 'Cost'
        },
        price: {
            type: GraphQLFloat,
            description: 'Price'
        },
        oldPrice: {
            type: GraphQLFloat,
            description: 'Old price'
        },
        show: {
            type: GraphQLBoolean,
            description: 'Show'
        },
        displayOrder: {
            type: GraphQLInt,
            description: 'Display order'
        }
    })
});

module.exports = ProductUpdateInputType;