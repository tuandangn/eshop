const promiseModelAdapter = require('./promise-model.adapter');
const { category, product } = require('../symbols/repository.symbol');
const CategoryModel = require('../domain/models/category.model');
const ProductModel = require('../domain/models/product.model');

function repository(Model) {
    const PromisifyModel = promiseModelAdapter(Model);

    return {
        find: PromisifyModel.find,
        findById: PromisifyModel.findById,
        create: PromisifyModel.create,
        update(model) {
            return model.save();
        },
        delete: PromisifyModel.deleteOne,
        count: PromisifyModel.count
    };
}

module.exports = {
    [category]: repository(CategoryModel),
    [product]: repository(ProductModel)
};