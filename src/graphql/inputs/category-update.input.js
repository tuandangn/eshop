const { GraphQLInputObjectType, GraphQLString, GraphQLNonNull, GraphQLInt, GraphQLBoolean, GraphQLID } = require('graphql');
const CategoryTypeEnum = require('../enums/category-type.enum');

const CategoryUpdateInputType = new GraphQLInputObjectType({
    name: 'CategoryUpdateInput',
    description: 'Category Update Input',
    fields: () => ({
        name: {
            type: GraphQLString,
            description: 'Name'
        },
        type: {
            type: CategoryTypeEnum,
            description: 'Type'
        },
        customPagination: {
            type: GraphQLBoolean,
            description: 'Custom pagination'
        },
        defaultPageSize: {
            type: GraphQLInt,
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
            type: GraphQLInt,
            description: 'Display order'
        },
        show: {
            type:GraphQLBoolean,
            description: 'Show'
        },
        parent: {
            type: GraphQLID,
            description: 'Parent category'
        }
    })
});

module.exports = CategoryUpdateInputType;