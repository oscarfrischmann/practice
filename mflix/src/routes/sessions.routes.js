import { Router } from "express";
import config from "../config.js";
import Manager from "../dao/manager.mdb.js";
const router = Router();
const manager = new Manager();
const loginAuth = (req, res, next) => {
  // ?: operador opcional: si no existe el objeto req.session.user o el role no es admin
  // if (!req.session.user || req.session.user.role !== 'admin')
  if (req.session.user) return res.redirect("/movies");
  return res.redirect("/");

  next();
};

router.post("/api/login", async (req, res) => {
  try {
    const { user, password } = req.body;
    const match = await manager.findUser({ user: user });

    if (match.user === user && match.password === password) {
      req.session.user = { user: match.user, email: match.email };
      console.log("match");
      res.redirect("/mov");
    } else {
      console.log("no match");

      res.redirect(`/?error=true`);
    }
  } catch (err) {
    throw new Error(err);
  }
});

router.post("/api/register", async (req, res) => {
  try {
    const { user, password, email } = req.body;
    await manager.createUser({ user: user, password: password, email: email });
    res.redirect("/");
  } catch (err) {
    throw new Error(err);
  }
});

export default router;
