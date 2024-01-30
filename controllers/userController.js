import { User } from "../models/User.js";
import bcrypt from "bcrypt";

class UserController {
  async registration(req, res, next) {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.json({ message: "Error email, or password", status: false });
    }

    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      return res.json({
        message: "Такой пользователь уже есть!",
        status: false,
      });
    }

    const hashPassword = bcrypt.hashSync(password, 5);
    const user = await User.create({
      email,
      name,
      password: hashPassword,
    });

    user.save();

    return res.json({ message: "Create new User!" });
  }

  async login(req, res, next) {}

  async check(req, res) {}
}

export default new UserController();
