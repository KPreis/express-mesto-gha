const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});
app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = {
    _id: '62e66f9a07fb50d5290344bf',
  };
  next();
});
app.use('/users', require('./routes/users'));

app.use('/cards', require('./routes/cards'));

app.use('/', require('./routes/pageNotFound'));

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
