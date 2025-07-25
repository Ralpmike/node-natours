// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signInToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = catchAsync(async (req, res, next) => {
  const { email, name, password, passwordConfirm } = req.body;

  const newUser = await User.create({ email, name, password, passwordConfirm });
  const token = signInToken({ id: newUser._id, name: newUser.name });

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //?Check if the email or password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.confirmPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  console.log(user);

  //? Check if the user password is correct

  // const userPassword =

  const token = signInToken({ id: user._id, name: user.name });

  res.status(200).json({
    status: 'success',
    token,
  });
});
