const app = require('./app');
const dotenv = require('dotenv');

dotenv.config();

// ?Starting the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('App running on port 3000...');
});
