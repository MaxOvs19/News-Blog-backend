import { TypeNews } from "../models/models.js";

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

  async getAll(req, res) {
    const allType = await TypeNews.findAll();

    return res.json(allType);
  }
}
export default new TypeNewsController();
