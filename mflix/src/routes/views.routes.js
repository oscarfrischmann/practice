import { Router } from "express";
import moviesModel from "../dao/models/movies.model.js";
import MovieManager from "../dao/manager.mdb.js";
import countriesModel from "../dao/models/countries.model.js";
import config from "../config.js";

const router = Router();
const manager = new MovieManager();
const login = async (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    return res.redirect("/");
  }
};
router.get("/", async (req, res) => {
  console.log(req.session.user);
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

router.get("/mov", login, async (req, res) => {
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
    console.log(countries);
    res.render("movies", {
      movies: data,
      countries: countries,
      user: req.session.user,
    });
  } catch (err) {
    throw new Error(err);
  }
});
router.post("/create", async (req, res) => {
  try {
    const paises = req.body;
    await countriesModel.insertMany({ countries: paises });
    res.send({ payload: paises });
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
  let currentPage;
  console.log(currentPage);
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
    console.log(byCountry);
    res.render("byCountry", { movies: byCountry });
  } catch (error) {
    throw new Error(err);
  }
});

export default router;
