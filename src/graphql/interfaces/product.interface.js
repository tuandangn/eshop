const { GraphQLInterfaceType, GraphQLString, GraphQLNonNull, GraphQLInt, GraphQLBoolean, GraphQLFloat, GraphQLID } = require('graphql');
const ProductTypeEnum = require('../enums/product-type.enum');

const IProduct = new GraphQLInterfaceType({
    name: 'IProduct',
    description: 'Product Interface',
    fields: () => ({
        id: {
            type: GraphQLNonNull(GraphQLID),
            description: 'Id'
        },
        name: {
            type: GraphQLNonNull(GraphQLString),
            description: 'Name'
        },
        shortDesc: {
            type: GraphQLNonNull(GraphQLString),
            description: 'Short description'
        },
        fullDesc: {
            type: GraphQLString,
            description: 'Full description'
        },
        type: {
            type: GraphQLNonNull(ProductTypeEnum),
            description: 'Product type'
        },
        individualVisibility: {
            type: GraphQLNonNull(GraphQLBoolean),
            description: 'Individual visibility'
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
        displayOrder: {
            type: GraphQLNonNull(GraphQLInt),
            description: 'Display order'
        },
        show: {
            type: GraphQLNonNull(GraphQLBoolean),
            description: 'Show'
        }
    })
});

module.exports = IProduct;