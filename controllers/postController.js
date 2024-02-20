import path from "path";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";

import { Like, Post, TypeNews, User } from "../models/models.js";

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
        {
          model: Like,
          attributes: ["id", "userId"],
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
        {
          model: Like,
          attributes: ["id", "userId"],
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

    const posts = await Post.findAll({
      where: { userId: id },
      include: [
        {
          model: TypeNews,
          attributes: ["name"],
        },
        {
          model: Like,
          attributes: ["id", "userId"],
        },
      ],
    });

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
  async update(req, res) {
    const { id } = req.params;
    const { title, content, img, typeId } = req.body;

    const post = await Post.findOne({ where: { id: id } });
    const checkType = await TypeNews.findOne({ where: { id: typeId } });

    if (post && checkType) {
      await post.update({
        title: title,
        content: content,
        img: img,
        typeNewId: typeId,
      });

      return res.status(202).json({
        message: "Post update!",
        status: true,
      });
    } else {
      res.status(404).json({
        massage: "Post or type news, not found!",
        status: false,
      });
    }
  }

  //@DELETE
  async delete(req, res) {
    const { id } = req.params;

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

  //@POST
  async setLike(req, res) {
    const { userId, postId } = req.body;

    const post = await Post.findByPk(postId);
    const user = await User.findByPk(userId);

    if (!user) {
      res.status(404).json({
        message: "User not found!",
      });
    }

    if (!post) {
      res.status(404).json({
        status: false,
        message: "Post not found!",
      });
    }

    if (user && post) {
      const like = await Like.create({
        userId: userId,
        postId: postId,
      });

      like.save();

      res.status(200).json({
        status: true,
        message: "Like success",
      });
    }
  }

  //@POST
  async removeLike(req, res) {
    const { userId, postId } = req.body;

    const user = await User.findByPk(userId);
    const post = await Post.findByPk(postId);

    if (!post && !user) {
      res.status(404).json({
        status: false,
        message: "Error post or user not found!",
      });
    }

    if (post && user) {
      const like = await Like.findOne({ where: { postId: postId } });
      await like.destroy();

      res.status(200).json({
        status: true,
        message: "Like remove",
      });
    }
  }
}

export default new PostController();
