const { category, product } = require('../core/symbols/repository.symbol');
const repository = require('../core/data/mongoose.repository');
const CategoryService = require('../services/category.service');
const ProductService = require('../services/product.service');

const savedServices = new Map();

function getCategoryService() {
    return getService(CategoryService, getRepositories(category));
}

function getProductService() {
    return getService(ProductService, getRepositories(product, category));
}

function getService(target, repositories) {
    if (savedServices.has(target)) {
        return savedServices.get(target);
    }
    const service = new target(...repositories);
    savedServices.set(target, service);
    return service;
}

function getRepositories(...keys) {
    const repositories = [];
    for (const key of keys) {
        repositories.push(repository[key]);
    }
    return repositories;
}

module.exports = {
    getCategoryService,
    getProductService
}