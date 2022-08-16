const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});
app.use(bodyParser.json());
app.use(cookieParser());

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/users', require('./routes/users'));

app.use('/cards', require('./routes/cards'));

app.use('/', require('./routes/pageNotFound'));

app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
  next();
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
