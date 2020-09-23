const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/user.controller');
const { authorize } = require('../../middlewares/auth');
const { ADMIN, MANAGER } = require('../../../helpers/role');
const {
  listUsers,
  createUser,
  updateUser,
} = require('../../validations/user.validation');

const router = express.Router();

/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', controller.load);

// /users - Returns users or create user
router
  .route('/')
  .get(authorize(ADMIN, MANAGER), validate(listUsers), controller.list)
  .post(authorize(ADMIN, MANAGER), validate(createUser), controller.create);

// /users/me - Returns currently loggedIn user
router
  .route('/me')
  .get(authorize(), controller.loggedIn);

// /users/profile - Returns the information of loggedin user or update it.
router
  .route('/profile')
  .get(authorize(), controller.loggedIn)
  .put(authorize(), controller.updateLoggedIn);


// /users/:userId - Returns a user or update or delete a user
router
  .route('/:userId')
  .get(authorize(ADMIN, MANAGER), controller.get)
  .put(authorize(ADMIN, MANAGER), validate(updateUser), controller.update)
  .delete(authorize(ADMIN, MANAGER), controller.remove);


module.exports = router;
