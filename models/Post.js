import { db } from "../db.js";
import { DataTypes } from "sequelize";

export const Post = db.define("post", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING },
  content: { type: DataTypes.TEXT },
  img: { type: DataTypes.STRING },
});