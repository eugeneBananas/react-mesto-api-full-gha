const { JWT_SECRET = 'c9310ab8bf2ac4c3' } = process.env;
const jwt = require('jsonwebtoken');
const AnthorizedError = require('../errors/unathorized-error');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new AnthorizedError('Неправильная почта или пароль'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new AnthorizedError('Неправильная почта или пароль'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
