const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const AnthorizedError = require('../errors/unathorized-error');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(avatar) {
        return /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/.test(
          avatar,
        );
      },
      message: 'URL должен начинаться с https://',
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
    minlength: 4,
    validate: {
      validator(email) {
        return /^\S+@\S+\.\S+$/.test(email);
      },
      message: 'Введите верный email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password,
) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        console.log(1);
        throw new AnthorizedError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          console.log(3);
          throw new AnthorizedError('Неправильные почта или пароль');
        }
        console.log(4);
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
