const { GraphQLEnumType } = require('graphql');
const { NEWS, PRODUCTS } = require('../../core/contants/category-type.const');

const CategoryTypeEnum = new GraphQLEnumType({
    name: 'CategoryType',
    description: 'Category type',
    values: {
        NEWS: { value: NEWS },
        PRODUCTS: { value: PRODUCTS }
    }
});

module.exports = CategoryTypeEnum;