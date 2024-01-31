import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateJWT = (id, email, name) => {
  return jwt.sign(
    {
      id: id,
      email: email,
      name: name,
    },
    process.env.SECRET_KEY,
    { expiresIn: "24h" }
  );
};

class UserController {
  async registration(req, res) {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res
        .status(401)
        .json({ message: "Error email, or password", status: false });
    }

    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      return res.status(400).json({
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

    const jwToken = generateJWT(user.id, user.email, user.name);

    user.save();

    return res.status(201).json({
      message: "Create new User!",
      status: true,
      token: jwToken,
    });
  }

  async login(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        message: "Такой пользователь ненайден!",
        status: false,
      });
    }
    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return res.status(400).json({
        message: "Указан неверный пароль!",
        status: false,
      });
    }

    const token = generateJWT(user.id, user.email, user.name);

    return res.json({ token: token });
  }

  async check(req, res) {
    const token = generateJWT(req.user.id, req.user.email, req.user.name);
    res.status(200).json({ token: token });
  }

  async getOne(req, res) {}
}

export default new UserController();
