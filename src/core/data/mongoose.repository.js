const promiseModelAdapter = require('./promise-model.adapter');
const { category, product } = require('../symbols/repository.symbol');
const CategoryModel = require('../domain/models/category.model');
const ProductModel = require('../domain/models/product.model');
const QueryBuilder = require('./query-builder');

function repository(Model) {
    const PromisifyModel = promiseModelAdapter(Model);

    const repository = {
        find: PromisifyModel.find,
        findById: PromisifyModel.findById,
        create: PromisifyModel.create,
        update(model) {
            return model.save();
        },
        delete: PromisifyModel.deleteOne,
        count: PromisifyModel.count
    };

    Object.defineProperty(repository.find, 'builder', {
        get() {
            return new QueryBuilder(Model.find.bind(Model));
        }
    });
    Object.defineProperty(repository.count, 'builder', {
        get() {
            return new QueryBuilder(Model.countDocuments.bind(Model));
        }
    });

    return repository;
}

module.exports = {
    [category]: repository(CategoryModel),
    [product]: repository(ProductModel)
};