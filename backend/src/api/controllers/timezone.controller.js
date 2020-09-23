const httpStatus = require('http-status');
const Timezone = require('../models/timezone.model');

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const timezone = await Timezone.get(id);
    req.locals = { timezone, userId: timezone.user._id };

    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get timezone
 * @public
 */
exports.get = (req, res) => res.json(req.locals.timezone.transform());


/**
 * Create new timezone
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const timezone = new Timezone(req.body);
    timezone.user = req.user;
    const savedTimezone = await timezone.save();
    res.status(httpStatus.CREATED);
    res.json(savedTimezone.transform());
  } catch (error) {
    next(error);
  }
};


/**
 * Update existing timezone
 * @public
 */
exports.update = (req, res, next) => {
  const timezoneData = req.body;
  const timezone = Object.assign(req.locals.timezone, timezoneData);

  timezone.save()
    .then(savedTimezone => res.json(savedTimezone.transform()))
    .catch(e => next(e));
};

/**
 * Get timezone list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const timezones = await Timezone.list({ ...req.query });
    res.json(timezones);
  } catch (error) {
    next(error);
  }
};

/**
 * Get timezone list
 * @public
 */
exports.myList = async (req, res, next) => {
  try {
    const timezones = await Timezone.list({ ...req.query, userId: req.user._id });
    res.json(timezones);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete timezone
 * @public
 */
exports.remove = (req, res, next) => {
  const { timezone } = req.locals;

  timezone.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(e => next(e));
};
