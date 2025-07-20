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

// const testTour = new Tour({
//   name: 'The Great Outdoors',
//   price: 467,
// });

// testTour
//   .save()
//   .then((doc) => console.log(doc))
//   .catch((err) => console.log(err));
// ?Starting the server

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

//?Test

//?Handling unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('MongoServerError:', err.message, err.name); // Handle MongoDB server errors
  // You can log the error or take other actions as needed
  console.log('Unhandled Rejection! Shutting down...');

  server.close(() => {
    process.exit(1); // Exit the process with a failure code
  });
});
