const { User } = require("../models");
const { verifyToken } = require("../helpers/jwt");

async function AuthN(req, res, next) {
  try {
    const { access_token } = req.headers;

    if (!access_token) {
      throw { name: "INVALID_TOKEN" };
    }

    const payload = verifyToken(access_token);

    const userId = payload.id;
    const searchUser = await User.findByPk(userId);

    if (!searchUser) {
      throw { name: "NOT_FOUND" };
    }

    req.user = {
      id: searchUser.id,
      name: searchUser.name,
      email: searchUser.email,
      role: searchUser.role
    };

    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { AuthN };
