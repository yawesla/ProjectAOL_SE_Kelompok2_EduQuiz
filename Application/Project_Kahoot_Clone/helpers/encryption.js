const bcrpyt = require("bcryptjs");
const salt = bcrpyt.genSaltSync(10);

const hashPassword = (plainPassword) => {
  return bcrpyt.hashSync(plainPassword, salt);
};

const comparePassword = (plainPassword, hashPassword) => {
  return bcrpyt.compareSync(plainPassword, hashPassword);
};

module.exports = { hashPassword, comparePassword };