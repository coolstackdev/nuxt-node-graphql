const bcrypt = require('bcryptjs')
const moment = require('moment-timezone')

const User = require('../../models/user.model')

module.exports = {
  users: async (args, req) => {
    try {
      const users = await User.find()
      const transformedUsers = users.map(user => user.transform())

      return transformedUsers
    } catch (err) {
      throw err
    }
  },
  login: async ({ email, password }) => {
    try {
      const user = await User.findOne({ email: email })
      if (!user) {
        throw new Error('User does not exist')
      }

      const isEqual = await bcrypt.compare(password, user.password)
      if (!isEqual) {
        throw new Error('Password is incorrect!')
      }

      const token = user.token()
      return {
        userId: user.id,
        token: token,
        expiresAt: moment().add(process.env.TOKEN_EXPIRATION, 'hours').unix()
      }
    } catch(err) {
      throw err
    }
  },
  createUser: async (args, req) => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email })
      
      if (existingUser) {
        throw new Error('User already exists')
      }

      const user = new User({
        email: args.userInput.email,
        password: args.userInput.password
      })

      const result = await user.save()

      return { ...result._doc, _id: result.id }
    } catch(err) {
      throw err
    }
  }
}
