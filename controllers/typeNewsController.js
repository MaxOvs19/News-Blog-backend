import { TypeNews } from "../models/Post.js";

class TypeNewsController {
  async create(req, res) {
    const { name } = req.body;

    const checkType = await TypeNews.findOne({ where: { name } });

    if (checkType) {
      return res.status(400).json({
        message: "Такой тип уже есть!",
        status: false,
      });
    }

    const type = await TypeNews.create({ name });

    type.save();

    return res.status(201).json({
      message: "Added new type news!",
      status: true,
    });
  }
}
export default new TypeNewsController();
