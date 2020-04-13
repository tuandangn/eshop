const expect = require('chai').expect;
const MessageService = require('../../src/services/message.service');

describe('MessageService', () => {
    const messageService = new MessageService();

    describe('propertyNull()', () => {
        it('should valid message', () => {
            const propertyName = 'Prop name';

            const message = messageService.propertyNull(propertyName);

            expect(message).to.equal('Prop name must be not null');
        });
    });

    describe('notFound()', () => {
        it('should valid message', () => {
            const name = 'Name';

            const message = messageService.notFound(name);

            expect(message).to.eql('Name is not found')
        });
    });
});