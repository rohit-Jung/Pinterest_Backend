const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

//connecting to the MongoDB database using local host
mongoose.connect("mongodb://127.0.0.1:27017/usersData"); //the name after last slash (/) is the database name

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  profileImage: {
    type: String,
  },
  posts: [
    {
      //passing each post ObjectId from the Posts model reference
      //This is done to associate data with each other so that they could be identified and searched easily
      type: mongoose.Schema.Types.ObjectId,
      ref: "Posts",
    },
  ],
});


//using the plugin plm(passport-local-mongoose) that helps enable features like hashed and salted passwords
//it also provides methods like serializeUser, deserializeUser, register, authenticate that seamlessly integrate with passportJs
//also gives unique indexes for username and password fields
userSchema.plugin(plm);

module.exports = mongoose.model("User", userSchema);
