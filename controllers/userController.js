import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import path from "path";
import { User } from "../models/models.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  //@POST
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

  //@POST
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

  //@GET
  async check(req, res) {
    const token = generateJWT(req.user.id, req.user.email, req.user.name);
    res.status(200).json({ token: token });
  }

  //@PUT
  async update(req, res) {
    const { name, id, status } = req.body;
    let fileName = uuidv4() + ".jpg";

    if (req.files?.img) {
      req.files.img.mv(path.resolve(__dirname, "..", "static", fileName));
    } else {
      fileName = null;
    }

    const user = await User.findByPk(id);

    if (user) {
      await user.update({
        name: name,
        status: status,
        avatar: fileName,
      });

      return res.status(201).json({
        message: "User update!",
        status: true,
      });
    } else {
      return res.status(404).json({
        message: "User not found!",
      });
    }
  }
}

export default new UserController();
