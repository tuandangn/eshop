const { getCategoryService, getProductService } = require('../common/service.factory');

const productService = getProductService();
const categoryService = getCategoryService();

const categoryResolver = require('./category/category.resolver');
const productResolver = require('./product/product.resolver');
const commonResolver = require('./common/common.resolver');
const queryResolver = require('./query.resolver');
const mutationResolver = require('./mutation.resolver');

const resolvers = [
    categoryResolver(categoryService, productService),
    productResolver(productService, categoryService),
    commonResolver(),
    queryResolver(),
    mutationResolver()
];

module.exports = resolvers;