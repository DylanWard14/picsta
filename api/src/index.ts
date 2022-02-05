import express from "express";

import { rootRouter } from "./routes";

// TODO JSON body parser?

const app = express();

app.get("/", (req, res) => {
  res.status(200).send("Okay");
});

app.use("/", rootRouter);

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
