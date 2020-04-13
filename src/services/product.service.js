const { toAscii } = require('../common/helpers/string.helper');
const { ALL, FEATURE, NON_FEATURE } = require('../core/contants/product-category-type.const');
const MessageService = require('./message.service');
const { forkJoin } = require('rxjs');
const { map } = require('rxjs/operators');
const { SINGLE, GROUP } = require('../core/contants/product-type.const');

const messageService = new MessageService();

class ProductService {
    constructor(repository, categoryRepository) {
        this.repository = repository;
        this.categoryRepository = categoryRepository;
    }

    async getProductById(id, showHidden = false) {
        if (id == null)
            throw new Error(messageService.propertyNull('Id'));

        const product$ = id => this.repository.findById(id);
        const product = await product$(id);

        if (!product || product.deleted)
            return null;

        if (!showHidden && !product.show)
            return null;

        return product;
    }

    createProduct(product) {
        if (product == null)
            throw new Error(messageService.propertyNull('Product'));

        const createProduct$ = product => this.repository.create(product);
        return createProduct$(product);
    }

    async updateProduct(product) {
        if (product == null)
            throw new Error(messageService.propertyNull('Product'));

        const entity = await this.repository.findById(product._id);
        if (entity == null || entity.deleted)
            throw new Error('Product is not found');

        const updateProduct$ = product => this.repository.update(product);
        return updateProduct$(product);
    }

    deleteProduct(product) {
        if (product == null)
            throw new Error(messageService.propertyNull('Product'));

        const deleteProduct$ = product => {
            product.deleted = true;
            return product.save();
        };

        return deleteProduct$(product).then(() => null);
    }

    getProductCount(showHidden = false) {
        const productCount$ = showHidden => {
            const countProps = { deleted: false };
            if (!showHidden) countProps.show = true;

            return this.repository.count(countProps);
        };

        return productCount$(showHidden);
    }

    getAllProducts(showHidden = false) {
        const products$ = showHidden => {
            const findProps = { deleted: false };
            if (!showHidden) findProps.show = true;

            return this.repository.find(findProps);
        };

        return products$(showHidden);
    }

    async getProductsByName(name, showHidden = false) {
        if (name == null)
            throw new Error(messageService.propertyNull('Name'));

        const products$ = showHidden => {
            const findProps = { deleted: false };
            if (!showHidden) findProps.show = true;

            return this.repository.find(findProps);
        };

        const asciiFindName = toAscii(name.normalize());
        const products = await products$(showHidden);
        const result = products.filter(product => {
            const catName = product.name.normalize();
            const asciiCatName = toAscii(catName);

            return asciiCatName.includes(asciiFindName);
        });

        return result;
    }

    getCategoriesByProduct(product, type = ALL, showHidden = false, showHiddenCategories = false) {
        if (product == null)
            throw new Error(messageService.propertyNull('Product'));

        const category$ = id => this.categoryRepository.findById(id);
        const categoriesByIds$ = (ids, showHidden) => forkJoin(ids.map(id => category$(id))).pipe(
            map(categories => categories.filter(category => !category.deleted && (showHidden || category.show)))
        ).toPromise();

        const categoryIds = product.categories
            .filter(pc => showHidden || pc.show)
            .filter(pc => type == FEATURE ? pc.feature : type == NON_FEATURE ? !pc.feature : true)
            .sort((item1, item2) => item1.displayOrder - item2.displayOrder)
            .map(pc => pc.categoryId);

        if (categoryIds.length == 0) return Promise.resolve([]);

        const categories$ = categoriesByIds$(categoryIds, showHiddenCategories);

        return categories$;
    }

    getProductCategory(productId, categoryId) {
        if (productId == null)
            throw new Error('Product id must be not null');
        if (categoryId == null)
            throw new Error('Category id must be not null');

        const product$ = id => this.repository.findById(id);

        return product$(productId).then(product => {
            if (product == null)
                return null;

            return product.categories.find(pc => pc.categoryId == categoryId);
        });
    }

    addProductCategory(product, categoryId, displayOrder, isFeature) {
        if (product == null)
            throw new Error(messageService.propertyNull('Product'));

        const exist = product.categories.find(pc => pc.categoryId == categoryId);
        if (exist) return Promise.resolve(exist);

        const category = this.categoryRepository.findById(categoryId);
        if (category == null || category.deleted)
            throw new Error(messageService.notFound('Category'));

        product.categories.push({ categoryId, displayOrder, feature: isFeature, show: true });
        return product.save().then(() =>
            product.categories.find(pc => pc.categoryId === categoryId));
    }

    deleteProductCategory(product, categoryId) {
        if (product == null)
            throw new Error(messageService.propertyNull('Product'));

        product.categories = product.categories.filter(pc => pc.categoryId != categoryId);
        return product.save().then(() => null);
    }

    updateProductCategory(product, categoryId, displayOrder, isFeature, show) {
        if (product == null)
            throw new Error(messageService.propertyNull('Product'));
        if (categoryId == null)
            throw new Error(messageService.propertyNull('Category id'));

        const productCategory = product.categories.find(pc => pc.categoryId == categoryId);
        if (productCategory == null)
            return Promise.resolve(null);

        productCategory.displayOrder = Number(displayOrder);
        productCategory.feature = !!isFeature;
        productCategory.show = !!show;

        return product.save().then(() => productCategory);
    }

    async getProductsInCategory(categoryId, showHidden = false) {
        if (categoryId == null)
            throw new Error(messageService.propertyNull('Category id'));

        const category = await this.categoryRepository.findById(categoryId);
        if (category == null || category.deleted)
            return Promise.reject(messageService.notFound('Category'));

        const products$ = (categoryId, showHidden) => {
            const findProps = {
                deleted: false,
                categories: {
                    $elemMatch: {
                        categoryId
                    }
                }
            };
            if (!showHidden) findProps.show = true;
            return this.repository.find(findProps);
        };

        return products$(categoryId, showHidden);
    }

    getProductsByGroupId(groupId, showHidden = false) {
        if (groupId == null)
            throw new Error('Group id must be not null');

        const productsInGroup$ = (groupId, showHidden) => {
            const findProps = {
                deleted: false,
                group: groupId
            };
            if (!showHidden) findProps.show = true;
            return this.repository.find(findProps);
        };

        return productsInGroup$(groupId, showHidden);
    }

    addProductToGroup(productId, groupId) {
        if (productId == null)
            throw new Error('Product id must be not null');
        if (groupId == null)
            throw new Error('Group id must be not null');

        const product$ = id => this.repository.findById(id);

        return Promise.all([
            product$(productId),
            product$(groupId)
        ]).then(([product, group]) => {
            if (product == null)
                throw new Error('Product is not found');
            if (group == null)
                throw new Error('Group is not found');
            if (group.type !== GROUP)
                throw new Error('Group is invalid');
            product.group = group._id;
            return product.save();
        });
    }
}


module.exports = ProductService;