const mongoose = require('mongoose');

const productCategorySchema = new mongoose.Schema({
    categoryId: {
        type: String,
        required: [true, 'Category id is required']
    },
    displayOrder: {
        type: Number,
        required: [true, 'Display order is required'],
        default: 1
    },
    show: {
        type: Boolean,
        required: [true, 'Show is required'],
        default: true
    },
    feature: {
        type: Boolean,
        required: [true, 'Show is required'],
        default: false
    }
});

module.exports = productCategorySchema;