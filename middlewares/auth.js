const {
  UNAUTHORIZED_CODE
} = require('../utils/constans');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  console.log("В авторизацию приходит.");
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Необходима авторизация 1' });
  }
  const token = authorization.replace('Bearer ', '');
  console.log("token",token);
  let payload;

  try {
    payload = jwt.verify(token, '1234567890-tg');
  } catch (err) {
    return res.status(UNAUTHORIZED_CODE).send({ message: "Необходима авторизация 2" });
  }
  req.user = payload;
 return next();
}