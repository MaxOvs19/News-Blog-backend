import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import path from "path";
import { Post, User } from "../models/models.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateJWT = (id, email, name, avatar, status) => {
  return jwt.sign(
    {
      id: id,
      email: email,
      name: name,
      avatar: avatar,
      status: status,
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

    const jwToken = generateJWT(user.id, user.email, user.name, user.avatar);

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

    const token = generateJWT(
      user.id,
      user.email,
      user.name,
      user.avatar,
      user.status
    );

    return res.json({ token: token });
  }

  //@GET
  async check(req, res) {
    const token = generateJWT(
      req.user.id,
      req.user.email,
      req.user.name,
      req.user.avatar,
      req.user.status
    );
    res.status(200).json({ token: token });
  }

  async getOneUser(req, res) {
    const { id } = req.query;

    const user = await User.findByPk(id, {
      attributes: ["name", "email", "avatar", "status"],
      include: [{ model: Post }],
    });

    if (!user) {
      res.status(404).json({
        status: false,
        message: "User not found!",
      });
    }

    return res.status(200).json(user);
  }

  //@PUT
  async update(req, res) {
    const { name, id, status, email } = req.body;
    let fileName = uuidv4() + ".jpg";

    if (req.files?.img) {
      req.files.img.mv(path.resolve(__dirname, "..", "static", fileName));
    } else {
      fileName = null;
    }

    const user = await User.findByPk(id);

    if (email) {
      const emailCheck = await User.findOne({ where: { email: email } });

      if (emailCheck) {
        return res.status(400).json({
          message: "This email is used",
        });
      }
    }

    if (user) {
      if (fileName != null) {
        await user.update({
          name: name,
          status: status,
          email: email,
          avatar: fileName,
        });
      } else {
        await user.update({
          name: name,
          status: status,
          email: email,
        });
      }

      const jwToken = generateJWT(
        user.id,
        user.email,
        user.name,
        user.avatar,
        user.status
      );

      return res.status(201).json({
        message: "User update!",
        status: true,
        token: jwToken,
      });
    } else {
      return res.status(404).json({
        message: "User not found!",
      });
    }
  }
}

export default new UserController();
