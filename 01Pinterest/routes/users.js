const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/usersData");

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
    type: mongoose.Schema.Types.ObjectId,
    ref: "Posts"
  }
]
});

userSchema.plugin(plm);

module.exports = mongoose.model("User", userSchema);
