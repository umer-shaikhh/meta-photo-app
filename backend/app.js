const express = require('express');
const photosRoute = require('./routes/photos');

const app = express();
const PORT = 3000;
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});
app.use('/externalapi/photos', photosRoute);

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

module.exports = app // for testing
