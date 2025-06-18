async function errorHandle(err, req, res, next) {
  console.log(err);

  let code = 500;
  let msg = "Internal Server Error";

  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    //error register 400
    code = 400;
    msg = err.errors[0].message;
  } else if (err.name === "NO_EMAIL") {
    code = 400;
    msg = "Email is required";
  } else if (err.name === "NO_PASSWORD") {
    code = 400;
    msg = "Password is required";
  } else if (err.name === "INVALID_LOGIN") {
    code = 400;
    msg = "Invalid email/password";
  } else if (err.name === "INVALID_TOKEN") {
    code = 401;
    msg = "Invalid token";
  } else if (err.name === "NOT_FOUND") {
    code = 404;
    msg = "Data not found";
  }

  res.status(code).json({
    message: msg,
  });
}

module.exports = { errorHandle };
