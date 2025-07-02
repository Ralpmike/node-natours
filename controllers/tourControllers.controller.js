const Tour = require('../models/tourModel');

//?get all tours
exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find({});
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

//?get specific tour
exports.getTour = async (req, res) => {
  try {
    const { id } = req.params;
    //? findByid is a short hnad for findOne: findOne({ _id: id })
    const tour = await Tour.findById(id);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
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
exports.updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      message: 'Updated successfully',
      data: {
        tour: updatedTour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
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
