const userResolver = require('./User')
const problemResolver = require('./Problem')

const rootResolver = {
    ...userResolver,
    ...problemResolver
}

module.exports = rootResolver