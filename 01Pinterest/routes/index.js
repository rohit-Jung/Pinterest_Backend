var express = require("express");
const passport = require("passport");
var router = express.Router();
const User = require("./users");
const upload = require("./multer");
const postModel = require("./posts");

//Whenever req.body is done the variable there is available as a result of variables passed in the form in ejs page.
//to ensure this properly works the name in the input field of form must be made same to the variable it is requesting from body.


//since the passportJs package itself lacks the local strategy, we used passport-local to create one
var localStrategy = require("passport-local");
//this local strategy is binded and used with passportJs here to authenticate User model
passport.use(new localStrategy(User.authenticate()));



/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Pinterest Project" });
});



//isLoggedIn is a  middleware that verifies only the logged in user can create posts.
router.get("/createpost", isLoggedIn, function (req, res, next) {
  res.render("createpost");
});



//isLoggedIn here verifies only the logged in user can go to their feed section.
router.get("/feed", isLoggedIn, async function (req, res, next) {
  //finding the Logged In User's Data according to their username
  //Since the user is logged in, his information is saved in req.session.passport.user
  //This is done to pass the username to the nav bar in the web page.
  var userData = await User.findOne({
    username: req.session.passport.user,
  });

  //Finding all the users and populating their posts [section]
  //we could use this populated array and extract the image to display all the posts in the feed section.
  var allUsers = await User.find().populate("posts");
  res.render("feed", { userData, allUsers });
});



router.get("/login", function (req, res, next) {
  //Here the flash gives error messages when the user enters an invalid details.
  //This message is here because we did {failureFlash: true} in post route of login
  //To display the message in the UI we passed it to the login page
  var errorMsg = req.flash("error");
  res.render("login", { error: errorMsg });
});



//Here first login is verified by isLoggedIn middleware
//then another middleware upload.single("file") uploads the file using multer package set up in multer.js
router.post(
  "/fileUpload",
  isLoggedIn,
  upload.single("file"),

  //Logged In user's data is find according to username so that the uploaded file can be saved to his documents in database
  async function (req, res, next) {
    const userData = await User.findOne({
      username: req.session.passport.user,
    });

    //finding the user's profile image and updating it the file contains the filename setup in multer.js
    userData.profileImage = req.file.filename;
    //since we are updating data manually we also need to save the document manually
    //await is used because time of saving data is not fixed
    await userData.save();
    res.redirect("/profile");
  }
);



//createpost's middleware are very similar to the above one as it is also using multer to upload files
router.post(
  "/createpost",
  isLoggedIn,
  upload.single("postedFile"),
  async function (req, res, next) {
    const userData = await User.findOne({
      username: req.session.passport.user,
    });

    //creating a post in postModel and supplying the needed information of loggedIn user
    const post = await postModel.create({
      users: userData._id,
      title: req.body.title,
      image: req.file.filename,
      description: req.body.description,
    });

    //pushing the post id to userData to store the information of the post done by the user
    userData.posts.push(post._id);
    //saving the information manually because we updated it manually
    await userData.save();
    res.redirect("/profile");
  }
);



//the middleware here makes sure that only the logged in user can access the profile route
router.get("/profile", isLoggedIn, async function (req, res, next) {
  //finding the logged in user using findOne and the information saved in session
  //here the posts array is populated so that detailed information of user is saved in userData
  //now the data in userData can be further used to show user his/her own posts in the profile page/route
  var userData = await User.findOne({
    username: req.session.passport.user,
  }).populate("posts");

  res.render("profile", { userData });
});
router.get("/register", function (req, res, next) {
  res.render("register");
});



router.post("/register", function (req, res) {
  //Taking the required data passed from the form in the userData variable (except password)
  let userData = new User({
    username: req.body.username,
    email: req.body.email,
    birthDate: req.body.birthDate,
  });

  //using register method of passportJs to register all the data of user taken just above using req.body according to the password provided
  User.register(userData, req.body.password).then(function () {
    //after registering, authentication is done using passportJs local strategy
    //this local strategy is given by passport-local which is used by passportJs at starting of this code
    passport.authenticate("local")(req, res, function () {
      res.redirect("/profile");
    });
  });
});


//the passport.authenticate middleware here checks the user based upon local strategy and then redirects accordingly
//failureFlash is enabled to pass flash (error) messages to the get route of login  on invalid details
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (req, res) {}
);


//using the logout method to logout and then redirect to "/" page if successfully logged out else handle function accordingly
router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});


//isLoggedIn middleware is used to verify if the user is logged in or not using the isAuthenticated method
//this middleware is used widely above in different routes as to assure if the user is logged in or not to give access to the routes accordingly
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

//exporting the router to use in other files
module.exports = router;
