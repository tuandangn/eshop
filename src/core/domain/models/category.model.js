const mongoose = require('mongoose');
const categorySchema = require('../schemas/category.schema');

const CategoryModel = mongoose.model('Categories', categorySchema);

module.exports = CategoryModel;