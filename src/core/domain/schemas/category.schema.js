const mongoose = require('mongoose');
const { NEWS, PRODUCTS } = require('../../contants/category-type.const');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        maxlength: [200, 'Name max length is 200']
    },
    type: {
        type: String,
        enum: [NEWS, PRODUCTS],
        required: [true, 'Type is required'],
        default: NEWS
    },
    customPagination: {
        type: Boolean,
        default: true
    },
    defaultPageSize: {
        type: Number,
        required: [true, 'Default page size is required'],
        min: [0, 'Default page size must greater than 0']
    },
    pageSize: {
        type: String
    },
    description: {
        type: String
    },
    displayOrder: {
        type: Number,
        required: [true, 'Display order is required'],
        default: 1
    },
    parent: {
        type: String
    },
    show: {
        type: Boolean,
        required: true,
        default: false
    },
    deleted: {
        type: Boolean,
        required: false,
        default: false
    },
    createdOn: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = categorySchema;