const HTTP_STATUS = {
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

mongoose.connect(DB_URL);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use((req, res, next) => {
//   req.user = {
//     _id: '65aefc6a48155116a73b503b',
//   };

//   next();
// });

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// не требуют авторизации
app.use('/signin', require('./routes/signin'));
app.use('/signup', require('./routes/signup'));

app.use(auth); // почему перехватывает другие ошибки
// требуют авторизации
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use(errorLogger);

app.use((req, res, next) => {
  res.status(HTTP_STATUS.NOT_FOUND).send({ message: 'Страницы не существует' });
  next();
});

app.use((error, req, res, next) => {
  const { statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, message } = error;
  res.status(statusCode).send({
    message: statusCode === HTTP_STATUS.INTERNAL_SERVER_ERROR ? 'На сервере произошла ошибка' : message,
  });
  next();
});

app.listen(PORT, () => {});
