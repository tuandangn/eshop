const { GraphQLEnumType } = require('graphql');
const { ALL, FEATURE, NON_FEATURE } = require('../../core/contants/product-category-type.const');

const ProductCategoryTypeEnum = new GraphQLEnumType({
    name: 'ProductCategoryType',
    description: 'Product Category Type',
    values: {
        ALL: { value: ALL },
        FEATURE: { value: FEATURE },
        NONFEATURE: { value: NON_FEATURE }
    }
});

module.exports = ProductCategoryTypeEnum;