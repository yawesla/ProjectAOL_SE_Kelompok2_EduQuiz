const { User } = require("../models");
const { comparePassword } = require("../helpers/encryption");
const { signToken } = require("../helpers/jwt");


class Controller {
  static async register(req, res, next) {
    try {
      const { name, email, password, role } = req.body;

      const created = await User.create({
        name,
        email,
        password,
        role
      });

      res.status(201).json({
        id: created.id,
        name: created.name,
        email: created.email,
        role: created.role
      });
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email) throw { name: "NO_EMAIL" };
      if (!password) throw { name: "NO_PASSWORD" };

      const user = await User.findOne({
        where: {
          email,
        },
      });
      if (!user) throw { name: "INVALID_LOGIN" };

      const validPassword = comparePassword(password, user.password);
      if (!validPassword) throw { name: "INVALID_LOGIN" };

      const token = signToken({
        id: user.id,
        email: user.email,
      });

      res.status(200).json({
        name:user.name,
        role:user.role,
        access_token: token
      });
    } catch (err) {
      next(err);
    }
  }

}

module.exports = Controller;
