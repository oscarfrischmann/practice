import express from "express";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import initSocket from "./sockets.js";
import viewsRouter from "../src/routes/views.routes.js";
import moviesRoutes from "./routes/movies.routes.js";
import config from "./config.js";

const app = express();
const expressServer = app.listen(config.PORT, async () => {
  console.log(`App activa en puerto ${config.PORT} conectada a DB`);
  await mongoose.connect(config.ATLAS_URI);

  const socketServer = initSocket(expressServer);
  app.set("socketServer", socketServer);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/static", express.static(`${config.DIRNAME}/public`));

  app.engine("handlebars", handlebars.engine());
  app.set("views", `${config.DIRNAME}/views`);
  app.set("view engine", "handlebars");

  app.use("/", viewsRouter);
  app.use("/", moviesRoutes);
});
