
const UnauthorizedError = require('../errors/UnauthorizedError');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Необходима авторизация.'))
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, '1234567890-tg');
  } catch (e) {
    next(new UnauthorizedError('Необходима авторизация.'));
  }
  req.user = payload;
  next();
}