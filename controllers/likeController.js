import { Like, Post, User } from "../models/models.js";

class LikeController {
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
        message: "User not found!",
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

  async removeLike(req, res) {}
}

export default new LikeController();
