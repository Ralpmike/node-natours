const express = require('express');

const router = express.Router();
const userControllers = require('../controllers/userControllers.controller');

const authControllers = require('../controllers/authController.controller');

router.post('/signup', authControllers.signup);
router.post('/login', authControllers.login);

router
  .route('/')
  .get(userControllers.getAllUsers)
  .post(userControllers.createUser);
router
  .route('/:id')
  .get(userControllers.getUser)
  .patch(userControllers.updateUser)
  .delete(userControllers.deleteUser);

module.exports = router;
