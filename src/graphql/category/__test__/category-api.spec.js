const { ApolloServer, gql } = require('apollo-server');
const { createTestClient } = require('apollo-server-testing');
const categoryResolver = require('../category.resolver');
const { NEWS, PRODUCTS } = require('../../../core/contants/category-type.const');
const { GROUP, SINGLE } = require('../../../core/contants/product-type.const');

const typeDefs = require('../typeDefs');
const RootQuery = gql`
    type Query{
        category: CategoryQuery
    }
`;
const dependencies = [
    require('../../product/typeDefs/IProduct'),
    require('../../product/typeDefs/Product'),
    require('../../product/typeDefs/ProductType'),
    require('../../common/typeDefs/IPageableEntity'),
    require('../../product/typeDefs/ProductCategoryType'),
];

const defaultResolver = {
    IProduct: {
        __resolveType: (obj) => "Product"

    },
    IPageableEntity: {
        __resolveType: (obj) => obj.price ? "Product" : "Category"
    }
}

const categoryFields = `
    id, name, type, customPagination, defaultPageSize,
    pageSizes, description, displayOrder, show
`;

describe('Category API', () => {
    describe('Category', () => {

        it('should query parent category', async () => {
            const allCategories = [
                { id: 1, name: 'category 1', type: NEWS, customPagination: false, defaultPageSize: 12, pageSizes: null, description: 'desc', displayOrder: 1, show: true, parent: undefined },
                { id: 2, name: 'category 2', type: PRODUCTS, customPagination: true, defaultPageSize: 10, pageSizes: '1,2,3,4', description: 'abcdef', displayOrder: 3, show: true, parent: 1 },
            ];
            const showHidden = false;
            const categoryService = {
                getAllCategories: jest.fn().mockResolvedValue(allCategories),
                getCategoryById: jest.fn().mockResolvedValue(allCategories[0])
            };
            const resolver = categoryResolver(categoryService);
            const server = new ApolloServer({
                typeDefs: [...typeDefs, ...dependencies, RootQuery],
                resolvers: [defaultResolver, resolver],
                mocks: true,
                mockEntireSchema: false
            });
            const { query } = createTestClient(server);

            const result = await query({
                query: gql`
                    query allCategories{
                        category{ 
                            all(showHidden: ${showHidden}){
                                parent{
                                    id, name
                                }
                            }
                        }
                }`
            });

            expect(result.errors).toBeFalsy();
            expect(result).toMatchSnapshot();
            expect(categoryService.getCategoryById).toHaveBeenCalledTimes(1);
            expect(categoryService.getCategoryById).toHaveBeenCalledWith(1, showHidden);
        });

        it('should query products by category', async () => {
            const category = {
                id: 1, name: 'category 1', type: NEWS,
                customPagination: false, defaultPageSize: 12, pageSizes: null,
                description: 'desc', displayOrder: 1, show: true, parent: undefined
            };
            const products = [{ id: "1", name: 'product 1', shortDesc: 'short', fullDesc: undefined, cost: undefined, oldPrice: undefined, type: SINGLE, individualVisibility: false, price: 0, displayOrder: 1, show: true }];
            const showHidden = false;
            const productShowHidden = true;
            const categoryService = {
                getAllCategories: jest.fn().mockResolvedValue([category]),
            };
            const productService = {
                getProductsInCategory: jest.fn().mockResolvedValue(products)
            };
            const resolver = categoryResolver(categoryService, productService);
            const server = new ApolloServer({
                typeDefs: [...typeDefs, ...dependencies, RootQuery],
                resolvers: [resolver, defaultResolver],
                mocks: true,
                mockEntireSchema: false
            });
            const { query } = createTestClient(server);

            const result = await query({
                query: gql`
                    query allCategories{
                        category{ 
                            all(showHidden: ${showHidden}){
                                id, name,
                                products(showHidden: ${productShowHidden}){
                                    id, name
                                }
                            }
                        }
                }`
            });

            expect(result.errors).toBeFalsy();
            expect(result).toMatchSnapshot();
            expect(productService.getProductsInCategory).toHaveBeenCalledWith(category.id, productShowHidden);
        });
    });

    describe('Query', () => {
        describe('all', () => {
            it('should query all categories with valid fields', async () => {
                const allCategories = [
                    { id: 1, name: 'category 1', type: NEWS, customPagination: false, defaultPageSize: 12, pageSizes: null, description: 'desc', displayOrder: 1, show: true, parent: undefined },
                    { id: 2, name: 'category 2', type: PRODUCTS, customPagination: true, defaultPageSize: 10, pageSizes: '1,2,3,4', description: 'abcdef', displayOrder: 3, show: false, parent: 1 },
                ];
                const showHidden = true;
                const categoryService = {
                    getAllCategories: jest.fn().mockResolvedValue(allCategories)
                };
                const resolver = categoryResolver(categoryService);
                const server = new ApolloServer({
                    typeDefs: [...typeDefs, ...dependencies, RootQuery],
                    resolvers: [resolver, defaultResolver],
                    mocks: true,
                    mockEntireSchema: false
                });
                const { query } = createTestClient(server);

                const result = await query({
                    query: gql`
                        query allCategories{
                            category{ 
                                all(showHidden: ${showHidden}){
                                    ${categoryFields}
                                }
                            }
                    }`
                });

                expect(result.errors).toBeFalsy();
                expect(result).toMatchSnapshot();
                expect(categoryService.getAllCategories).toHaveBeenCalledWith(showHidden);
            });
        });

        describe('one()', () => {
            it('should query one category', async () => {
                const category = {
                    id: 1, name: 'category 1', type: NEWS,
                    customPagination: false, defaultPageSize: 12, pageSizes: null,
                    description: 'desc', displayOrder: 1, show: true, parent: undefined
                };
                const id = "category id";
                const showHidden = false;
                const categoryService = {
                    getCategoryById: jest.fn().mockResolvedValue(category)
                };
                const resolver = categoryResolver(categoryService);
                const server = new ApolloServer({
                    typeDefs: [...typeDefs, ...dependencies, RootQuery],
                    resolvers: [defaultResolver, resolver],
                    mocks: true,
                    mockEntireSchema: false
                });
                const { query } = createTestClient(server);

                const result = await query({
                    query: gql`{
                        category{
                            one(id: "${id}", showHidden: ${showHidden}){
                                ${categoryFields}
                            }
                        }
                    }`
                });

                expect(result.errors).toBeFalsy();
                expect(result).toMatchSnapshot();
                expect(categoryService.getCategoryById).toHaveBeenCalledWith(id, showHidden);
            });
        });

        describe('search()', () => {
            it('should query search categories', async () => {
                const keywords = 'category';
                const showHidden = false;
                const categories = [{
                    id: 1, name: 'category 1', type: NEWS,
                    customPagination: false, defaultPageSize: 12, pageSizes: null,
                    description: 'desc', displayOrder: 1, show: true, parent: undefined
                }, {
                    id: 2, name: 'category 2', type: NEWS,
                    customPagination: false, defaultPageSize: 12, pageSizes: null,
                    description: 'desc', displayOrder: 1, show: true, parent: undefined
                }, {
                    id: 3, name: 'category 3', type: PRODUCTS,
                    customPagination: true, defaultPageSize: 9, pageSizes: '12, 9, 6, 4',
                    description: 'description', displayOrder: 5, show: true, parent: 1
                }];
                const categoryService = {
                    getCategoriesByName: jest.fn().mockResolvedValue(categories)
                };
                const resolver = categoryResolver(categoryService);
                const server = new ApolloServer({
                    typeDefs: [...typeDefs, ...dependencies, RootQuery],
                    resolvers: [defaultResolver, resolver],
                    mocks: true,
                    mockEntireSchema: false
                });
                const { query } = createTestClient(server);

                const result = await query({
                    query: gql`{
                        category{
                            search(name: "${keywords}", showHidden: ${showHidden}){
                                ${categoryFields}
                            }
                        }
                    }`
                });

                expect(result.errors).toBeFalsy();
                expect(result).toMatchSnapshot();
                expect(categoryService.getCategoriesByName).toHaveBeenCalledWith(keywords, showHidden);
            });
        });
    });
});