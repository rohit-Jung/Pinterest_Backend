var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var expressSession = require("express-session");
var logger = require("morgan");
var flash = require("connect-flash")

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const passport = require("passport");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");



// flash used for flash messages so that the message could be passed from one route to the other
app.use(flash());
//expressSession is used to establish the session
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: "hi",
  })
);
//passport is initialized and then the session is created for it
app.use(passport.initialize());
app.use(passport.session());

// SerializeUser method of Passport.js is utilized to customize serialization of user objects for session storage
// The next line invokes a custom serialization function for the user object,
// provided by the passport-local-mongoose (plm) plugin, to ensure a unique identifier for session storage
passport.serializeUser(usersRouter.serializeUser());

// DeserializeUser method of Passport.js is utilized to retrieve user information from session storage
// The next line invokes a custom deserialization function for the user object,
// provided by the passport-local-mongoose (plm) plugin, to retrieve user data from session storage
passport.deserializeUser(usersRouter.deserializeUser());




// Enable logging middleware in development mode
app.use(logger("dev"));
// Enable middleware to parse JSON data sent in requests
app.use(express.json());
// Enable middleware to parse URL-encoded data in requests, allowing encoded characters like spaces
app.use(express.urlencoded({ extended: false }));
// Enable middleware to parse cookies stored in the user's browser
app.use(cookieParser());
// Enable middleware to serve static assets from the 'public' folder
app.use(express.static(path.join(__dirname, "public")));


app.use("/", indexRouter);
app.use("/users", usersRouter);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});



// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
