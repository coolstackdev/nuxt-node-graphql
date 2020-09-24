const moment = require('moment-timezone')

const Timezone = require('../../models/timezone.model')

module.exports = {
  timezones: async (args, req) => {
    try {
      const timezones = await Timezone.find()
      const transformedTimezones = timezones.map(timezone => timezone.transform())

      return transformedTimezones
    } catch (err) {
      throw err
    }
  },
  createTimezone: async (args, req) => {
    try {
      const timezone = new Timezone({
        name: args.timezoneInput.name,
        city: args.timezoneInput.city,
        differenceToGMT: args.timezoneInput.differenceToGMT
      })

      const result = await timezone.save()

      return { ...result._doc, _id: result.id }
    } catch(err) {
      throw err
    }
  }
}
