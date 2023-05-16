const express = require("express");
const User = require("../models/User");
const router = express.Router({ mergeParams: true });
const passport = require("passport");
const users = require("../controllers/users");
const catchAsync = require("../utils/catchAsync");

router.route("/register").get(users.renderRegister).post(users.register);

router
  .route("/login")
  .get(users.renderLogin)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
      keepSessionInfo: true,
    }),
    catchAsync(users.login)
  );

router.get("/logout", users.logout);

module.exports = router;
