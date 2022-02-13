import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import { rootRouter } from "./routes";

dotenv.config();
const app = express();

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.status(200).send("Okay");
});

app.use("/", rootRouter);

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
