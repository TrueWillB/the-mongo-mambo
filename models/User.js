const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/gm,
    },
    thoughts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Thought" }],
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

//This creates the virtual property friendCount and populates it with the number of friends
userSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

const User = mongoose.model("User", userSchema);

//This seeds the database if there's nothing in it
User.find({})
  .exec()
  .then(async (collection) => {
    if (collection.length === 0) {
      const results = await User.insertMany([
        { username: "testUser1", email: "test1@test.com" },
        { username: "testUser2", email: "test2@test.com" },
      ]);
      return console.log("Users inserted:", results);
    }
    return console.log("Users found, NOT inserted:", collection);
  })
  .catch((err) => console.log(err));

module.exports = User;
