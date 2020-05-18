const expect = require('chai').expect;
const simple = require('simple-mock');
const { NEWS, PRODUCTS } = require('../../../src/core/contants/category-type.const');
const categoryResolver = require('../../../src/graphql/category/category.resolver');

describe('CategoryResolver', () => {
    describe('CategoryType', () => {
        it('should have category types', () => {
            const resolver = categoryResolver();

            expect(resolver.CategoryType).deep.equal({
                NEWS, PRODUCTS
            });
        });
    });
    describe('Category', () => {
        describe('parent()', () => {
            it('should null if current item not have parent', async () => {
                const current = { parent: 0 };
                const resolver = categoryResolver();

                const nullResult = await resolver.Category.parent(current, { showHidden: false });

                expect(nullResult).to.be.null;
            }); it('should get parent category if current item have parent', async () => {
                const current = { parent: 1 };
                const showHidden = true;
                const parentCategory = {};
                const categoryService = {
                    getCategoryById() { }
                };
                simple.mock(categoryService, "getCategoryById").resolveWith(parentCategory);
                const resolver = categoryResolver(categoryService);

                const result = await resolver.Category.parent(current, { showHidden });

                expect(result).to.be.equal(parentCategory);
                expect(categoryService.getCategoryById.calls[0].args).to.deep.eq([current.parent, showHidden]);
            });
        });
        describe('children()', () => {
            it('should get children categories', async () => {
                const childrenCategories = [{}];
                const categoryService = {
                    getCategoriesByParentId() { }
                };
                simple.mock(categoryService, 'getCategoriesByParentId').resolveWith(childrenCategories);
                const resolver = categoryResolver(categoryService);
                const current = {};
                const showHidden = false;

                const result = await resolver.Category.children(current, { showHidden });

                expect(result).to.be.equal(childrenCategories);
                expect(categoryService.getCategoriesByParentId.calls[0].args).to.deep.equal([current, showHidden]);
            });
        });
        describe('products()', () => {
            it('should get products in category', async () => {
                const currentCategory = { id: 1 };
                const showHidden = true;
                const products = [{}];
                const productService = {
                    getProductsInCategory() { }
                };
                simple.mock(productService, "getProductsInCategory").resolveWith(products);
                const resolver = categoryResolver(null, productService);

                const result = await resolver.Category.products(currentCategory, { showHidden });

                expect(result).to.be.equal(products);
                expect(productService.getProductsInCategory.calls[0].args).to.deep.equal([currentCategory.id, showHidden]);
            });
        });
    });
    describe('ICategory', () => {
        it('should have Category resolved type', () => {
            const resolver = categoryResolver();

            const type = resolver.ICategory.__resolveType();

            expect(type).to.eq("Category");
        });
    });

    describe('CategoryQuery', () => {
        describe('all()', () => {
            it('should get all categories', async () => {
                const allCategories = [{}, {}, {}];
                const showHidden = false;
                const categoryService = {
                    getAllCategories() { }
                };
                simple.mock(categoryService, 'getAllCategories').resolveWith(allCategories);
                const resolver = categoryResolver(categoryService);

                const result = await resolver.CategoryQuery.all(null, { showHidden });

                expect(result).to.be.equal(allCategories);
                expect(categoryService.getAllCategories.calls[0].args).to.deep.include(showHidden);
            });
        });

        describe('one()', () => {
            it('should get category by id', async () => {
                const id = 1234;
                const showHidden = true;
                const category = { id };
                const categoryService = {
                    getCategoryById() { }
                };
                simple.mock(categoryService, 'getCategoryById').resolveWith(category);
                const resolver = categoryResolver(categoryService);

                const result = await resolver.CategoryQuery.one(null, { id, showHidden });

                expect(result).to.be.equal(category);
                expect(categoryService.getCategoryById.calls[0].args).to.deep.equal([id, showHidden]);
            });
        });

        describe('search()', () => {
            it('should search categories by name', async () => {
                const searchResult = [{}, {}];
                const keywords = 'keywords';
                const showHidden = false;
                const categoryService = {
                    getCategoriesByName() { }
                };
                simple.mock(categoryService, 'getCategoriesByName').resolveWith(searchResult);
                const resolver = categoryResolver(categoryService);

                const result = await resolver.CategoryQuery.search(null, { name: keywords, showHidden });

                expect(result).to.be.equal(searchResult);
                expect(categoryService.getCategoriesByName.calls[0].args).to.deep.equal([keywords, showHidden]);
            });
        });
    });

    describe('CategoryMutation', () => {
        describe('create()', () => {
            it('should create category', async () => {
                const data = { name: 'name', type: 'type' };
                const createdCategory = { ...data };
                const categoryService = {
                    createCategory() { }
                };
                simple.mock(categoryService, 'createCategory').resolveWith(createdCategory);
                const resolver = categoryResolver(categoryService);

                const result = await resolver.CategoryMutation.create(null, { category: data });

                expect(result).to.be.equal(createdCategory);
                expect(categoryService.createCategory.calls[0].args[0]).to.be.equal(data);
            });
        });

        describe('delete()', () => {
            it('should delete category', async () => {
                const id = 5231;
                const category = { id };
                const deleteResult = false;
                const categoryService = {
                    getCategoryById() { },
                    deleteCategory() { }
                };
                simple.mock(categoryService, 'getCategoryById').resolveWith(category);
                simple.mock(categoryService, 'deleteCategory').resolveWith(deleteResult);
                const resolver = categoryResolver(categoryService);

                const result = await resolver.CategoryMutation.delete(null, { id });

                expect(result).to.be.equal(deleteResult);
                expect(categoryService.getCategoryById.calls[0].args).to.deep.include(id);
                expect(categoryService.deleteCategory.calls[0].args).to.deep.include(category);
            });
        });

        describe('update()', () => {
            it('should skip update if category is not found', async () => {
                const id = 999;
                const data = { name: 'name 1', type: 'type 1' };
                const categoryService = {
                    getCategoryById() { },
                    updateCategory() { }
                };
                simple.mock(categoryService, 'getCategoryById').resolveWith(null);
                simple.mock(categoryService, 'updateCategory');
                const resolver = categoryResolver(categoryService);

                const result = await resolver.CategoryMutation.update(null, { id, data });

                expect(result).to.be.undefined;
                expect(categoryService.getCategoryById.calls[0].args).to.deep.include(id);
                expect(categoryService.updateCategory.callCount).to.be.equal(0);
            })

            it('should update category', async () => {
                const id = 999;
                const data = { name: 'name 1', type: 'type 1' };
                const category = { name: 'name' };
                const updatedCategory = Object.assign(category, data);
                const categoryService = {
                    getCategoryById() { },
                    updateCategory() { }
                };
                simple.mock(categoryService, 'getCategoryById').resolveWith(category);
                simple.mock(categoryService, 'updateCategory').resolveWith(updatedCategory);
                const resolver = categoryResolver(categoryService);

                const result = await resolver.CategoryMutation.update(null, { id, data });

                expect(result).to.be.equal(updatedCategory);
                expect(categoryService.getCategoryById.calls[0].args).to.deep.include(id);
                expect(categoryService.updateCategory.calls[0].args).to.deep.include(updatedCategory);
            });
        });
    });
});