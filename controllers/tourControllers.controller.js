const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/ApiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.aliasTopTours = (req, res, next) => {
  req.aliasQuery = {
    limit: '5',
    sort: '-ratingsAverage,price',
    fields: 'name,price,ratingsAverage,summary,difficulty',
  };
  next();
};

//?get all tours
exports.getAllTours = catchAsync(async (req, res, next) => {
  //?BUILD QUERY
  //?1a) filtering
  const queryParams = req.aliasQuery || req.query;

  const features = new APIFeatures(Tour.find(), queryParams)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  //?EXECUTE QUERY
  const tours = await features.query;
  // const query = await Tour.find()
  //   .where('duration')
  //   .equals(5)
  //   .where('difficulty')
  //   .equals('easy');
  //?SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

//?get specific tour
exports.getTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  //? findByid is a short hnad for findOne: findOne({ _id: id })
  const tour = await Tour.findById(id);

  if (!tour) {
    return next(new AppError(`No tour found with that ID: ${id}`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

//?create tour
exports.createTour = catchAsync(async (req, res, next) => {
  // const newTour = new Tour({});
  // newTour.save();
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

//?update tour
exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(
      new AppError(`No tour found with that ID: ${req.params.id}`, 404),
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'Updated successfully',
    data: {
      tour,
    },
  });
});

//?delete tour
exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(
      new AppError(`No tour found with that ID: ${req.params.id}`, 404),
    );
  }

  res.status(204).json({
    status: 'success',
    message: 'Deleted successfully',
    data: null,
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } },
    // },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
        num: { $sum: 1 },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 6,
    },
    {
      $unset: 'num',
    },
  ]);

  res.status(200).json({
    status: 'success',
    result: plan.length,
    data: {
      plan,
    },
  });
});
