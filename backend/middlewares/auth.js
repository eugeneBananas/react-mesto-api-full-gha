const HTTP_STATUS = {
  UNAUTHORIZED: 401,
};
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    const error = new Error('Неправильные почта или пароль');
    error.statusCode = HTTP_STATUS.UNAUTHORIZED;
    next(error);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'c9310ab8bf2ac4c3');
  } catch (err) {
    const error = new Error('Неправильные почта или пароль');
    error.statusCode = HTTP_STATUS.UNAUTHORIZED;
    next(error);
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
