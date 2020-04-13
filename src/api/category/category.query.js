const { GraphQLObjectType, GraphQLList, GraphQLString, GraphQLBoolean, GraphQLNonNull, GraphQLID } = require('graphql');
const CategoryType = require('../../graphql/types/category');
const { getCategoryService } = require('../../common/service.factory');

const categoryService = getCategoryService();

const CategoryQueryType = new GraphQLObjectType({
    name: 'CategoryQuery',
    description: 'Category Query',

    fields: () => ({
        all: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(CategoryType))),
            args: {
                showHidden: {
                    type: GraphQLBoolean,
                    description: 'Show hidden categories',
                    defaultValue: false
                }
            },
            description: 'All of categories',
            resolve: (_, args, context, info) => {
                return categoryService.getAllCategories(args.showHidden)
            }
        },
        one: {
            type: CategoryType,
            description: 'One category',
            args: {
                id: {
                    type: GraphQLNonNull(GraphQLID),
                    description: 'Category id'
                },
                showHidden: {
                    type: GraphQLBoolean,
                    description: 'Show hidden category',
                    defaultValue: false
                }
            },
            resolve: (_, { id, showHidden }) => categoryService.getCategoryById(id, showHidden)
        },
        search: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(CategoryType))),
            description: 'Search categories',
            args: {
                name: {
                    type: GraphQLNonNull(GraphQLString),
                    description: 'Search category name'
                },
                showHidden: {
                    type: GraphQLBoolean,
                    description: 'Show hidden categories',
                    defaultValue: false
                }
            },
            resolve: (_, { name, showHidden }) => categoryService.getCategoriesByName(name, showHidden)
        }
    })
});

module.exports = CategoryQueryType;