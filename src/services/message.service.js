class MessageService {
    propertyNull(name) {
        return `${name} must be not null`;
    }

    notFound(name){
        return `${name} is not found`;
    }
}

module.exports = MessageService;