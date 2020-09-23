const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../utils/APIError');
const User = require('./user.model');

/**
 * Timezone Schema
 * @private
 */
const timezoneSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  city: {
    type: String,
    require: true,
  },
  differenceToGMT: {
    type: Number,
    require: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

/**
 * Methods
 */
timezoneSchema.method({

  // Transform timezone data for returning to the response.
  transform() {
    const transformed = {};
    const fields = ['id', 'name', 'city', 'differenceToGMT', 'createdAt'];

    // Pick only necessary fields from User schema
    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    // Transform user object if exists
    if (this.user instanceof User) {
      transformed.user = this.user.transform();
    }

    return transformed;
  },

});

/**
 * Statics
 */
timezoneSchema.statics = {

  /**
   * Get timezone
   *
   * @param {ObjectId} id - The objectId of timezone.
   * @returns {Promise<Timezone, APIError>}
   */
  async get(id) {
    try {
      let timezone;

      // Get user with userId from team viewer
      if (mongoose.Types.ObjectId.isValid(id)) {
        timezone = await this.findById(id).populate('user');
      }
      if (timezone) {
        return timezone;
      }

      // Returns error if timezone doesn't exist
      throw new APIError({
        message: 'Timezone does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },


  /**
   * List timezones in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  async list({
    page = 1, perPage = 5, search, userId,
  }) {
    const match = omitBy({ 'user.id': userId }, isNil);
    // Configure match in order to find timezoneName or cityName by search
    if (search) {
      match.$or = [
        {
          name: RegExp(search, 'i'),
        },
        {
          city: RegExp(search, 'i'),
        },
      ];
    }

    // compose mongo aggregate to search timezones
    try {
      const aggregate = [
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user',
          },
        },
        { $unwind: '$user' },
        {
          $project: {
            _id: 0,
            id: '$_id',
            city: 1,
            name: 1,
            differenceToGMT: 1,
            createdAt: 1,
            'user.id': '$user._id',
            'user.email': 1,
            'user.name': 1,
          },
        },
        {
          $match: match,
        },
        { $sort: { startdate: 1, createdAt: 1 } },
        { $skip: parseInt(perPage) * (parseInt(page) - 1) },
      ];
      if (parseInt(perPage) > 0) {
        aggregate.push({ $limit: parseInt(perPage) });
      }

      const timezones = await this.aggregate(aggregate);

      // Get total from search options. "user" field is used instead of "user.id"
      if (match['user.id']) {
        match.user = match['user.id'];
        delete match['user.id'];
      }

      const total = await this.countDocuments(match).exec();

      return {
        timezones, total, page, totalPages: Math.ceil(total / parseInt(perPage)),
      };
    } catch (error) {
      throw error;
    }
  },

};

/**
 * @typedef Timezone
 */
module.exports = mongoose.model('Timezone', timezoneSchema);
