import { Router } from "express";
import moviesModel from "../dao/models/movies.model.js";
import MovieManager from "../dao/manager.mdb.js";
import countriesModel from "../dao/models/countries.model.js";
import fs from "fs";
import config from "../config.js";

const router = Router();
const manager = new MovieManager();

router.get("/", async (req, res) => {
  try {
    if (req.query.error) {
      res.render("login", { origin: "login", error: true });
    } else {
      res.render("login", { origin: "login" });
    }
  } catch (err) {
    throw new Error(err);
  }
});

router.get("/mov", async (req, res) => {
  let currentPage;
  if (req.query) {
    currentPage = req.query;
  } else {
    currentPage = "1";
  }
  try {
    const countries = await countriesModel.findOne({}).lean();
    const data = await moviesModel.paginate(
      {},
      { limit: 8, lean: true, page: +currentPage.page }
    );
    res.render("movies", { movies: data, countries: countries });
  } catch (err) {
    throw new Error(err);
  }
});

router.get("/mov/one/:movid", async (req, res) => {
  try {
    const data = await moviesModel.findOne({ _id: req.params.movid }).lean();
    const countries = await manager.getCountries();
    res.render("movie", { movie: data, countries: countries });
  } catch (err) {
    throw new Error(err);
  }
});

router.get("/mov/country", async (req, res) => {
  console.log("by country");
  let currentPage;
  const { country, page } = req.query;
  if (page) {
    currentPage = +page;
  } else {
    currentPage = "1";
  }
  console.log(country, currentPage);

  try {
    const byCountry = await moviesModel.paginate(
      { countries: country },
      { limit: 8, lean: true, page: +currentPage }
    );
    res.render("movies", { movies: byCountry });
  } catch (error) {
    throw new Error(err);
  }
});

router.get("/delete/:toClean", async (req, res) => {
  const toClean = req.params.toClean;
  try {
    console.log(toClean);
    const moviesToDelete = await model.paginate(
      { toClean: { $exists: false } },
      { limit: 20 }
    );
    res.render("movies", { movies: moviesToDelete });
  } catch (err) {
    throw new Error(err);
  }
});

export default router;
