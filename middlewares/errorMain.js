const { SERVER_ERROR_CODE } = require('../utils/constans');

function errorMain(err, req, res, next) {
  const { statusCode = SERVER_ERROR_CODE, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === SERVER_ERROR_CODE
        ? 'Ошибка на сервере'
        : message,
    });
  next();
}
module.exports = errorMain;
