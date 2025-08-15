const express = require('express');

const router = express.Router();
const userControllers = require('../controllers/userControllers.controller');

const authControllers = require('../controllers/authController.controller');

router.post('/signup', authControllers.signup);
router.post('/login', authControllers.login);

router.post('/forgot-password', authControllers.forgotPassword);

router.patch('/reset-password/:token', authControllers.resetPassword);

router.patch('/updateMe', authControllers.protect, userControllers.updateMe);

router.patch(
  '/update-password',
  authControllers.protect,
  authControllers.updatePassword,
);

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
