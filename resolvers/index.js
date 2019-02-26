const userResolver = require('./User')
const problemResolver = require('./Problem')
const solutionResolver = require('./Solution')
const rootResolver = {
    ...userResolver,
    ...problemResolver,
    ...solutionResolver
}

module.exports = rootResolver