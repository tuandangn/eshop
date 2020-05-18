const expect = require('chai').expect;
const simple = require('simple-mock');
const ProductService = require('../../src/services/product.service');
const { FEATURE, NON_FEATURE } = require('../../src/core/contants/product-category-type.const');
const { SINGLE, GROUP } = require('../../src/core/contants/product-type.const');
const QueryBuilder = require('../../src/core/data/query-builder');

describe('ProductService', () => {
    describe('getProductById()', () => {
        it('should throw error if id is null', done => {
            const productService = new ProductService(null);

            productService.getProductById().catch(error => {
                expect(error).to.not.be.null;
                done();
            });
        });

        it('should get product by id', done => {
            const id = "product id";
            const product = { id, show: true };
            const repository = {
                findById() {
                    return Promise.resolve(product);
                }
            };
            const productService = new ProductService(repository);

            productService.getProductById(id).then(result => {
                expect(result).to.equal(product);
                done();
            });
        });

        it('should exclude deleted product', done => {
            const id = "deleted product id";
            const product = { id, deleted: true };
            const repository = {
                findById() {
                    return Promise.resolve(product);
                }
            };
            const productService = new ProductService(repository);

            productService.getProductById(id).then(result => {
                expect(result).to.null;
                done();
            });
        });

        it('should exclude not shown product', done => {
            const id = "not shown product id";
            const product = { id, deleted: false, show: false };
            const repository = {
                findById() {
                    return Promise.resolve(product);
                }
            };
            const productService = new ProductService(repository);

            productService.getProductById(id).then(result => {
                expect(result).to.null;
                done();
            });
        });
    });

    describe('createProduct()', () => {
        it('should throw error if product is null', () => {
            const productService = new ProductService(null);

            expect(productService.createProduct).throw();
        });

        it('should create product', done => {
            const product = {
                name: 'name'
            };
            const createdProduct = Object.assign({}, product, { _id: 'id' });
            const repository = {
                create() {
                    return Promise.resolve(createdProduct);
                }
            };
            const productService = new ProductService(repository);

            productService.createProduct(product).then(result => {
                expect(result).to.equal(createdProduct);
                done();
            });
        });
    });

    describe('updateProduct()', () => {
        it('should throw error if product is null', done => {
            const productService = new ProductService(null);

            productService.updateProduct().catch(error => {
                expect(error).to.not.be.null;
                done();
            });
        });

        it('should throw error if product is not found', done => {
            const id = 'not found product id';
            const updateProduct = { _id: id };
            const repository = { findById() { } };
            simple.mock(repository, 'findById').resolveWith(null);
            const productService = new ProductService(repository);

            productService.updateProduct(updateProduct).catch(error => {
                expect(error).to.not.be.null;
                done();
            });
        });

        it('should throw error if product is deleted', done => {
            const product = { _id: 'deleted product', deleted: true };
            const repository = {
                findById() { }
            }
            simple.mock(repository, 'findById').resolveWith(product);
            const productService = new ProductService(repository);

            productService.updateProduct(product).catch(error => {
                expect(error).to.not.be.null;
                done();
            });
        });

        it('should update product', done => {
            const product = {
                _id: 'id',
                name: 'product',
                save() { }
            };
            const repository = { findById() { }, update() { } };
            simple.mock(repository, 'findById').resolveWith(product);
            simple.mock(repository, 'update').resolveWith(product);
            const productService = new ProductService(repository);

            productService.updateProduct(product).then(result => {
                expect(result).to.equal(product);
                expect(repository.update.callCount).to.equal(1);
                done();
            });
        });
    });

    describe('deleteProduct()', () => {
        it('should throw error if product is null', () => {
            const productService = new ProductService(null);

            expect(productService.deleteProduct).throw();
        });

        it('should update deleted property of product', done => {
            const product = { name: 'name', save() { } };
            const repository = { delete() { } };
            simple.mock(repository, 'delete');
            simple.mock(product, 'save').resolveWith(product);
            const productService = new ProductService(repository);

            productService.deleteProduct(product).then(() => {
                expect(product.deleted).to.be.true;
                expect(product.save.callCount).to.equal(1);
                expect(repository.delete.callCount).to.equal(0);
                done();
            });
        });
    });

    describe('getProductCount()', () => {
        it('should get product count', done => {
            const count = 100;
            const repository = {
                count() { }
            };
            simple.mock(repository, 'count').resolveWith(count);
            const productService = new ProductService(repository);

            productService.getProductCount().then(result => {
                expect(result).to.equal(count);
                done();
            });
        });

        it('should exclude deleted products', done => {
            const showHidden = true;
            const count = 100;
            const repository = {
                count() { }
            };
            simple.mock(repository, 'count').resolveWith(count);
            const productService = new ProductService(repository);

            productService.getProductCount(showHidden).then(() => {
                expect(repository.count.calls[0].args).to.deep.include({ deleted: false });
                done();
            });
        });

        it('should exclude not shown products', done => {
            const count = 1;
            const repository = {
                count() { }
            };
            simple.mock(repository, 'count').resolveWith(count);
            const productService = new ProductService(repository);

            productService.getProductCount().then(() => {
                expect(repository.count.calls[0].args).to.deep.include({ deleted: false, show: true });
                done();
            });
        });
    });

    describe('getPagedListProduct()', () => {
        it('should get paged products', done => {
            const page = 2;
            const size = 1;
            const count = 5;
            const products = [{ name: 'name 1' }];
            const repository = {
                find: {
                    builder: new QueryBuilder(() => { })
                },
                count() { }
            };
            simple.mock(repository.find.builder, 'build')
                .returnWith({ exec() { return Promise.resolve(products) } });
            simple.mock(repository, 'count').resolveWith(count);
            const productService = new ProductService(repository);

            productService.getPagedListProducts(page, size).then(result => {
                expect(result.data).to.equal(products);
                expect(result.pageInfo).to.deep.eq({ page, size, totalPages: count, totalItems: count });
                expect(repository.count.calls[0].args).to.deep.include({ deleted: false, show: true });
                done();
            });
        });

        it('should exclude not shown products', done => {
            const showHidden = true;
            const page = 2;
            const size = 1;
            const count = 5;
            const products = [{ name: 'name 1' }];
            const repository = {
                find: {
                    builder: new QueryBuilder(() => { })
                },
                count() { }
            };
            simple.mock(repository.find.builder, 'build')
                .returnWith({ exec() { return Promise.resolve(products) } });
            simple.mock(repository, 'count').resolveWith(count);
            const productService = new ProductService(repository);

            productService.getPagedListProducts(page, size, showHidden).then(result => {
                expect(result.data).to.equal(products);
                expect(result.pageInfo).to.deep.eq({ page, size, totalPages: count, totalItems: count });
                expect(repository.count.calls[0].args).to.deep.include({ deleted: false });
                done();
            });
        });
    });

    describe('getAllProducts()', () => {
        it('should get all products', done => {
            const products = [{ name: 'name 1' }, { name: 'name 2' }];
            const repository = {
                find() { }
            };
            simple.mock(repository, 'find').resolveWith(products);
            const productService = new ProductService(repository);

            productService.getAllProducts().then(result => {
                expect(result.length).to.equal(products.length);
                done();
            });
        });

        it('should exclude deleted products', done => {
            const showHidden = true;
            const products = [{ name: 'name 1' }, { name: 'name 2' }];
            const repository = {
                find() { }
            };
            simple.mock(repository, 'find').resolveWith(products);
            const productService = new ProductService(repository);

            productService.getAllProducts(showHidden).then(() => {
                expect(repository.find.calls[0].args).to.deep.include({ deleted: false });
                done();
            });
        });

        it('should exclude not shown products', done => {
            const products = [];
            const repository = {
                find() { }
            };
            simple.mock(repository, 'find').resolveWith(products);
            const productService = new ProductService(repository);

            productService.getAllProducts().then(() => {
                expect(repository.find.calls[0].args).to.deep.include({ deleted: false, show: true });
                done();
            });
        });
    });

    describe('getProductsByName()', () => {
        it('should throw error if name is null', done => {
            const productService = new ProductService(null);

            productService.getProductsByName().catch(error => {
                expect(error).to.not.null;
                done();
            });
        });

        it('should get products by name', done => {
            const findName = 'a';
            const products = [{ name: 'a' }, { name: 'aa' }, { name: 'ac' }, { name: 'bb' }];
            const repository = {
                find() { }
            };
            simple.mock(repository, 'find').resolveWith(products);
            const productService = new ProductService(repository);

            productService.getProductsByName(findName).then(result => {
                expect(repository.find.callCount).to.equal(1);
                expect(result).to.have.members(products.slice(0, 3));
                done();
            });
        });

        it('should exclude deleted products', done => {
            const findName = 'a';
            const showHidden = true;
            const products = [];
            const repository = {
                find() { }
            };
            simple.mock(repository, 'find').resolveWith(products);
            const productService = new ProductService(repository);

            productService.getProductsByName(findName, showHidden).then(() => {
                expect(repository.find.calls[0].args).to.deep.include({ deleted: false });
                done();
            });
        });

        it('should exclude not shown products', done => {
            const findName = 'a';
            const products = [];
            const repository = {
                find() { }
            };
            simple.mock(repository, 'find').resolveWith(products);
            const productService = new ProductService(repository);

            productService.getProductsByName(findName).then(() => {
                expect(repository.find.calls[0].args).to.deep.include({ deleted: false, show: true });
                done();
            });
        });
    });

    describe('getCategoriesByProduct()', () => {
        it('should throw error if product is null', () => {
            const productService = new ProductService(null);

            expect(productService.getCategoriesByProduct).throw();
        });

        it('should get product categories', done => {
            const productCategories = [
                { categoryId: 'cat1', show: true },
                { categoryId: 'cat2', show: true }
            ];
            const product = { categories: productCategories };
            const cat1 = { id: 'cat1', deleted: false, show: true };
            const cat2 = { id: 'cat2', deleted: false, show: true };
            const categoryRepository = { findById() { } }
            simple.mock(categoryRepository, 'findById')
                .resolveWith(cat1)
                .resolveWith(cat2);
            const productService = new ProductService(null, categoryRepository);

            productService.getCategoriesByProduct(product).then(result => {
                expect(result).to.deep.equal([cat1, cat2]);
                expect(categoryRepository.findById.callCount).to.equal(2);
                expect(categoryRepository.findById.calls[0].args[0]).to.equal('cat1');
                expect(categoryRepository.findById.calls[1].args[0]).to.equal('cat2');
                done();
            });
        });

        it('should exclude deleted categories', done => {
            const productCategories = [
                { categoryId: 'cat1', show: true },
                { categoryId: 'cat2', show: true }
            ];
            const product = { categories: productCategories };
            const cat1 = { id: 'cat1', deleted: true };
            const cat2 = { id: 'cat2', deleted: true };
            const categoryRepository = { findById() { } }
            simple.mock(categoryRepository, 'findById')
                .resolveWith(cat1)
                .resolveWith(cat2);
            const productService = new ProductService(null, categoryRepository);

            productService.getCategoriesByProduct(product).then(result => {
                expect(result.length).to.equal(0);
                done();
            });
        });

        it('should sort by display order', done => {
            const productCategories = [
                { categoryId: 'cat1', displayOrder: 2, show: true },
                { categoryId: 'cat2', displayOrder: 1, show: true }
            ];
            const product = { categories: productCategories };
            const cat1 = { id: 'cat1', deleted: false };
            const cat2 = { id: 'cat2', deleted: false };
            const categoryRepository = { findById() { } }
            simple.mock(categoryRepository, 'findById')
                .resolveWith(cat2)
                .resolveWith(cat1);
            const productService = new ProductService(null, categoryRepository);

            productService.getCategoriesByProduct(product).then(result => {
                expect(categoryRepository.findById.calls[0].args[0]).to.equal('cat2');
                expect(categoryRepository.findById.calls[1].args[0]).to.equal('cat1');
                done();
            });
        });

        it('should exclude not shown product categories', done => {
            const productCategories = [
                { categoryId: 'cat1', show: false }
            ];
            const product = { categories: productCategories };
            const cat1 = { id: 'cat1', deleted: false };
            const categoryRepository = { findById() { } }
            simple.mock(categoryRepository, 'findById').resolveWith(cat1);
            const productService = new ProductService(null, categoryRepository);

            productService.getCategoriesByProduct(product).then(result => {
                expect(result.length).to.equal(0);
                done();
            });
        });

        it('should exclude not shown categories', done => {
            const productCategories = [
                { categoryId: 'cat1', show: true }
            ];
            const product = { categories: productCategories };
            const cat1 = { id: 'cat1', deleted: false, show: false };
            const categoryRepository = { findById() { } }
            simple.mock(categoryRepository, 'findById').resolveWith(cat1);
            const productService = new ProductService(null, categoryRepository);

            productService.getCategoriesByProduct(product, null, true, false).then(result => {
                expect(result.length).to.equal(0);
                done();
            });
        });

        it('should get only on feature categories ', done => {
            const type = FEATURE;
            const productCategories = [
                { categoryId: 'cat1', show: true, feature: true },
                { categoryId: 'cat2', show: true, feature: false },
            ];
            const product = { categories: productCategories };
            const cat1 = { id: 'cat1', deleted: false, show: true };
            const cat2 = { id: 'cat2', deleted: false, show: true };
            const categoryRepository = { findById() { } }
            simple.mock(categoryRepository, 'findById')
                .resolveWith(cat1)
                .resolveWith(cat2);
            const productService = new ProductService(null, categoryRepository);

            productService.getCategoriesByProduct(product, type).then(result => {
                expect(result.length).to.equal(1);
                done();
            });
        });

        it('should get only on non-feature categories ', done => {
            const type = NON_FEATURE;
            const productCategories = [
                { categoryId: 'cat2', show: true, feature: false },
            ];
            const product = { categories: productCategories };
            const cat2 = { id: 'cat2', deleted: false, show: true };
            const categoryRepository = { findById() { } }
            simple.mock(categoryRepository, 'findById')
                .resolveWith(cat2);
            const productService = new ProductService(null, categoryRepository);

            productService.getCategoriesByProduct(product, type).then(result => {
                expect(result.length).to.equal(1);
                done();
            });
        });
    });

    describe('getProductCategory()', () => {
        it('should throw error if product id is null', () => {
            const productService = new ProductService();

            expect(productService.getProductCategory).throw();
        });

        it('should throw error if category id is null', () => {
            const productId = 'product id';
            const productService = new ProductService();

            expect(() => productService.getProductCategory(productId)).throw();
        });

        it('should null if product is not found', async () => {
            const productId = 'not found product id';
            const categoryId = 'category id';
            const productRepository = { findById() { } };
            simple.mock(productRepository, 'findById').resolveWith(null);
            const productService = new ProductService(productRepository, { findById() { } });

            const result = await productService.getProductCategory(productId, categoryId);

            expect(result).to.be.null;
        });

        it('should get product category in product', async () => {
            const productId = 'product id';
            const categoryId = 'not found category id';
            const productRepository = { findById() { } }
            const productCategory = { categoryId, displayOrder: 1, feature: true };
            const product = { id: productId, categories: [productCategory] };
            simple.mock(productRepository, 'findById').resolveWith(product);
            const productService = new ProductService(productRepository, { findById() { } });

            const result = await productService.getProductCategory(productId, categoryId);

            expect(result).to.be.equal(productCategory);
        });
    });

    describe('addProductCategory()', () => {
        it('should throw error if product is null', () => {
            const productService = new ProductService();

            expect(productService.addProductCategory).throw();
        });

        it('should get already product category if exist', done => {
            const categoryId = 'category id';
            const product = {
                categories: [{
                    id: 'existing product category',
                    categoryId
                }]
            };
            const productService = new ProductService();

            productService.addProductCategory(product, categoryId).then(result => {
                expect(result).to.equal(product.categories[0]);
                done();
            });
        });

        it('should throw error if category is not found', () => {
            const categoryId = 'not found category id';
            const product = {};
            const categoryRepository = { findById() { } };
            simple.mock(categoryRepository, 'findById').resolveWith(null);
            const productService = new ProductService(null, categoryRepository);

            expect(() => productService.addProductCategory(product, categoryId)).throw();
        });

        it('should throw error if category is deleted', () => {
            const categoryId = 'deleted category id';
            const product = {};
            const categoryRepository = { findById() { } };
            simple.mock(categoryRepository, 'findById').resolveWith({ deleted: true });
            const productService = new ProductService(null, categoryRepository);

            expect(() => productService.addProductCategory(product, categoryId)).throw();
        });

        it('should add product category', async () => {
            const categoryId = 'category id';
            const displayOrder = 2;
            const isFeature = true;
            const product = { categories: [], save() { } };
            simple.mock(product, 'save').resolveWith(product);
            const categoryRepository = { findById() { } };
            simple.mock(categoryRepository, 'findById').resolveWith({ _id: categoryId });
            const productService = new ProductService(null, categoryRepository);

            const productCategory = await productService.addProductCategory(product, categoryId, displayOrder, isFeature);

            expect(productCategory).to.have.property('categoryId', categoryId);
            expect(productCategory).to.have.property('displayOrder', displayOrder);
            expect(productCategory).to.have.property('feature', isFeature);
            expect(productCategory).to.have.property('show', true);
        });
    });

    describe('deleteProductCategory()', () => {
        it('should throw error if product is null', () => {
            const productService = new ProductService();

            expect(productService.deleteProductCategory).throw();
        });

        it('should throw error if category id is null', () => {
            const product = {};
            const productService = new ProductService();

            expect(() => productService.deleteProductCategory(product)).throw();
        });

        it('should delete all product categories', async () => {
            const categoryId = 'category id';
            const product = {
                categories: [
                    { categoryId },
                    { categoryId }
                ],
                save() { }
            };
            simple.mock(product, 'save').resolveWith(product);
            const productService = new ProductService();

            await productService.deleteProductCategory(product, categoryId);

            expect(product.categories).to.have.length(0);
        });
    });

    describe('updateProductCategory()', () => {
        it('should throw error if product is null', () => {
            const productService = new ProductService();

            expect(productService.updateProductCategory).throw();
        });

        it('should throw error if product is null', () => {
            const product = {};
            const productService = new ProductService();

            expect(() => productService.updateProductCategory(product)).throw();
        });

        it('should null if product category is not found', async () => {
            const product = { categories: [] };
            const categoryId = 'not found product category';
            const productService = new ProductService();

            const result = await productService.updateProductCategory(product, categoryId);

            expect(result).to.be.null;
        });

        it('should update product category', async () => {
            const categoryId = 'category id';
            const product = { categories: [{ categoryId, displayOrder: 0, feature: false, show: false }], save() { } };
            simple.mock(product, 'save').resolveWith(product);
            const productService = new ProductService();

            const result = await productService.updateProductCategory(product, categoryId, 1, true, true);

            expect(result).to.have.property('categoryId', categoryId);
            expect(result).to.have.property('displayOrder', 1);
            expect(result).to.have.property('feature', true);
            expect(result).to.have.property('show', true);
        });
    });

    describe('getProductInCategory()', () => {
        it('should throw error if category id is null', done => {
            const productService = new ProductService();

            productService.getProductsInCategory().catch(error => {
                expect(error).to.not.be.null;
                done();
            });
        });

        it('should throw error if category is not found', done => {
            const categoryId = 'not found category';
            const categoryRepository = { findById() { } };
            simple.mock(categoryRepository, 'findById').resolveWith(null);
            const productService = new ProductService(null, categoryRepository);

            productService.getProductsInCategory(categoryId).catch(error => {
                expect(error).to.not.be.null;
                done();
            });
        });

        it('should throw error if category is deleted', done => {
            const categoryId = 'deleted category';
            const category = { deleted: true };
            const categoryRepository = { findById() { } };
            simple.mock(categoryRepository, 'findById').resolveWith(category);
            const productService = new ProductService(null, categoryRepository);

            productService.getProductsInCategory(categoryId).catch(error => {
                expect(error).to.not.be.null;
                done();
            });
        });

        it('should get products in category', done => {
            const categoryId = 'category id';
            const category = { deleted: false };
            const categoryRepository = { findById() { } };
            const products = [{}, {}];
            simple.mock(categoryRepository, 'findById').resolveWith(category);
            const productRepository = { find() { } };
            simple.mock(productRepository, 'find').resolveWith(products);
            const productService = new ProductService(productRepository, categoryRepository);
            const showHidden = true;

            productService.getProductsInCategory(categoryId, showHidden).then(result => {
                expect(result).to.deep.members(products);
                expect(productRepository.find.calls[0].args).to.deep.include({
                    deleted: false,
                    categories: {
                        $elemMatch: {
                            categoryId
                        }
                    }
                });
                done();
            });
        });

        it('should exclude not shown products', done => {
            const categoryId = 'category id';
            const category = { deleted: false };
            const categoryRepository = { findById() { } };
            const products = [{}, {}];
            simple.mock(categoryRepository, 'findById').resolveWith(category);
            const productRepository = { find() { } };
            simple.mock(productRepository, 'find').resolveWith(products);
            const productService = new ProductService(productRepository, categoryRepository);

            productService.getProductsInCategory(categoryId).then(result => {
                expect(result).to.deep.members(products);
                expect(productRepository.find.calls[0].args).to.deep.include({
                    deleted: false,
                    categories: {
                        $elemMatch: {
                            categoryId
                        }
                    },
                    show: true
                });
                done();
            });
        });
    });

    describe('getProductByGroupId()', () => {
        it('should throw error if group id is null', () => {
            const productService = new ProductService();

            expect(productService.getProductsByGroupId).throw();
        });

        it('should get products by group id', async () => {
            const groupId = 'group id';
            const productsInGroup = [{ group: groupId }, { group: groupId }];
            const repository = { find() { } };
            simple.mock(repository, 'find').resolveWith(productsInGroup);
            const productService = new ProductService(repository);

            const products = await productService.getProductsByGroupId(groupId);

            expect(products).to.equal(productsInGroup);
            expect(repository.find.calls[0].args).to.deep.include({ deleted: false, show: true, group: groupId });
        });

        it('should include not shown products', async () => {
            const showHidden = true;
            const groupId = 'group id';
            const productsInGroup = [];
            const repository = { find() { } };
            simple.mock(repository, 'find').resolveWith(productsInGroup);
            const productService = new ProductService(repository);

            const products = await productService.getProductsByGroupId(groupId, showHidden);

            expect(repository.find.calls[0].args).to.deep.include({ deleted: false, group: groupId });
        });
    });

    describe('addProductToGroup()', () => {
        it('should throw error if product id is null', () => {
            const productService = new ProductService();

            expect(productService.addProductToGroup).throw();
        });

        it('should throw error if group id is null', () => {
            const productId = 'product id';
            const productService = new ProductService();

            expect(() => productService.addProductToGroup(productId)).throw();
        });

        it('should reject error if product is not found', done => {
            const productId = 'product id';
            const groupId = 'group id';
            const repository = { findById() { } };
            simple.mock(repository, 'findById').resolveWith(null);
            const productService = new ProductService(repository);

            productService.addProductToGroup(productId, groupId).catch(error => {
                expect(error).to.not.be.null;
                expect(repository.findById.calls[0].args).to.deep.include(productId);
                done();
            });
        });

        it('should reject error if group is not found', done => {
            const productId = 'product id';
            const product = { id: productId };
            const groupId = 'group id';
            const repository = { findById() { } };
            simple.mock(repository, 'findById')
                .resolveWith(product)
                .resolveWith(null);
            const productService = new ProductService(repository);

            productService.addProductToGroup(productId, groupId).catch(error => {
                expect(error).to.not.be.null;
                expect(repository.findById.callCount).to.equal(2);
                done();
            });
        });

        it('should reject error if group is invalid', done => {
            const productId = 'product id';
            const product = { id: productId };
            const groupId = 'group id';
            const group = { id: groupId, type: SINGLE };
            const repository = { findById() { } };
            simple.mock(repository, 'findById')
                .resolveWith(product)
                .resolveWith(group);
            const productService = new ProductService(repository);

            productService.addProductToGroup(productId, groupId).catch(error => {
                expect(error).to.not.be.null;
                done();
            });
        });

        it('should add product to group', done => {
            const productId = 'product id';
            const product = { id: productId, save() { } };
            const groupId = 'group id';
            const group = { _id: groupId, type: GROUP };
            const repository = { findById() { } };
            simple.mock(repository, 'findById')
                .resolveWith(product)
                .resolveWith(group);
            simple.mock(product, 'save').resolveWith(product);
            const productService = new ProductService(repository);

            productService.addProductToGroup(productId, groupId).then(result => {
                expect(result).to.equal(product);
                expect(result.group).to.equal(groupId);
                done();
            });
        });
    });
});