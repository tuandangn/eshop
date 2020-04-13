const { GraphQLDirective } = require('graphql');

const ShowHiddenDirective = new GraphQLDirective({
    name: 'showHidden',
    locations: ["FIELD"],
    description: 'Show hidden',
    args: {

    }
});

module.exports = ShowHiddenDirective;