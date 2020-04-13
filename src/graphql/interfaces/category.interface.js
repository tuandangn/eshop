const { GraphQLString, GraphQLNonNull, GraphQLInt, GraphQLBoolean, GraphQLID } = require('graphql');
const { GraphQLInterfaceType } = require('graphql');
const CategoryTypeEnum = require('../enums/category-type.enum');

const ICategory = new GraphQLInterfaceType({
    name: 'ICategory',
    description: 'Category Interface',
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
        }
    })
});

module.exports = ICategory;