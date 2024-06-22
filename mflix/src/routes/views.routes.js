import { Router } from "express";
import model from "../dao/models/movies.model.js";
const router = Router();

router.get("/", async (req, res) => {
  let data;
  try {
    data = await model.find().limit(10).lean();
    res.render("movies", { movies: data });
  } catch (err) {
    throw new Error(err);
  }
});

export default router;
