import path from "path";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";

import { Post } from "../models/Post.js";
import { User } from "../models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class PostController {
  async getAll(req, res) {
    let posts = await Post.findAll({
      include: {
        model: User,
        attributes: ["name"],
      },
    });

    return res.status(200).json({
      posts: posts,
      status: true,
    });
  }

  async getOne(req, res) {}

  async create(req, res) {
    const { title, content, userId } = req.body;
    let fileName = uuidv4() + ".jpg";

    if (req.files?.img) {
      req.files.img.mv(path.resolve(__dirname, "..", "static", fileName));
    } else {
      fileName = null;
    }

    if (String(title).length == 0 && String(content).length == 0) {
      res.status(400).json({
        message: "Пост не может быть пустым!",
        status: false,
      });
    }

    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      res.status(400).json({
        message: "Такого юзера не существует!",
        status: false,
      });
    }

    const post = await Post.create({
      title,
      content,
      img: fileName,
      userId,
    });

    post.save();

    return res.status(201).json({
      message: "Post create!",
      status: true,
    });
  }

  async delete(req, res) {}

  async update(req, res) {}
}

export default new PostController();
