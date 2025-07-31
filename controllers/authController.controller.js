const { promisify } = require('util');
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signInToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

// const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

exports.signup = catchAsync(async (req, res, next) => {
  const { email, name, password, passwordConfirm, passwordChangedAt } =
    req.body;

  const newUser = await User.create({
    email,
    name,
    password,
    passwordConfirm,
    passwordChangedAt,
  });
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

exports.protect = catchAsync(async (req, res, next) => {
  //?1) Getting token and check if it's there
  const headers = req.headers.authorization;

  if (!headers || !headers.startsWith('Bearer ')) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401),
    );
  }

  const token = headers.split(' ')[1];

  //?2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //?check if user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401,
      ),
    );
  }

  //?Check if user changed password after the token was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401),
    );
  }

  //?GRANT ACCESS TO PROTECTED ROUTE
  req.user = freshUser;
  next();
});
