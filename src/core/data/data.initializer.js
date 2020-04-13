const { getCategoryService, getProductService } = require('../../common/service.factory');
const categorySeedData = require('./data-seeders/category.seeder');
const productSeedData = require('./data-seeders/product.seeder');

async function dataInitializer() {
    const categoryService = getCategoryService();
    const productService = getProductService();

    await seedData(categoryService, productService);
}

async function seedData(categoryService, productService) {
    await categorySeedData(categoryService);
    await productSeedData(productService, categoryService);
}

module.exports = dataInitializer;