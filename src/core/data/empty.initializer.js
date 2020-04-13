const { category, product } = require('../symbols/repository.symbol');
const repository = require('./mongoose.repository');

async function emptyInitializer() {
    const categoryRepository = repository[category];
    const productRepository = repository[product];

    await clearCategory(categoryRepository);
    await clearProducts(productRepository);
}

async function clearCategory(categoryRepository) {
    const categories = await categoryRepository.find({});

    for (const category of categories) {
        await categoryRepository.delete(category);
    }
}

async function clearProducts(productRepository) {
    const products = await productRepository.find({});

    for (const product of products) {
        await productRepository.delete(product);
    }
}

module.exports = emptyInitializer;