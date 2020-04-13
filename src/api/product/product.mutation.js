const { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLBoolean } = require('graphql');
const ProductType = require('../../graphql/types/product');
const ProductCategoryType = require('../../graphql/types/product-category');
const ProductCategoryInputType = require('../../graphql/inputs/product-category.input');
const ProductCategoryUpdateInputType = require('../../graphql/inputs/product-update-category.input');
const ProductInputType = require('../../graphql/inputs/product.input');
const ProductUpdateInputType = require('../../graphql/inputs/product-update.input');
const { getProductService } = require('../../common/service.factory');

const productService = getProductService();

const ProductMutationType = new GraphQLObjectType({
    name: 'ProductMutation',
    description: 'Product Mutation',
    fields: () => ({
        create: {
            type: GraphQLNonNull(ProductType),
            description: 'Create product',
            args: {
                product: {
                    type: GraphQLNonNull(ProductInputType),
                    description: 'Creating product'
                }
            },
            resolve: (_, { product }) => productService.createProduct(product)
        },
        delete: {
            type: GraphQLNonNull(GraphQLBoolean),
            description: 'Delete product',
            args: {
                id: {
                    type: GraphQLNonNull(GraphQLID),
                    description: 'Deleting product id'
                }
            },
            resolve: (_, { id }) => productService.getProductById(id, true).then(product => productService.deleteProduct(product))
        },
        update: {
            type: GraphQLNonNull(ProductType),
            description: 'Update product',
            args: {
                id: {
                    type: GraphQLNonNull(GraphQLID),
                    description: 'Updating product id'
                },
                data: {
                    type: GraphQLNonNull(ProductUpdateInputType),
                    description: 'Updating product data'
                }
            },
            resolve: (_, { id, data }) => productService.getProductById(id, true).then(product => {
                if (product != null) {
                    Object.assign(product, data);
                    return productService.updateProduct(product);
                }
            })
        },
        addToCategory: {
            type: GraphQLNonNull(ProductCategoryType),
            description: 'Add product to category',
            args: {
                productCategory: {
                    type: GraphQLNonNull(ProductCategoryInputType),
                    description: 'Product category data input'
                }
            },
            resolve: (_, { productCategory }) => productService.getProductById(productCategory.productId, true).then(product => {
                if (product != null) {
                    return productService.addProductCategory(product,
                        productCategory.categoryId,
                        productCategory.displayOrder,
                        productCategory.feature).then(pc => {
                            //try add omitted product id
                            pc.productId = product.id;
                            return pc;
                        });
                }
            })
        },
        removeFromCategory: {
            type: GraphQLNonNull(GraphQLBoolean),
            description: 'Remove product from category',
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
        alterForCategory: {
            type: GraphQLNonNull(ProductCategoryType),
            description: 'Alter product for category',
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
        },
        addToGroup: {
            type: GraphQLNonNull(ProductType),
            description: 'Add product to group product',
            args: {
                id: {
                    type: GraphQLNonNull(GraphQLID),
                    description: 'Product id'
                },
                group: {
                    type: GraphQLNonNull(GraphQLID),
                    description: 'Group product id'
                }
            },
            resolve: (_, { id, group }) => productService.addProductToGroup(id, group)
        }
    })
});

module.exports = ProductMutationType;