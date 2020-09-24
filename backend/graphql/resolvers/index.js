const userResolvers = require('./user')
const timezoneResolvers = require('./timezone')

module.exports = {
  ...userResolvers,
  ...timezoneResolvers
}