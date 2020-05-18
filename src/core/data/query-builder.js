const ConditionBuilder = require('./condition-builder');

class QueryBuilder extends ConditionBuilder {
    constructor(query) {
        super(query);
    }

    page(pageNumber, pageSize) {
        this._page = { pageNumber, pageSize };
        return this;
    }

    sort(sort) {
        this._sort = sort;
        return this;
    }

    select(select) {
        this._select = select;
    }

    lean(lean) {
        this._lean = lean;
        return this;
    }

    build() {
        let query = super.build();
        if (this._select) {
            query = query.select(this._select);
        }
        if (this._sort) {
            query = query.sort(this._sort);
        }
        if (this._page) {
            const { pageNumber, pageSize } = this._page;
            query = query
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize);
        }
        if (typeof this._lean !== 'undefined') {
            query = query.lean(this._lean);
        }
        return query;
    }
}

module.exports = QueryBuilder;