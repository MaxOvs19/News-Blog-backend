import { db } from "../db.js";
import { DataTypes } from "sequelize";

export const User = db.define("user", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  avatar: { type: DataTypes.STRING },
  status: { type: DataTypes.TEXT },
});

export const Post = db.define("post", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING },
  content: { type: DataTypes.TEXT },
  like: { type: DataTypes.INTEGER },
  img: { type: DataTypes.STRING },
});

export const TypeNews = db.define("type_news", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING },
});

export const Like = db.define("like", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
});

User.hasMany(Post);
Post.belongsTo(User);

User.hasMany(Like);
Like.belongsTo(User);

TypeNews.hasMany(Post);
Post.belongsTo(TypeNews);

Post.hasMany(Like);
Like.belongsTo(Post);
