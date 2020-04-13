const { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLBoolean } = require('graphql');
const ProductCategoryType = require('../../graphql/types/product-category');
const ProductCategoryInputType = require('../../graphql/inputs/product-category.input');
const ProductCategoryUpdateInputType = require('../../graphql/inputs/product-update-category.input');
const { getProductService } = require('../../common/service.factory');

const productService = getProductService();

const ProductCategoryMutationType = new GraphQLObjectType({
    name: 'ProductCategoryMutation',
    description: 'Product Category Mutation',
    fields: () => ({
        add: {
            type: GraphQLNonNull(ProductCategoryType),
            description: 'Add product category',
            args: {
                productCategory: {
                    type: GraphQLNonNull(ProductCategoryInputType),
                    description: 'Add product category'
                }
            },
            resolve: (_, { productCategory }) => productService.getProductById(productCategory.productId, true).then(product => {
                if (product != null) {
                    return productService.addProductCategory(product,
                        productCategory.categoryId,
                        productCategory.displayOrder,
                        productCategory.feature);
                }
            })
        },
        remove: {
            type: GraphQLNonNull(GraphQLBoolean),
            description: 'Remove product category',
            args: {
                productCategory: {
                    type: GraphQLNonNull(ProductCategoryUpdateInputType),
                    description: 'Removing product category'
                }
            },
            resolve: (_, { productCategory }) => productService.getProductById(productCategory.productId, true).then(product => {
                return productService.deleteProductCategory(product, productCategory.categoryId);
            })
        },
        alter: {
            type: GraphQLNonNull(ProductCategoryType),
            description: 'Alter product category',
            args: {
                productCategory: {
                    type: GraphQLNonNull(ProductCategoryUpdateInputType),
                    description: 'Altering product category data'
                }
            },
            resolve: async (_, { productCategory: input }) => {
                let pc = await productService.getProductCategory(input.productId, input.categoryId);
                if (pc != null) {
                    const product = await productService.getProductById(input.productId, true);
                    pc = await productService.updateProductCategory(product,
                        pc.categoryId,
                        input.displayOrder != null || pc.displayOrder,
                        input.feature != null ? input.feature : pc.feature,
                        input.show != null || pc.show);
                    //add omitted product id
                    pc.productId = product.id;
                    return pc;
                }
            }
        }
    })
});

module.exports = ProductCategoryMutationType;