const Tour = require('../models/tourModel');

//?get all tours
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestedAt,
    // results: tours.length,
    // data: {
    //   tours,
    // },
  });
};

//?get specific tour
exports.getTour = (req, res) => {
  const id = parseInt(req.params.id, 10);

  res.status(200).json({
    status: 'success',
    // data: {
    //   tour,
    // },
  });
};

//?create tour
exports.createTour = async (req, res) => {
  try {
    // const newTour = new Tour({});
    // newTour.save();

    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
    });
  }
};

//?update tour
exports.updateTour = (req, res) => {
  const id = parseInt(req.params.id, 10);

  res.status(200).json({
    status: 'success',
    message: 'Updated successfully',
    // data: {
    //   tour: updateTour,
    // },
  });
};

//?delete tour
exports.deleteTour = (req, res) => {
  const id = parseInt(req.params.id, 10);

  res.status(204).json({
    status: 'success',
    message: 'Deleted successfully',
    data: null,
  });
};

// module.exports = {
//   getAllTours,
//   getTour,
//   createTour,
//   updateTour,
//   deleteTour,
// };
