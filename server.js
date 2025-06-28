const dotenv = require('dotenv');

dotenv.config();

const app = require('./app');

// console.log(process.env);

// ?Starting the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
