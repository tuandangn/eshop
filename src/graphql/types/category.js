const { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLInt, GraphQLList, GraphQLBoolean, GraphQLID } = require('graphql');
const { getCategoryService, getProductService } = require('../../common/service.factory');
const CategoryTypeEnum = require('../enums/category-type.enum');
const ICategory = require('../interfaces/category.interface');
const IProduct = require('../interfaces/product.interface');

const categoryService = getCategoryService();
const productService = getProductService();

const CategoryType = new GraphQLObjectType({
    name: 'Category',
    description: 'Category',
    interfaces: [ICategory],
    fields: () => ({
        id: {
            type: GraphQLNonNull(GraphQLID),
            description: 'Id'
        },
        name: {
            type: GraphQLNonNull(GraphQLString),
            description: 'Name'
        },
        type: {
            type: GraphQLNonNull(CategoryTypeEnum),
            description: 'Type'
        },
        customPagination: {
            type: GraphQLNonNull(GraphQLBoolean),
            description: 'Custom pagination'
        },
        defaultPageSize: {
            type: GraphQLNonNull(GraphQLInt),
            description: 'Default page size'
        },
        pageSizes: {
            type: GraphQLString,
            description: 'Page sizes'
        },
        description: {
            type: GraphQLString,
            description: 'Description'
        },
        displayOrder: {
            type: GraphQLNonNull(GraphQLInt),
            description: 'Display order'
        },
        show: {
            type: GraphQLNonNull(GraphQLBoolean),
            description: 'Show'
        },
        parent: {
            type: CategoryType,
            description: 'Parent category',
            args: {
                showHidden: {
                    type: GraphQLBoolean,
                    description: 'Show hidden categories',
                    defaultValue: false
                }
            },
            resolve: (current, { showHidden }) =>
                current.parent ?
                    categoryService.getCategoryById(current.parent, showHidden) :
                    Promise.resolve(null)
        },
        children: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(CategoryType))),
            description: 'Children category',
            args: {
                showHidden: {
                    type: GraphQLBoolean,
                    description: 'Show hidden categories',
                    defaultValue: false
                }
            },
            resolve: (current, { showHidden }) => categoryService.getCategoriesByParentId(current, showHidden)
        },
        products: {
            //prevent circular dependency
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(IProduct))),
            description: 'Products in category',
            args: {
                showHidden: {
                    type: GraphQLBoolean,
                    description: 'Show hidden products',
                    defaultValue: false
                }
            },
            resolve: (category, { showHidden }) => productService.getProductsInCategory(category.id, showHidden)
        }
    })
});

module.exports = CategoryType;