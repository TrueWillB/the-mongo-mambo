const mongoose = require("mongoose");

const reactionSchema = new mongoose.Schema(
  {
    reactionID: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      maxLength: 280,
    },
    username: {
      type: String,
      required: true,
      ref: "User",
    },
    createdAt: {
      type: Date,
      default: Date.now,
      // Use a getter method to format the timestamp on query
      get: (createdAtVal) => {
        const formattedDate = new Date(createdAtVal).toLocaleDateString(
          "en-us",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        );
        const formattedTime = new Date(createdAtVal).toLocaleTimeString(
          "en-us",
          {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          }
        );
        return `${formattedDate} at ${formattedTime}`;
      },
    },
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

const thoughtSchema = new mongoose.Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      // Use a getter method to format the timestamp on query
      // get: (createdAtVal) => dateFormat(createdAtVal) //I believe there's a dateFormat npm package
      get: (createdAtVal) => {
        const formattedDate = new Date(createdAtVal).toLocaleDateString(
          "en-us",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        );
        const formattedTime = new Date(createdAtVal).toLocaleTimeString(
          "en-us",
          {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          }
        );
        return `${formattedDate} at ${formattedTime}`;
      },
    },
    username: {
      type: String,
      required: true,
      ref: "User",
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

const Thought = mongoose.model("Thought", thoughtSchema);
module.exports = Thought;
