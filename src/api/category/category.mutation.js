const { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLBoolean } = require('graphql');
const CategoryType = require('../../graphql/types/category');
const CategoryInputType = require('../../graphql/inputs/category.input');
const CategoryUpdateInputType = require('../../graphql/inputs/category-update.input');
const { getCategoryService } = require('../../common/service.factory');

const categoryService = getCategoryService();

const CategoryMutationType = new GraphQLObjectType({
    name: 'CategoryMutation',
    description: 'Category Mutation',
    fields: () => ({
        create: {
            type: GraphQLNonNull(CategoryType),
            description: 'Create category',
            args: {
                category: {
                    type: GraphQLNonNull(CategoryInputType),
                    description: 'Creating category'
                }
            },
            resolve: (_, { category }) => categoryService.createCategory(category)
        },
        delete: {
            type: GraphQLNonNull(GraphQLBoolean),
            description: 'Delete category',
            args: {
                id: {
                    type: GraphQLNonNull(GraphQLID),
                    description: 'Deleting category id'
                }
            },
            resolve: (_, { id }) => categoryService.getCategoryById(id, true).then(category => categoryService.deleteCategory(category))
        },
        update: {
            type: GraphQLNonNull(CategoryType),
            description: 'Update category',
            args: {
                id: {
                    type: GraphQLNonNull(GraphQLID),
                    description: 'Updating category id'
                },
                data: {
                    type: GraphQLNonNull(CategoryUpdateInputType),
                    description: 'Updating category data'
                }
            },
            resolve: (_, { id, data }) => categoryService.getCategoryById(id, true).then(category => {
                if (category != null) {
                    Object.assign(category, data);
                    return categoryService.updateCategory(category);
                }
            })
        }
    })
});

module.exports = CategoryMutationType;