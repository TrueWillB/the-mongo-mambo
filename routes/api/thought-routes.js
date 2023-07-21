const router = require("express").Router();
const { Thought, User } = require("../../models");
const db = require("../../config/connection");

//Route to get all routes
router.get("/", async (req, res) => {
  try {
    const result = await Thought.find({});
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//route to get one route by its _id
router.get("/:thoughtId", async (req, res) => {
  try {
    const result = await Thought.findOne({ _id: req.params.thoughtId });
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//According to instructions I was given, the route to post thoughts needs to use the user's username to post the thought, not the user's _id
//This route also ensures that a username is supplied and is valid
router.post("/", async (req, res) => {
  try {
    if (req.body.username) {
      //This does take extra time in an api call, but I it ensures that you don't enter an incorrect username and create an orphaned thought
      if (!(await User.findOne({ username: req.body.username }))) {
        res.status(404).json({
          message: "No user found with this username Thought not created",
        });
      } else {
        const postingThought = await Thought.create(req.body);
        const user = await User.findOneAndUpdate(
          { username: req.body.username },
          { $addToSet: { thoughts: postingThought._id } },
          { new: true }
        );
        res.status(200).json({
          message: `Thought created and linked to user: ${req.body.username} `,
        });
      }
    } else {
      res.status(400).json({
        message:
          "No username supplied, thought not created. Please supply valid username",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//route to update a thought by its _id
router.put("/:thoughtId", async (req, res) => {
  try {
    const result = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      req.body,
      { new: true } //returns the updated document, not the original document
    );
    res.status(200).json(`Thought ${req.params.thoughtId} updated: ${result}`);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//route to delete a thought by its _id and remove the thought from the associated user's thoughts
router.delete("/:thoughtId", async (req, res) => {
  try {
    const result = await Thought.findOneAndDelete({
      _id: req.params.thoughtId,
    });
    await User.findOneAndUpdate(
      { username: result.username },
      { $pull: { thoughts: req.params.thoughtId } }
    );
    res.status(200).json(`Thought ${req.params.thoughtId} deleted`);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//This is the route to add a reaction to a thought
router.post("/:thoughtId/reactions", async (req, res) => {
  try {
    const result = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { new: true }
    );
    res.status(200).json(`Reaction added to thought ${req.params.thoughtId}`);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//This is the route to delete and pull a reaction from a thought
router.delete("/:thoughtId/reactions", async (req, res) => {
  try {
    const result = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { _id: req.body.reactionId } } },
      { new: true }
    );
    res
      .status(200)
      .json(
        `Reaction ${req.body.reactionId} deleted from thought ${req.params.thoughtId}`
      );
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
