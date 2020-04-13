const categories = [
    { name: 'Book', displayOrder: 1, show: true, defaultPageSize: 12 },
    { name: 'Computer', displayOrder: 2, show: true, defaultPageSize: 12 },
    { name: 'Headphone', displayOrder: 3, show: false, defaultPageSize: 12 },
    { name: 'CPU', displayOrder: 4, show: true, defaultPageSize: 12 }];

async function categorySeedData(categoryService) {
    const categoryCount$ = () => categoryService.getCategoryCount(true);
    const createCategory$ = category => categoryService.createCategory(category);
    const addCategories$ = async () => {
        for (const category of categories) {
            await createCategory$(category);
        }
    };

    const count = await categoryCount$();
    if (count === 0) {
        await addCategories$();
    }
}

module.exports = categorySeedData;