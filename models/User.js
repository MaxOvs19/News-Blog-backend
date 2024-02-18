import { db } from "../db.js";
import { DataTypes } from "sequelize";
import { Post } from "./Post.js";

export const User = db.define("user", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  avatar: { type: DataTypes.STRING },
  status: { type: DataTypes.TEXT },
});

User.hasMany(Post);
Post.belongsTo(User);
