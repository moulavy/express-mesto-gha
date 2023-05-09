const { CONFLICT_ERROR_CODE } = require('../utils/constans');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NOT_FOUND_CODE;
  }
}

module.exports = ConflictError;