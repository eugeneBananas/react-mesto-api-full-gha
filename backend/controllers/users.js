const { JWT_SECRET = 'c9310ab8bf2ac4c3' } = process.env;
const HTTP_STATUS = {
  CREATED: 201,
};

const { default: mongoose } = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const BadRequestError = require('../errors/bad-request-error');
const AnthorizedError = require('../errors/unathorized-error');
const NotFoundError = require('../errors/not-found-error');
const ConflictError = require('../errors/conflict-error');
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
        next(new BadRequestError(err.message));
      } else if (err.message === 'NotFound') {
        next(new NotFoundError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.getInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(err.message));
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
    .then(() => res.status(HTTP_STATUS.CREATED).send({
      name,
      about,
      avatar,
      email,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      }
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
        next(new BadRequestError(err.message));
      } else if (err instanceof mongoose.Error.CastError) {
        next(new NotFoundError(err.message));
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
        next(new BadRequestError(err.message));
      } else if (err instanceof mongoose.Error.CastError) {
        next(new NotFoundError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // console.log(req.user + user._id + ' 1');
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });
      // console.log(req.user + ' 2');
      // req.headers.authorization = `Bearer +${token}`;
      // req.user._id = user._id;
      // console.log(req.user + ' 3');
      res.send({ token });
      // .cookie('jwt', token, {
      //   maxAge: 3600000,
      //   httpOnly: true,
      //   sameSite: true,
      // })
      // .end();
    })
    .catch((err) => {
      next(new AnthorizedError(err.message));
    });
};
