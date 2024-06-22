import { Router } from "express";
import config from "../config.js";
import model from "../dao/models/movies.model.js";
import { uploader } from "../uploader.js";

const router = Router();

router.get("/movies", async (req, res) => {
  try {
    const movies = await model.find().limit(1).lean();

    res
      .status(200)
      .send({ origin: 'get from "movies.routes.js"', payload: movies });
  } catch (err) {
    res
      .status(500)
      .send({ origin: config.SERVER, payload: null, error: err.message });
  }
});

export default router;
