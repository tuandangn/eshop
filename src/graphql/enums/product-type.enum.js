const { GraphQLEnumType } = require('graphql');
const { SINGLE, GROUP } = require('../../core/contants/product-type.const');

const ProductTypeEnum = new GraphQLEnumType({
    name: 'ProductType',
    description: 'Product Type',
    values: {
        SINGLE: { value: SINGLE, description: 'Single product' },
        GROUP: { value: GROUP, description: 'Group products' }
    }
});

module.exports = ProductTypeEnum;