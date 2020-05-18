const { PRODUCTS, NEWS } = require('../../core/contants/category-type.const');

const categoryResolver = (categoryService, productService) => ({
    CategoryType: {
        PRODUCTS,
        NEWS
    },
    Category: {
        parent: (current, { showHidden }) =>
            current.parent ?
                categoryService.getCategoryById(current.parent, showHidden) :
                Promise.resolve(null),
        children: (current, { showHidden }) => categoryService.getCategoriesByParentId(current, showHidden),
        products: (category, { showHidden }) => {
            return productService.getProductsInCategory(category.id, showHidden);
        }
    },
    ICategory: {
        __resolveType: () => "Category"
    },
    CategoryQuery: {
        all: (_, { showHidden }) => categoryService.getAllCategories(showHidden),

        one: (_, { id, showHidden }) => categoryService.getCategoryById(id, showHidden),

        //*TODO* sort args
        search: (_, { name, showHidden }) => categoryService.getCategoriesByName(name, showHidden)
    },
    CategoryMutation: {
        create: (_, { category }) => categoryService.createCategory(category),

        delete: (_, { id }) => categoryService.getCategoryById(id, true).then(category => categoryService.deleteCategory(category)),

        update: (_, { id, data }) => categoryService.getCategoryById(id, true).then(category => {
            if (category != null) {
                Object.assign(category, data);
                return categoryService.updateCategory(category);
            }
        })
    }
});

module.exports = categoryResolver;