const QueryBuilder = require('../../src/core/data/query-builder');
const expect = require('chai').expect;
const simple = require('simple-mock');

describe('QueryBuilder', () => {
    it('should throw error if target query if null', () => {
        expect(() => new QueryBuilder()).throw();
    });

    it('should add condition field', () => {
        const queryBuilder = new QueryBuilder(() => { });
        const name = 'property';
        const value = 1;

        queryBuilder.con(name, value);

        expect(queryBuilder._condition[name]).to.eq(value);
    });

    it('should add condition field if condition false', () => {
        const queryBuilder = new QueryBuilder(() => { });
        const name = 'property';
        const value = 1;
        const condition = false;

        queryBuilder.conIfFalse(name, condition, value);

        expect(queryBuilder._condition[name]).to.eq(value);
    });

    it('should not add condition field if condition true', () => {
        const queryBuilder = new QueryBuilder(() => { });
        const name = 'property';
        const value = 1;
        const condition = true;

        queryBuilder.conIfFalse(name, condition, value);

        expect(queryBuilder._condition[name]).to.be.undefined;
    });

    it('should add element match condition field', () => {
        const queryBuilder = new QueryBuilder(() => { });
        const name = 'property';
        const element = { id: 'id' };

        queryBuilder.elementMatch(name, element);

        expect(queryBuilder._condition[name]).to.deep.eq({ $elemMatch: element });
    });

    it('should change entire condition', () => {
        const queryBuilder = new QueryBuilder(() => { });
        const condition = { id: 'id', prop: 'prop' };

        queryBuilder.condition(condition);

        expect(queryBuilder._condition).to.eq(condition);
    });

    it('should add pagination', () => {
        const queryBuilder = new QueryBuilder(() => { });
        const page = 1;
        const size = 10;

        queryBuilder.page(page, size);

        expect(queryBuilder._page).to.deep.eq({ pageNumber: page, pageSize: size });
    });

    it('should add sort', () => {
        const queryBuilder = new QueryBuilder(() => { });
        const sort = { id: 1 };

        queryBuilder.sort(sort);

        expect(queryBuilder._sort).to.deep.eq(sort);
    });

    it('should add select', () => {
        const queryBuilder = new QueryBuilder(() => { });
        const select = 'id name';

        queryBuilder.select(select);

        expect(queryBuilder._select).to.eq(select);
    });

    it('should add lean', () => {
        const queryBuilder = new QueryBuilder(() => { });
        const lean = true;

        queryBuilder.lean(lean);

        expect(queryBuilder._lean).to.eq(lean);
    });

    it('should build with condition', () => {
        const target = {
            query: () => { }
        }
        simple.mock(target, 'query');
        const queryBuilder = new QueryBuilder(target.query);
        queryBuilder.con('a', 1);
        queryBuilder.conIfFalse('b', false, 2);

        queryBuilder.build();

        expect(target.query.calls[0].args).to.deep.include({ a: 1, b: 2 });
    });

    it('should build select if present', () => {
        const queryCondition = { select() { } };
        const queryBuilder = new QueryBuilder(() => queryCondition);
        simple.mock(queryCondition, 'select');
        const select = 'id name';

        queryBuilder.select(select);
        queryBuilder.build();

        expect(queryCondition.select.calls[0].args[0]).to.eq(select);
    });

    it('should build sort if present', () => {
        const queryCondition = { sort() { } };
        const queryBuilder = new QueryBuilder(() => queryCondition);
        simple.mock(queryCondition, 'sort');
        const sort = { id: 1, name: -1 };

        queryBuilder.sort(sort);
        queryBuilder.build();

        expect(queryCondition.sort.calls[0].args).to.deep.include(sort);
    });

    it('should build pagination if present', () => {
        const queryCondition = { skip() { return queryCondition; }, limit() { return queryCondition; } };
        const queryBuilder = new QueryBuilder(() => queryCondition);
        simple.mock(queryCondition, 'skip');
        simple.mock(queryCondition, 'limit');
        const page = 1;
        const size = 10;

        queryBuilder.page(page, size);
        queryBuilder.build();

        expect(queryCondition.skip.calls[0].args[0]).to.eq(0);
        expect(queryCondition.limit.calls[0].args[0]).to.eq(size);
    });

    it('should build lean if present', () => {
        const queryCondition = { lean() { } };
        const queryBuilder = new QueryBuilder(() => queryCondition);
        simple.mock(queryCondition, 'lean');
        const lean = false;

        queryBuilder.lean(lean);
        queryBuilder.build();

        expect(queryCondition.lean.calls[0].args[0]).to.eq(lean);
    });

    it('should change query', () => {
        const query = () => {};
        const queryBuilder = new QueryBuilder(() => {});

        queryBuilder.switchTo(query);

        expect(queryBuilder.query).to.eq(query);
    });
});