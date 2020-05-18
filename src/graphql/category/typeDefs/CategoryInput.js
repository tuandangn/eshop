const { gql } = require('apollo-server');
const { DEFAULT_CATEGORY_CUSTOM_PAGINATION, DEFAULT_CATEGORY_PAGE_SIZE, DEFAULT_CATEGORY_SHOW, DEFAULT_CATEGORY_DISPLAY_ORDER } = require('../../../common/defaults');

const CategoryInput = gql`
    "Category Input Type"
    input CategoryInput{
        
        "Name"
        name: String!,

        "Type"
        type: CategoryType!,

        "Custom pagination"
        customPagination: Boolean = ${DEFAULT_CATEGORY_CUSTOM_PAGINATION},

        "Default page size"
        defaultPageSize: Int = ${DEFAULT_CATEGORY_PAGE_SIZE},

        "Page sizes"
        pageSizes: String,

        "Display order"
        displayOrder: Int = ${DEFAULT_CATEGORY_DISPLAY_ORDER},

        "Show"
        show: Boolean = ${DEFAULT_CATEGORY_SHOW},

        "Parent Category"
        parent: ID
    }
`;

module.exports = CategoryInput;