const mongoose = require('mongoose');
const productCategorySchema = require('./product-category.schema');
const { SINGLE, GROUP } = require('../../contants/product-type.const');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        maxlength: [200, 'Name max length is 200']
    },
    shortDesc: {
        type: String,
        required: [true, 'Short desc is required'],
        maxlength: [1000, 'Name max length is 1000']
    },
    fullDesc: {
        type: String
    },
    type: {
        type: String,
        enum: [SINGLE, GROUP],
        required: [true, 'Type is required'],
        default: SINGLE
    },
    group: {
        type: String
    },
    individualVisibility: {
        type: Boolean,
        required: [true, 'Inidividual visibility is required'],
        default: true
    },
    cost: {
        type: Number
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price must greater than 0']
    },
    oldPrice: {
        type: Number
    },
    displayOrder: {
        type: Number,
        required: [true, 'Display order is required'],
        default: 1
    },
    categories: [{
        type: productCategorySchema
    }],
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
    updatedOn: {
        type: Date,
        required: true,
        default: Date.now
    },
    createdOn: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = productSchema;