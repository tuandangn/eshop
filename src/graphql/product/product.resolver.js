const { SINGLE, GROUP } = require('../../core/contants/product-type.const');
const { ALL, FEATURE, NONFEATURE } = require('../../core/contants/product-category-type.const');

const productResolver = (productService, categoryService) => ({
    ProductType: {
        SINGLE,
        GROUP
    },
    ProductCategoryType: {
        ALL,
        FEATURE,
        NONFEATURE
    },
    Product: {
        group: (product, { showHidden }) => productService.getProductsByGroupId(product.id, showHidden),
        categories: (product, { type, showHidden }) => productService.getCategoriesByProduct(product, type, true, showHidden)
    },
    ProductQuery: {
        all: (_, { showHidden }) => productService.getAllProducts(showHidden),

        list: (_, { page, size, showHidden }) => productService.getPagedListProducts(page, size, showHidden),

        one: (_, { id, showHidden }) => {
            console.log(_, id, showHidden);
            return productService.getProductById(id, showHidden);
        },

        search: (_, { name, showHidden }) => productService.getProductsByName(name, showHidden),

        inCategory: (_, { categoryId, showHidden }) => productService.getProductsInCategory(categoryId, showHidden)
    },
    IProduct: {
        __resolveType: () => "Product"
    },
    ProductMutation: {
        create: (_, { product }) => productService.createProduct(product),
        delete: (_, { id }) => productService.getProductById(id, true).then(product => productService.deleteProduct(product)),
        update: (_, { id, data }) => productService.getProductById(id, true).then(product => {
            if (product != null) {
                Object.assign(product, data);
                return productService.updateProduct(product);
            }
        }),
        addToCategory: (_, { productCategory }) => productService.getProductById(productCategory.productId, true).then(product => {
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
        }),
        removeFromCategory: (_, { productCategory }) => productService.getProductById(productCategory.productId, true).then(product => {
            return productService.deleteProductCategory(product, productCategory.categoryId);
        }),
        alterForCategory: async (_, { productCategory: input }) => {
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
        },
        addToGroup: (_, { id, group }) => productService.addProductToGroup(id, group)
    },
    ProductCategory: {
        product: ({ productId }) => productService.getProductById(productId, true),
        category: ({ categoryId }) => categoryService.getCategoryById(categoryId, true)

    },
    IProductCategory: {
        __resolveType: () => "ProductCategory"
    }
});

module.exports = productResolver;