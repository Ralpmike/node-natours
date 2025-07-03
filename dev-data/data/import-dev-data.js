const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const Tour = require('../../models/tourModel');

const DB = process.env.MONGODB_URI.replace(
  '<PASSWORD>',
  process.env.MONGODB_PASSWORD,
);

//?Connecting to a cloud database
mongoose.connect(DB).then((con) => {
  console.log(con.connection.host);
  console.log('DB connection successful!');
});

//READ JSON FILE
const filePath = path.join(__dirname, 'tours-simple.json');

const data = fs.readFileSync(filePath);
const tours = JSON.parse(data);

// INSERT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
