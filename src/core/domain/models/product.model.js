const mongoose = require('mongoose');
const productSchema = require('../schemas/product.schema');

const ProductModel = mongoose.model('Products', productSchema);

module.exports = ProductModel;