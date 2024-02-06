const HTTP_STATUS = {
  INTERNAL_SERVER_ERROR: 500,
};
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/not-found-error');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

mongoose.connect(DB_URL);
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// не требуют авторизации
app.use('/signin', require('./routes/signin'));
app.use('/signup', require('./routes/signup'));

app.use(auth);
// требуют авторизации

// app.use((req, res, next) => {
//   console.log('Headers received:', req.user);
//   next();
// });

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res, next) => {
  next(new NotFoundError('Страницы не существует'));
});

app.use(errorLogger);

app.use(errors());

app.use((error, req, res, next) => {
  const { statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, message } = error;
  res.status(statusCode).send({
    message: statusCode === HTTP_STATUS.INTERNAL_SERVER_ERROR ? 'На сервере произошла ошибка' : message,
  });
  next();
});

app.listen(PORT, () => {});
