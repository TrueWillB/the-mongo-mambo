// const mongoose = require("mongoose");

// const reactionSchema = new mongoose.Schema({
//   reactionID: {
//     type: mongoose.Schema.Types.ObjectId,
//     default: () => new Types.ObjectId(),
//   },
//   reactionBody: {
//     type: String,
//     required: true,
//     maxLength: 280,
//   },
//   username: {
//     type: String,
//     required: true,
//     ref: "User",
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now(),
//     // Use a getter method to format the timestamp on query
//     get: (createdAtVal) => dateFormat(createdAtVal, "dddd, mmmm dS, yyyy"), //I believe there's a dateFormat npm package
//   },
// });

// const Reaction = mongoose.model("Reaction", reactionSchema);

// module.exports = Reaction;
