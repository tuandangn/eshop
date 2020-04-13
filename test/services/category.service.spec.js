const expect = require('chai').expect;
const simple = require('simple-mock');
const CategoryService = require('../../src/services/category.service');

describe('CategoryService', () => {
    describe('getCategoryById()', () => {
        it('should throw error if id is null', done => {
            const categoryService = new CategoryService(null);

            categoryService.getCategoryById().catch(error => {
                expect(error).to.not.be.null;
                done();
            });
        });

        it('should get category by id', done => {
            const id = "category id";
            const category = { id, show: true };
            const repository = {
                findById() {
                    return Promise.resolve(category);
                }
            };
            const categoryService = new CategoryService(repository);

            categoryService.getCategoryById(id).then(result => {
                expect(result).to.equal(category);
                done();
            });
        });

        it('should exclude deleted category', done => {
            const id = "deleted category id";
            const category = { id, deleted: true };
            const repository = {
                findById() {
                    return Promise.resolve(category);
                }
            };
            const categoryService = new CategoryService(repository);

            categoryService.getCategoryById(id).then(result => {
                expect(result).to.null;
                done();
            });
        });

        it('should exclude not shown category', done => {
            const id = "not shown category id";
            const category = { id, deleted: false, show: false };
            const repository = {
                findById() {
                    return Promise.resolve(category);
                }
            };
            const categoryService = new CategoryService(repository);

            categoryService.getCategoryById(id).then(result => {
                expect(result).to.null;
                done();
            });
        });
    });

    describe('createCategory()', () => {
        it('should throw error if category is null', () => {
            const categoryService = new CategoryService(null);

            expect(categoryService.createCategory).throw();
        });

        it('should create category', done => {
            const category = {
                name: 'name'
            };
            const createdCategory = Object.assign({}, category, { _id: 'id' });
            const repository = {
                create() {
                    return Promise.resolve(createdCategory);
                }
            };
            const categoryService = new CategoryService(repository);

            categoryService.createCategory(category).then(result => {
                expect(result).to.equal(createdCategory);
                done();
            });
        });
    });

    describe('updateCategory()', () => {
        it('should throw error if category is null', done => {
            const categoryService = new CategoryService(null);

            categoryService.updateCategory().catch(error => {
                expect(error).to.not.be.null;
                done();
            });
        });

        it('should throw error if category is not found', done => {
            const id = 'not found category id';
            const updateCategory = { _id: id };
            const repository = { findById() { } };
            simple.mock(repository, 'findById').resolveWith(null);
            const categoryService = new CategoryService(repository);

            categoryService.updateCategory(updateCategory).catch(error => {
                expect(error).to.not.be.null;
                done();
            });
        });

        it('should throw error if category is deleted', done => {
            const category = { _id: 'deleted category', deleted: true };
            const repository = {
                findById() { }
            }
            simple.mock(repository, 'findById').resolveWith(category);
            const categoryService = new CategoryService(repository);

            categoryService.updateCategory(category).catch(error => {
                expect(error).to.not.be.null;
                done();
            });
        });

        it('should update category', done => {
            const category = {
                _id: 'id',
                name: 'category',
                save() { }
            };
            const repository = { findById() { }, update() { } };
            simple.mock(repository, 'findById').resolveWith(category);
            simple.mock(repository, 'update').resolveWith(category);
            const categoryService = new CategoryService(repository);

            categoryService.updateCategory(category).then(result => {
                expect(result).to.equal(category);
                expect(repository.update.callCount).to.equal(1);
                done();
            });
        });
    });

    describe('deleteCategory()', () => {
        it('should throw error if category is null', () => {
            const categoryService = new CategoryService(null);

            expect(categoryService.deleteCategory).throw();
        });

        it('should update deleted property of category', done => {
            const category = { name: 'name', save() { } };
            const repository = { delete() { } };
            simple.mock(repository, 'delete');
            simple.mock(category, 'save').resolveWith(category);
            const categoryService = new CategoryService(repository);

            categoryService.deleteCategory(category).then(() => {
                expect(category.deleted).to.be.true;
                expect(category.save.callCount).to.equal(1);
                expect(repository.delete.callCount).to.equal(0);
                done();
            });
        });
    });

    describe('getCategoryCount()', () => {
        it('should get category count', done => {
            const count = 100;
            const repository = {
                count() { }
            };
            simple.mock(repository, 'count').resolveWith(count);
            const categoryService = new CategoryService(repository);

            categoryService.getCategoryCount().then(result => {
                expect(result).to.equal(count);
                done();
            });
        });

        it('should exclude deleted categories', done => {
            const showHidden = true;
            const count = 100;
            const repository = {
                count() { }
            };
            simple.mock(repository, 'count').resolveWith(count);
            const categoryService = new CategoryService(repository);

            categoryService.getCategoryCount(showHidden).then(() => {
                expect(repository.count.calls[0].args).to.deep.include({ deleted: false });
                done();
            });
        });

        it('should exclude not shown categories', done => {
            const count = 1;
            const repository = {
                count() { }
            };
            simple.mock(repository, 'count').resolveWith(count);
            const categoryService = new CategoryService(repository);

            categoryService.getCategoryCount().then(() => {
                expect(repository.count.calls[0].args).to.deep.include({ deleted: false, show: true });
                done();
            });
        });
    });

    describe('getAllCategories()', () => {
        it('should get all categories', done => {
            const categories = [{ name: 'name 1' }, { name: 'name 2' }];
            const repository = {
                find() { }
            };
            simple.mock(repository, 'find').resolveWith(categories);
            const categoryService = new CategoryService(repository);

            categoryService.getAllCategories().then(result => {
                expect(result.length).to.equal(categories.length);
                done();
            });
        });

        it('should exclude deleted categories', done => {
            const showHidden = true;
            const categories = [{ name: 'name 1' }, { name: 'name 2' }];
            const repository = {
                find() { }
            };
            simple.mock(repository, 'find').resolveWith(categories);
            const categoryService = new CategoryService(repository);

            categoryService.getAllCategories(showHidden).then(() => {
                expect(repository.find.calls[0].args).to.deep.include({ deleted: false });
                done();
            });
        });

        it('should exclude not shown categories', done => {
            const categories = [];
            const repository = {
                find() { }
            };
            simple.mock(repository, 'find').resolveWith(categories);
            const categoryService = new CategoryService(repository);

            categoryService.getAllCategories().then(() => {
                expect(repository.find.calls[0].args).to.deep.include({ deleted: false, show: true });
                done();
            });
        });
    });

    describe('getCategoriesByParentId()', () => {
        it('should throw error if category is null', () => {
            const categoryService = new CategoryService(null);

            expect(categoryService.getCategoriesByParentId).throw();
        });

        it('should get children categories', done => {
            const parentCategory = { _id: 'parent id' };
            const childrenCategories = [{ parent: parentCategory._id }, { parent: parentCategory._id }];
            const repository = {
                find() { }
            };
            simple.mock(repository, 'find').resolveWith(childrenCategories);
            const categoryService = new CategoryService(repository);

            categoryService.getCategoriesByParentId(parentCategory).then(result => {
                expect(result).to.equal(childrenCategories);
                done();
            });
        });

        it('should exclude deleted categories', done => {
            const parentCategory = { _id: 'parent id' };
            const childrenCategories = [];
            const showHidden = true;
            const repository = {
                find() { }
            };
            simple.mock(repository, 'find').resolveWith(childrenCategories);
            const categoryService = new CategoryService(repository);

            categoryService.getCategoriesByParentId(parentCategory, showHidden).then(() => {
                expect(repository.find.calls[0].args).to.deep.include({ parent: parentCategory._id, deleted: false });
                done();
            });
        });

        it('should exclude not shown categories', done => {
            const parentCategory = { _id: 'parent id' };
            const childrenCategories = [];
            const repository = {
                find() { }
            };
            simple.mock(repository, 'find').resolveWith(childrenCategories);
            const categoryService = new CategoryService(repository);

            categoryService.getCategoriesByParentId(parentCategory).then(() => {
                expect(repository.find.calls[0].args).to.deep.include({ parent: parentCategory._id, deleted: false, show: true });
                done();
            });
        });
    });

    describe('getCategoriesByName()', () => {
        it('should throw error if name is null', done => {
            const categoryService = new CategoryService(null);

            categoryService.getCategoriesByName().catch(error => {
                expect(error).to.not.null;
                done();
            });
        });

        it('should get categories by name', done => {
            const findName = 'a';
            const categories = [{ name: 'a' }, { name: 'aa' }, { name: 'ac' }, { name: 'bb' }];
            const repository = {
                find() { }
            };
            simple.mock(repository, 'find').resolveWith(categories);
            const categoryService = new CategoryService(repository);

            categoryService.getCategoriesByName(findName).then(result => {
                expect(repository.find.callCount).to.equal(1);
                expect(result).to.have.members(categories.slice(0, 3));
                done();
            });
        });

        it('should exclude deleted categories', done => {
            const findName = 'a';
            const showHidden = true;
            const categories = [];
            const repository = {
                find() { }
            };
            simple.mock(repository, 'find').resolveWith(categories);
            const categoryService = new CategoryService(repository);

            categoryService.getCategoriesByName(findName, showHidden).then(() => {
                expect(repository.find.calls[0].args).to.deep.include({ deleted: false });
                done();
            });
        });

        it('should exclude not shown categories', done => {
            const findName = 'a';
            const categories = [];
            const repository = {
                find() { }
            };
            simple.mock(repository, 'find').resolveWith(categories);
            const categoryService = new CategoryService(repository);

            categoryService.getCategoriesByName(findName).then(() => {
                expect(repository.find.calls[0].args).to.deep.include({ deleted: false, show: true });
                done();
            });
        });
    });

    describe('getCategoriesByIds()', () => {
        it('should throw error if ids is null', () => {
            const categoryService = new CategoryService(null);

            expect(categoryService.getCategoriesByIds).throw();
        });

        it('should get categories by ids', done => {
            const ids = ['id1', 'id2'];
            const showHidden = true;
            const cat1 = { id: 'id1' };
            const cat2 = { id: 'id2' };
            const repository = { findById() { } };
            simple.mock(repository, 'findById')
                .resolveWith(cat1)
                .resolveWith(cat2);
            const categoryService = new CategoryService(repository);

            categoryService.getCategoriesByIds(ids, showHidden).then(result => {
                expect(result).to.deep.equal([cat1, cat2]);
                expect(repository.findById.callCount).to.equal(2);
                done();
            });
        });

        it('should exclude deleted categories', done => {
            const ids = ['id'];
            const cat = { deleted: true };
            const repository = { findById() { } };
            simple.mock(repository, 'findById').resolveWith(cat);
            const categoryService = new CategoryService(repository);

            categoryService.getCategoriesByIds(ids).then(result => {
                expect(result.length).to.equal(0);
                done();
            });
        });

        it('should exclude not shown categories', done => {
            const ids = ['id'];
            const cat = { deleted: false, show: false };
            const repository = { findById() { } };
            simple.mock(repository, 'findById').resolveWith(cat);
            const categoryService = new CategoryService(repository);

            categoryService.getCategoriesByIds(ids).then(result => {
                expect(result.length).to.equal(0);
                done();
            });
        });
    });
});