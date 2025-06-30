const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = require('./app');

const DB = process.env.MONGODB_URI.replace(
  '<PASSWORD>',
  process.env.MONGODB_PASSWORD,
);

//?Connecting to a cloud database
mongoose.connect(DB).then((con) => {
  console.log(con.connection.host);
  console.log('DB connection successful!');
});

//?Connecting to a local database
// mongoose.connect(process.env.DATABASE_LOCAL).then((con) => {
//   console.log(con.connection.host);
//   console.log('DB connection successful!');
// });

// console.log(process.env);

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
  name: 'The Forest Hiker',
  rating: 4.7,
  price: 397,
});

// ?Starting the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
