const { GraphQLObjectType, GraphQLBoolean, GraphQLList, GraphQLString, GraphQLNonNull, GraphQLID } = require('graphql');
const ProductType = require('../../graphql/types/product');
const { getProductService } = require('../../common/service.factory');

const productService = getProductService();

const ProductQueryType = new GraphQLObjectType({
    name: 'ProductQuery',
    description: 'Product Query',
    fields: () => ({
        all: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(ProductType))),
            description: 'All of products',
            args: {
                showHidden: {
                    type: GraphQLBoolean,
                    description: 'Show hidden products',
                    defaultValue: false
                }
            },
            resolve: (_, { showHidden }) => productService.getAllProducts(showHidden)
        },
        one: {
            type: ProductType,
            description: 'One product',
            args: {
                id: {
                    type: GraphQLNonNull(GraphQLID)
                },
                showHidden: {
                    type: GraphQLBoolean,
                    description: 'Show hidden product',
                    defaultValue: false
                }
            },
            resolve: (_, { id, showHidden }) => productService.getProductById(id, showHidden)
        },
        search: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(ProductType))),
            description: 'Search products',
            args: {
                name: {
                    type: GraphQLNonNull(GraphQLString),
                    description: 'Search product name'
                },
                showHidden: {
                    type: GraphQLBoolean,
                    description: 'Show hidden product',
                    defaultValue: false
                }
            },
            resolve: (_, { name, showHidden }) => productService.getProductsByName(name, showHidden)
        },
        category: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(ProductType))),
            description: 'Products in category',
            args: {
                id: {
                    type: GraphQLNonNull(GraphQLID),
                    description: 'Category id'
                },
                showHidden: {
                    type: GraphQLBoolean,
                    description: 'Show hidden product',
                    defaultValue: false
                }
            },
            resolve: (_, { id, showHidden }) => productService.getProductsInCategory(id, showHidden)
        }
    })
});

module.exports = ProductQueryType;