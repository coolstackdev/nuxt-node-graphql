const httpStatus = require('http-status');
const { omit } = require('lodash');
const APIError = require('../utils/APIError');
const User = require('../models/user.model');
const Timezone = require('../models/timezone.model');
const Role = require('../../helpers/role');
const mongoose = require('mongoose');

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const user = await User.get(id);
    req.locals = { user };

    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get user
 * @public
 */
exports.get = (req, res) => res.json(req.locals.user.transform());

/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req, res) => res.json({ user: req.user.transform() });

/**
 * Create new user
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(httpStatus.CREATED);
    res.json(savedUser.transform());
  } catch (error) {
    next(User.checkDuplicateEmail(error));
  }
};

/**
 * Update existing user
 * @public
 */
exports.update = (req, res, next) => {
  const ommitRole = (req.user.role !== Role.ADMIN && req.user.role !== Role.MANAGER) ? 'role' : '';
  let updatedUser = omit(req.body, ommitRole);

  // check if 'manager' try to edit 'admin' user
  if (req.user.role === 'manager' && updatedUser.role === 'admin') {
    const apiError = new APIError({
      message: "manager can't change admin user",
      status: httpStatus.FORBIDDEN,
    });
    next(apiError);
    return;
  }

  // don't update password if password is ""
  if (req.body.password === '') { updatedUser = omit(req.body, 'password'); }

  const user = Object.assign(req.locals.user, updatedUser);
  user.save()
    .then(savedUser => res.json(savedUser.transform()))
    .catch(e => next(User.checkDuplicateEmail(e)));
};

/**
 * Update existing user
 * @public
 */
exports.updateLoggedIn = (req, res, next) => {
  const user = Object.assign(
    req.user,
    req.body.password === '' ? omit(req.body, 'password') : req.body,
  );

  user.save()
    .then(savedUser => res.json(savedUser.transform()))
    .catch(e => next(User.checkDuplicateEmail(e)));
};


/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const users = await User.list(req.query);

    res.json(users);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
  const { user } = req.locals;

  // check if 'manager' try to edit 'admin' user
  if (req.user.role === 'manager' && user.role === 'admin') {
    const apiError = new APIError({
      message: "manager can't delete admin user",
      status: httpStatus.FORBIDDEN,
    });
    next(apiError);
    return;
  }

  // manager (or admin) can't delete himself
  if (user.email === req.user.email) {
    const apiError = new APIError({
      message: "manager(or admin) can't delete himself",
      status: httpStatus.FORBIDDEN,
    });
    next(apiError);
    return;
  }

  console.log('will delete user');
  console.log(user);

  user.remove()
    .then(() => {
      Timezone.deleteMany({ user: mongoose.Types.ObjectId(user._id) }, (err) => {
        if (err) console.log(err);
        console.log('Successful deletion');
      });
      return res.status(httpStatus.NO_CONTENT).end();
    })
    .catch(e => next(e));
};
