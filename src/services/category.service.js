const { toAscii } = require('../common/helpers/string.helper');
const { from, forkJoin } = require('rxjs');
const { switchMap, toArray, map } = require('rxjs/operators');
const MessageService = require('../services/message.service');
const ConditionBuilder = require('../core/data/condition-builder');

const messageService = new MessageService();

class CategoryService {
    constructor(repository) {
        this.repository = repository;
    }

    async getCategoryById(id, showHidden = false) {
        if (id == null)
            throw new Error('Id must be not null');

        const category$ = id => this.repository.findById(id);
        const category = await category$(id);

        if (!category || category.deleted)
            return null;

        if (!showHidden && !category.show)
            return null;

        return category;
    }

    createCategory(category) {
        if (category == null)
            throw new Error('Category must be not null');

        const createCategory$ = category => this.repository.create(category);
        return createCategory$(category);
    }

    async updateCategory(category) {
        if (category == null)
            throw new Error('Category must be not null');

        const entity = await this.repository.findById(category._id);
        if (entity == null || entity.deleted)
            throw new Error('Category is not found');

        const updateCategory$ = category => this.repository.update(category);
        return updateCategory$(category);
    }

    deleteCategory(category) {
        if (category == null)
            throw new Error('Category must be not null');

        const deleteCategory$ = category => {
            category.deleted = true;
            return category.save();
        };

        return deleteCategory$(category).then(() => null);
    }

    getCategoryCount(showHidden = false) {
        const categoryCount$ = showHidden => new ConditionBuilder(this.repository.count)
            .con('deleted', false)
            .conIfFalse('show', showHidden, true)
            .build();

        return categoryCount$(showHidden);
    }

    getAllCategories(showHidden = false) {
        const categories$ = showHidden => new ConditionBuilder(this.repository.find)
            .con('deleted', false)
            .conIfFalse('show', showHidden, true)
            .build();

        return categories$(showHidden);
    }

    getCategoriesByParentId(category, showHidden = false) {
        if (category == null)
            throw new Error('Category must be not null');

        const categoriesByParent$ = (parentId, showHidden) => new ConditionBuilder(this.repository.find)
            .con('deleted', false)
            .conIfFalse('show', showHidden, true)
            .con('parent', parentId)
            .build();

        return categoriesByParent$(category._id, showHidden);
    }

    //*TODO* sort by, sort direction
    async getCategoriesByName(name, showHidden = false) {
        if (name == null)
            throw new Error('Name must be not null');

        const categories$ = showHidden => new ConditionBuilder(this.repository.find)
            .con('deleted', false)
            .conIfFalse('show', showHidden, true)
            .build();

        const asciiFindName = toAscii(name.normalize());
        const categories = await categories$(showHidden);
        const result = categories.filter(category => {
            const catName = category.name.normalize();
            const asciiCatName = toAscii(catName);

            return asciiCatName.includes(asciiFindName);
        });

        return result;
    }

    getCategoriesByIds(ids, showHidden = false) {
        if (ids == null)
            throw new Error(messageService.propertyNull('Ids'));

        const category$ = id => from(this.repository.findById(id));
        const categoriesByIds$ = (ids, showHidden) => from(ids).pipe(
            map(id => category$(id)),
            toArray(),
            switchMap(categories$ => forkJoin(categories$)),
            map(categories => categories.filter(category => !category.deleted && (showHidden || category.show)))
        ).toPromise();

        return categoriesByIds$(ids, showHidden);
    }
}


module.exports = CategoryService;