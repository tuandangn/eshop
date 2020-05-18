class ConditionBuilder {
    _condition = {};

    constructor(query) {
        if (query == null)
            throw new Error('Query must be not null');
        this.query = query;
    }

    con(name, value) {
        this._condition[name] = value;
        return this;
    }

    conIfFalse(name, condition, value) {
        if (!condition) {
            this._condition[name] = value;
        }
        return this;
    }

    elementMatch(name, element) {
        this._condition[name] = {
            $elemMatch: element
        };
        return this;
    }

    condition(condition) {
        this._condition = condition;
        return this;
    }

    build() {
        const query = this.query(this._condition);
        return query;
    }

    switchTo(query){
        this.query = query;
        return this;
    }
}

module.exports = ConditionBuilder;