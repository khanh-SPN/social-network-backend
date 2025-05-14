const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ msg: 'Something went wrong, please try again later' });
};

module.exports = errorHandler;