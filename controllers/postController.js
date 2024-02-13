import path from "path";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";

import { Post, TypeNews } from "../models/Post.js";
import { User } from "../models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class PostController {
  //@GET
  async getAll(req, res) {
    const posts = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ["name"],
        },
        {
          model: TypeNews,
          attributes: ["name"],
        },
      ],
    });

    return res.status(200).json({
      posts: posts,
      status: true,
    });
  }

  //@GET
  async getOne(req, res) {
    const { id } = req.params;

    const post = await Post.findOne({
      where: { id: id },
      include: [
        {
          model: User,
          attributes: ["name", "email", "avatar"],
        },
        {
          model: TypeNews,
          attributes: ["name"],
        },
      ],
    });

    if (!post) {
      res.status(404).json({
        massage: "Post not found!",
        status: false,
      });
    } else {
      return res.status(200).json(post);
    }
  }

  //@GET
  async getPostsByUser(req, res) {
    const { id } = req.query;

    const user = await User.findOne({ where: { id: id } });

    if (!user) {
      res.status(404).json({
        massage: "User not found!",
        status: false,
      });
    }
    const posts = await Post.findAll({ where: { userId: id } });

    return res.status(200).json(posts);
  }

  //@POST
  async create(req, res) {
    const { title, content, userId, typeId } = req.body;
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
    const typeNews = await TypeNews.findOne({ where: { id: typeId } });

    if (!user) {
      res.status(400).json({
        message: "Такого юзера не существует!",
        status: false,
      });
    }

    if (!typeNews) {
      res.status(400).json({
        message: "Такого типа новостей нет!",
        status: false,
      });
    }

    const post = await Post.create({
      title,
      content,
      img: fileName,
      userId,
      typeNewId: typeId,
    });

    post.save();

    return res.status(201).json({
      message: "Post create!",
      status: true,
    });
  }

  //@PUT
  async update(req, res) {}

  //@DELETE
  async delete(req, res) {
    const { id } = req.params;
    console.log(id);

    const checkPost = await Post.findOne({ where: { id: id } });

    if (!checkPost) {
      res.status(404).json({
        massage: "Post not found!",
        status: false,
      });
    } else {
      await checkPost.destroy();

      return res.status(200).json({
        massage: "Post delete",
        status: true,
      });
    }
  }
}

export default new PostController();
