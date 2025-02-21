import models from "../database/models";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const { User } = models;

class UserController {
  static async registerUser(req, res) {
    try {
      const { username, password } = req.body;

      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res
          .status(400)
          .json({ status: "error", error: "User already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = await User.create({ username, password: hashedPassword });
      const token = jwt.sign({ id: newUser.id }, process.env.SECRET_KEY);

      const user = newUser.toJSON();
      delete user.password;

      return res.status(201).json({
        message: "User createdsuccessfully",
        user,
        token,
      });
    } catch (error) {
      res.status(500).json({ status: "error", error: error.message });
    }
  }

  static async loginUser(req, res) {
    try {
      const { username, password } = req.body;

      const existingUser = await User.findOne({ where: { username } });
      if (!existingUser) {
        return res
          .status(400)
          .json({ status: "error", error: "User doesn't exist" });
      }

      const match = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (!match)
        return res
          .status(401)
          .json({ status: "fail", message: "invalid password" });

      const token = jwt.sign({ id: existingUser.id }, process.env.SECRET_KEY);

      const user = existingUser.toJSON();
      delete user.password;

      return res.status(200).json({
        status: "success",
        message: "User logged in successfully",
        user,
        token,
      });
    } catch (error) {
      res.status(500).json({ status: "error", error: error.message });
    }
  }
}

export default UserController;
