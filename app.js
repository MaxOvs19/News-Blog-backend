import express from "express";
import cors from "cors";
import path from "path";
import fileUpload from "express-fileupload";
import { fileURLToPath } from "url";

import { db } from "./db.js";
import router from "./routes/index.js";

import "dotenv/config";

const PORT = process.env.PORT || 8080;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.resolve(__dirname, "static")));
app.use(fileUpload());

app.use("/api", router);

const main = async () => {
  try {
    await db.authenticate();
    await db.sync();
    app.listen(PORT, () => {
      console.log("start server in port:", PORT);
    });
  } catch (error) {
    console.log(error);
  }
};

main();
