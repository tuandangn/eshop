const queryResolver = () => ({
    Query: {
        categories: () => ({}),
        products: () => ({})
    }
});

module.exports = queryResolver;