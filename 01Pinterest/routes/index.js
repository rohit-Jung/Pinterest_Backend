var express = require("express");
const passport = require("passport");
var router = express.Router();
const User = require("./users");
const upload = require("./multer");
const postModel = require("./posts");

var localStrategy = require("passport-local");
const posts = require("./posts");
passport.use(new localStrategy(User.authenticate()));

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Pinterest Project" });
});
router.get("/createpost", isLoggedIn, function (req, res, next) {
  res.render("createpost");
});

router.get("/feed", isLoggedIn, async function (req, res, next) {
  var userData = await User.findOne({
    username: req.session.passport.user,
  });
  var allUsers = await User.find().populate("posts");
  res.render("feed", { userData, allUsers });
});

router.get("/login", function (req, res, next) {
  var errorMsg = req.flash("error");
  res.render("login", { error: errorMsg });
});

router.post(
  "/fileUpload",
  isLoggedIn,
  upload.single("file"),
  async function (req, res, next) {
    const userData = await User.findOne({
      username: req.session.passport.user,
    });

    userData.profileImage = req.file.filename;
    await userData.save();
    res.redirect("/profile");
  }
);

router.post(
  "/createpost",
  isLoggedIn,
  upload.single("postedFile"),
  async function (req, res, next) {
    const userData = await User.findOne({
      username: req.session.passport.user,
    });

    const post = await postModel.create({
      users: userData._id,
      title: req.body.title,
      image: req.file.filename,
      description: req.body.description,
    });
    userData.posts.push(post._id);
    await userData.save();
    res.redirect("/profile");
  }
);
router.get("/profile", isLoggedIn, async function (req, res, next) {
  var userData = await User.findOne({
    username: req.session.passport.user,
  }).populate("posts");

  res.render("profile", { userData });
});
router.get("/register", function (req, res, next) {
  res.render("register");
});

router.post("/register", function (req, res) {
  let userData = new User({
    username: req.body.username,
    email: req.body.email,
    birthDate: req.body.birthDate,
  });

  User.register(userData, req.body.password).then(function () {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/profile");
    });
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (req, res) {}
);
router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
module.exports = router;
