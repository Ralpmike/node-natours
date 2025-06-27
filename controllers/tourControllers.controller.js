const path = require('path');
const fs = require('fs');

const filePath = path.join(
  __dirname,
  '..',
  'dev-data',
  'data',
  'tours-simple.json'
);
const data = fs.readFileSync(filePath);
const tours = JSON.parse(data);

exports.checkId = (req, res, next, val) => {
  console.log(`Tour id is: ${val}`);
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};

//?get all tours
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestedAt,
    results: tours.length,
    data: {
      tours,
    },
  });
};

//?get specific tour
exports.getTour = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const tour = tours.find((el) => el.id === id);

  // if (tours.length < id) {
  // if (!tour) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid ID',
  //   });
  // }
  // const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

//?create tour
exports.createTour = (req, res) => {
  console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  fs.writeFile(filePath, JSON.stringify(tours), (err) => {
    console.log(err);
  });

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
};

//?update tour
exports.updateTour = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const tourIndex = tours.findIndex((el) => el.id === id);

  // if (tourIndex === -1) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid ID',
  //   });
  // }

  const updateTour = {
    ...tours[tourIndex],
    ...req.body,
  };

  tours[tourIndex] = updateTour;

  fs.writeFile(filePath, JSON.stringify(tours, null, 2), (err) => {
    if (err) {
      return res.status(500).json({
        status: 'error',
        message: "Couldn't update data",
        error: {
          message: err,
        },
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Updated successfully',
      data: {
        tour: updateTour,
      },
    });
  });
};

//?delete tour
exports.deleteTour = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const tourIndex = tours.findIndex((el) => el.id === id);

  // if (tourIndex === -1) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid ID',
  //   });
  // }

  tours.splice(tourIndex, 1);

  fs.writeFile(filePath, JSON.stringify(tours, null, 2), (err) => {
    if (err) {
      return res.status(500).json({
        status: 'error',
        message: "Couldn't delete data",
        error: {
          message: err,
        },
      });
    }

    res.status(204).json({
      status: 'success',
      message: 'Deleted successfully',
      data: null,
    });
  });
};

// module.exports = {
//   getAllTours,
//   getTour,
//   createTour,
//   updateTour,
//   deleteTour,
// };
