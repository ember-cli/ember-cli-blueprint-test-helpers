module.exports = function(error) {
  if (error.errorLog && error.errorLog.length) {
    throw error.errorLog[0];
  } else {
    throw error;
  }
};
