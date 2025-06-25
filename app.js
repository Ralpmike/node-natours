const fs = require('fs');
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// ?Routes
const filePath = path.join(__dirname, 'dev-data', 'data', 'tours-simple.json');
const data = fs.readFileSync(filePath);
const tours = JSON.parse(data);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

const port = process.env.PORT || 3000;
// app.use(express.static('public'));

app.listen(port, () => {
  console.log('App running on port 3000...');
});
