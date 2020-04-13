const { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLInt, GraphQLList, GraphQLBoolean, GraphQLFloat, GraphQLID } = require('graphql');
const { getProductService } = require('../../common/service.factory');
const IProduct = require('../interfaces/product.interface');
const ICategory = require('../interfaces/category.interface');
const ProductTypeEnum = require('../enums/product-type.enum');
const ProductCategoryTypeEnum = require('../enums/product-category-type.enum');
const { ALL } = require('../../core/contants/product-category-type.const');

const productService = getProductService();

const ProductType = new GraphQLObjectType({
    name: 'Product',
    description: 'Product',
    interfaces: [IProduct],
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
        },
        categories: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(ICategory))),
            description: 'Categories',
            args: {
                type: {
                    type: ProductCategoryTypeEnum,
                    description: 'Product category type',
                    defaultValue: ALL
                },
                showHidden: {
                    type: GraphQLBoolean,
                    description: 'Show hidden categories',
                    defaultValue: false
                }
            },
            resolve: (product, { type, showHidden }) => productService.getCategoriesByProduct(product, type, true, showHidden)
        },
        group: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(ProductType))),
            description: 'Group products',
            args: {
                showHidden: {
                    type: GraphQLBoolean,
                    description: 'Show hidden products',
                    defaultValue: false
                }
            },
            resolve: (product, { showHidden }) => productService.getProductsByGroupId(product.id, showHidden)
        }
    })
});

module.exports = ProductType;