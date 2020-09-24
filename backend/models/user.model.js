const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const jwt = require('jsonwebtoken');

/**
* User Roles
*/
const roles = ['admin', 'manager', 'user'];

/**
 * User Schema
 * @private
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 128,
    index: true,
    trim: true,
  },
  email: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: roles,
    default: 'user',
  },
}, {
  timestamps: true,
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
userSchema.pre('save', async function save(next) {
  try {
    if (this.password === '') { next(); }

    // We don't encrypt password if password fields is not modified.
    if (!this.isModified('password')) return next();

    const rounds = 12;

    // Encrypt password using bcrypt
    const hash = await bcrypt.hash(this.password, rounds);
    this.password = hash;

    return next();
  } catch (error) {
    return next(error);
  }
});

/**
 * Methods
 */
userSchema.method({

  // Transform user data for returning to the response
  transform() {
    const transformed = {};
    const fields = ['_id', 'name', 'password', 'email', 'role', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    transformed['password'] = ''

    return transformed;
  },

  // Generate JWT Token from user id
  token() {
    const playload = {
      userId: this._id,
      email: this.email,
      expiresAt: moment().add(process.env.TOKEN_EXPIRATION, 'hours').unix()
    };
    return jwt.sign(
      playload,
      process.env.JWT_SECRET,
      {
        expiresIn: `${process.env.TOKEN_EXPIRATION}h`
      }
    );
  },

  // Compare to check if raw password matches encrypted password
  async passwordMatches(password) {
    return bcrypt.compare(password, this.password);
  },
});

/**
 * Statics
 */
userSchema.statics = {

  roles,

  /**
   * Get user
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, Error>}
   */
  async get(id) {
    try {
      let user;

      // Find user by user id
      if (mongoose.Types.ObjectId.isValid(id)) {
        user = await this.findById(id).exec();
      }
      if (user) {
        return user;
      }

      // Throws API error if user does not exist
      throw new Error({
        message: 'User does not exist'
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * Find user by email and tries to generate a JWT token
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, Error>}
   */
  async findAndGenerateToken(options) {
    const { email, password } = options;
    if (!email) throw new Error({ message: 'An email is required to generate a token' });

    // Find user by email
    const user = await this.findOne({ email }).exec();
    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true,
    };

    // If password field exists check if password matches and generate token
    if (password) {
      if (user && await user.passwordMatches(password)) {
        return { user, accessToken: user.token() };
      }
      err.message = 'Incorrect email or password';
    } else if (refreshObject && refreshObject.userEmail === email) {
      // if refresh token exists, generate token from refresh token
      if (moment(refreshObject.expires).isBefore()) {
        err.message = 'Expired token.';
      } else {
        return { user, accessToken: user.token() };
      }
    } else {
      err.message = 'Incorrect email or token';
    }
    throw new Error(err);
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  async list({
    page = 1, perPage = 5, search,
  }) {
    const options = {};

    // if search exists, find by name, email and role using search
    if (search && search.length > 0) {
      options.$or = [
        {
          name: RegExp(search, 'i'),
        },
        {
          email: RegExp(search, 'i'),
        },
        {
          role: RegExp(search, 'i'),
        },
      ];
    }

    try {
      // Get users from database
      let users = await this.find(options)
        .sort({ createdAt: -1 })
        .skip(perPage * (page - 1))
        .limit(perPage)
        .exec();
      users = users.map(user => user.transform());

      const total = await this.countDocuments(options).exec();

      return ({
        users,
        total,
        page,
        totalPages: Math.ceil(total / perPage),
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * Return new validation error
   * if error is a mongoose duplicate key error
   *
   * @param {Error} error
   * @returns {Error|Error}
   */
  checkDuplicateEmail(error) {
    // If there is error, check if error is due to email duplicate of mongodb
    if (error.name === 'MongoError' && error.code === 11000) {
      return new Error({
        message: 'Validation Error',
        errors: [{
          field: 'email',
          location: 'body',
          messages: ['User already exists'],
        }],
        status: httpStatus.CONFLICT,
        isPublic: true,
        stack: error.stack,
      });
    }
    return error;
  },
};

/**
 * @typedef User
 */
module.exports = mongoose.model('User', userSchema);
