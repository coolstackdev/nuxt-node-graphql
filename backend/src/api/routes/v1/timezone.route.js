const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/timezone.controller');
const { authorize } = require('../../middlewares/auth');
const { ADMIN } = require('../../../helpers/role');
const { timezone } = require('../../validations/timezone.validation');

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param('timezoneId', controller.load);


// /timezones/my - Returns the timezones created by the logged in user
router
  .route('/my')
  .get(authorize(), controller.myList);

// /timezones - Returns the timezones or create a timezone
router
  .route('/')
  .get(authorize(ADMIN), controller.list)
  .post(authorize(), validate(timezone), controller.create);

// /timezones/:timezoneId - Returns a timezone or modify or delete the timezone
router
  .route('/:timezoneId')
  .get(authorize(), controller.get)
  .put(authorize(), controller.update)
  .delete(authorize(), controller.remove);


module.exports = router;
