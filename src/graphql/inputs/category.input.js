const { GraphQLInputObjectType, GraphQLString, GraphQLNonNull, GraphQLInt, GraphQLBoolean, GraphQLID } = require('graphql');
const CategoryTypeEnum = require('../enums/category-type.enum');

const DEFAULT_CUSTOM_PAGINATION = true;
const DEFAULT_PAGESIZE = 12;
const DEFAULT_DISPLAY_ORDER = 1;

const CategoryInputType = new GraphQLInputObjectType({
    name: 'CategoryInput',
    description: 'Category Input',
    fields: () => ({
        name: {
            type: GraphQLNonNull(GraphQLString),
            description: 'Name'
        },
        type: {
            type: GraphQLNonNull(CategoryTypeEnum),
            description: 'Type'
        },
        customPagination: {
            type: GraphQLBoolean,
            description: 'Custom pagination',
            defaultValue: DEFAULT_CUSTOM_PAGINATION
        },
        defaultPageSize: {
            type: GraphQLInt,
            description: 'Default page size',
            defaultValue: DEFAULT_PAGESIZE
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
            description: 'Display order',
            defaultValue: DEFAULT_DISPLAY_ORDER
        },
        show: {
            type: GraphQLBoolean,
            description: 'Show',
            defaultValue: true
        },
        parent: {
            type: GraphQLID,
            description: 'Parent category'
        }
    })
});

module.exports = CategoryInputType;