const products = [
    { name: 'God Father', displayOrder: 1, show: true, price: 99.99, shortDesc: 'God father book' },
    { name: 'Perfect Chess', displayOrder: 2, show: true, price: 88.99, shortDesc: 'Perfect Chess' },
    { name: 'Blue Sea', displayOrder: 3, show: true, price: 77.99, shortDesc: 'Blue Sea book' },
    { name: 'Little womens', displayOrder: 4, show: true, price: 66.99, shortDesc: 'Little women book' },
    { name: 'The shinning', displayOrder: 5, show: true, price: 55.99, shortDesc: 'The shinning book' },
]

async function productSeedData(productService, categoryService) {
    const productCount$ = () => productService.getProductCount(true);
    const createProduct$ = product => productService.createProduct(product);
    const addProducts$ = async () => {
        const categoryIds = (await categoryService.getAllCategories(true)).map(category => category.id);
        for (const product of products) {
            const categoryId = categoryIds[Math.floor(Math.random() * categoryIds.length)];
            product.categories = [{ categoryId, displayOrder: 1, show: true, feature: false }];
            await createProduct$(product);
        }
    };
    const count = await productCount$();

    if (count === 0) {
        await addProducts$();
    }
}

module.exports = productSeedData;