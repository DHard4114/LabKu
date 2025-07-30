
exports.success = (res, data, message = 'Success', code = 200) => {
  return res.status(code).json({
    success: true,
    message,
    data,
  });
};

exports.error = (res, error, message = 'Error', code = 500) => {
  return res.status(code).json({
    success: false,
    message,
    error: error instanceof Error ? error.message : error,
  });
};

exports.notFound = (res, message = 'Data not found') => {
  return res.status(404).json({
    success: false,
    message,
  });
};
exports.validationError = (res, errors, message = 'Validation Error') => {
  return res.status(422).json({
    success: false,
    message,
    errors,
  });
};
exports.unauthorized = (res, message = 'Unauthorized') => {
  return res.status(401).json({
    success: false,
    message,
  });
};
exports.forbidden = (res, message = 'Forbidden') => {
  return res.status(403).json({
    success: false,
    message,
  });
};


