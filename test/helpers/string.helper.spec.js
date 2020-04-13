const expect = require('chai').expect;
const { toAscii } = require('../../src/helpers/string.helper');

describe('StringHelper', () => {
    describe('toAscii()', () => {
        it('should convert to ascii characters', () => {
            const unicodeString = 'Đây là chuỗi có dấu';

            const result = toAscii(unicodeString);

            expect(result).to.equal('DAY LA CHUOI CO DAU');
        });
    });
});