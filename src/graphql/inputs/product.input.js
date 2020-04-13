const { GraphQLInputObjectType, GraphQLString, GraphQLNonNull, GraphQLInt, GraphQLBoolean, GraphQLFloat } = require('graphql');
const ProductTypeEnum = require('../enums/product-type.enum');
const { SINGLE } = require('../../core/contants/product-type.const');

const DEFAULT_DISPLAY_ORDER = 1;
const DEFAULT_TYPE = SINGLE;

const ProductInputType = new GraphQLInputObjectType({
    name: 'ProductInput',
    description: 'Product Input',
    fields: () => ({
        name: {
            type: GraphQLNonNull(GraphQLString),
            description: 'Name'
        },
        type: {
            type: GraphQLNonNull(ProductTypeEnum),
            description: 'Type',
            defaultValue: DEFAULT_TYPE
        },
        shortDesc: {
            type: GraphQLNonNull(GraphQLString),
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
            type: GraphQLNonNull(GraphQLFloat),
            description: 'Price'
        },
        oldPrice: {
            type: GraphQLFloat,
            description: 'Old price'
        },
        show: {
            type: GraphQLBoolean,
            description: 'Show',
            defaultValue: true
        },
        displayOrder: {
            type: GraphQLInt,
            description: 'Display order',
            defaultValue: DEFAULT_DISPLAY_ORDER
        }
    })
});

module.exports = ProductInputType;