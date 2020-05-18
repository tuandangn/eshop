const Category = require('../../core/domain/models/category.model');
const Product = require('../../core/domain/models/product.model');

const commonResolver = () => ({
    IPageableEntity: {
        __resolveType: (current) => {
            if (current instanceof Category) {
                return "Category";
            } else if (current instanceof Product) {
                return "Product";
            }
        }
    },
    IPageInfo: {
        __resolveType: () => "PageInfo"
    },
    IPagedList: {
        __resolveType: () => '' 
    }
});

module.exports = commonResolver;