const { BAD_REQUEST_CODE } = require('../utils/constans');

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = BAD_REQUEST_CODE;
  }
}

module.exports = BadRequestError;