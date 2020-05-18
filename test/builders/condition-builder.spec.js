const ConditionBuilder = require('../../src/core/data/condition-builder');
const expect = require('chai').expect;
const simple = require('simple-mock');

describe('ConditionBuilder', () => {
    it('should throw error if target query if null', () => {
        expect(() => new ConditionBuilder()).throw();
    });

    it('should add condition field', () => {
        const queryBuilder = new ConditionBuilder(() => { });
        const name = 'property';
        const value = 1;

        queryBuilder.con(name, value);

        expect(queryBuilder._condition[name]).to.eq(value);
    });

    it('should add condition field if condition false', () => {
        const queryBuilder = new ConditionBuilder(() => { });
        const name = 'property';
        const value = 1;
        const condition = false;

        queryBuilder.conIfFalse(name, condition, value);

        expect(queryBuilder._condition[name]).to.eq(value);
    });

    it('should not add condition field if condition true', () => {
        const queryBuilder = new ConditionBuilder(() => { });
        const name = 'property';
        const value = 1;
        const condition = true;

        queryBuilder.conIfFalse(name, condition, value);

        expect(queryBuilder._condition[name]).to.be.undefined;
    });

    it('should add element match condition field', () => {
        const queryBuilder = new ConditionBuilder(() => { });
        const name = 'property';
        const element = { id: 'id' };

        queryBuilder.elementMatch(name, element);

        expect(queryBuilder._condition[name]).to.deep.eq({ $elemMatch: element });
    });

    it('should change entire condition', () => {
        const queryBuilder = new ConditionBuilder(() => { });
        const condition = { id: 'id', prop: 'prop' };

        queryBuilder.condition(condition);

        expect(queryBuilder._condition).to.eq(condition);
    });

    it('should build with condition', () => {
        const target = {
            query: () => { }
        }
        simple.mock(target, 'query');
        const queryBuilder = new ConditionBuilder(target.query);
        queryBuilder.con('a', 1);
        queryBuilder.conIfFalse('b', false, 2);

        queryBuilder.build();

        expect(target.query.calls[0].args).to.deep.include({ a: 1, b: 2 });
    });

    it('should change query', () => {
        const query = () => {};
        const queryBuilder = new ConditionBuilder(() => {});

        queryBuilder.switchTo(query);

        expect(queryBuilder.query).to.eq(query);
    });
});