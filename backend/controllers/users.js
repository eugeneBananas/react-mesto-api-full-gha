const HTTP_STATUS = {
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
};
const { default: mongoose } = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      next(err);
    });
};

module.exports.getOneUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        const error = new Error('Введен некорректный ID');
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        next(error);
      } else if (err.message === 'NotFound') {
        const error = new Error('Ошибка при вводе данных пользователя');
        error.statusCode = HTTP_STATUS.NOT_FOUND;
        next(error);
      } else {
        next(err);
      }
    });
};

module.exports.getInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        const error = new Error('Введен некорректный ID');
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        next(error);
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
  } = req.body;

  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(HTTP_STATUS.CREATED).send(user))
    .catch((err) => {
      next(err);
    });
};

module.exports.editUserData = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        const error = new Error('Введены некорректные данные');
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        next(error);
      } else if (err instanceof mongoose.Error.CastError) {
        const error = new Error('Введен некорректный ID');
        error.statusCode = HTTP_STATUS.NOT_FOUND;
        next(error);
      } else {
        next(err);
      }
    });
};

module.exports.editUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        const error = new Error('Введены некорректные данные');
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        next(error);
      } else if (err instanceof mongoose.Error.CastError) {
        const error = new Error('Введен некорректный ID');
        error.statusCode = HTTP_STATUS.NOT_FOUND;
        next(error);
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email } = req.body;

  return User.findUserByCredentials(email).select('+password') // .
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'c9310ab8bf2ac4c3', { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 3600000,
          httpOnly: true,
          sameSite: true,
        })
        .end();
    })
    .catch(() => {
      const error = new Error('Неправильные почта или пароль');
      error.statusCode = HTTP_STATUS.UNAUTHORIZED;
      next(error);
    });
};
