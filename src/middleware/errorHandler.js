const setDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    code_stack: err.stack,
  });
};

//  Operational error, trusted error: send error to the client
const setProductionError = (err, res) => {
  // Operational error that we trust: then send message to the client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Non Operational error or unknown error: dont leak error details

    // 1) Log the error
    console.error(`Error 💣:`, err);

    // 2) Send generic error message
    res.status(500).json({
      status: `Error`,
      message: `Something went wrong.`,
    });
  }
};

// const handleSequelizeValidationError = (err) => {
//   const errors = Object.values(err.errors).map((value) => value.message);
//   const message = `Invalid input data. ${errors.join(". ")}`;
//   return new AppError(message, 400);
// };

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    setDevError(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // let error = { ...err };
    // error.name = err.name;
    // error.code = err.code;
    // error.status = err.status;
    // if (error.type === `Validation error`)
    //   error = handleSequelizeValidationError(error);
    setProductionError(err, res);
  }
};
