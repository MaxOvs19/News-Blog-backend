import { Post } from "./Post";
import { User } from "./User";

User.hasMany(Post);
Post.belongsTo(User);
