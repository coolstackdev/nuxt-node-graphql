const Joi = require('joi');

module.exports = {

  // POST or PUT /v1/timezones
  timezone: {
    body: {
      name: Joi.string().required(),
      city: Joi.string().required(),
      differenceToGMT: Joi.string().regex(/^[-+]?[0-9]{1,2}(\.5)?$/).required(),
    },
  },
};
