const mongoose = require('mongoose');
const validator = require('validator');
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email address'],
    },
    photo: {
      type: String,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Password does not match: Please confirm your password'],
      validate: {
        //?this only works on CREATE and SAVE
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords do not match',
      },
    },
    passwordChangedAt: Date,
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  //?Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  //?Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //?Delete passwordConfirm field
  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.confirmPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  console.log(
    'this.passwordChangedAt =',
    this.passwordChangedAt,
    'JWTTimestamp = ',
    JWTTimestamp,
  );
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
