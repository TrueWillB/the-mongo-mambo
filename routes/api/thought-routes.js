const router = require("express").Router();
const { Thought, User } = require("../../models");
const db = require("../../config/connection");

router.get("/", async (req, res) => {
  try {
    const result = await Thought.find({});
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const postingThought = await Thought.create(req.body);
    const user = await User.findOneAndUpdate(
      { username: req.body.username },
      { $addToSet: { thoughts: postingThought._id } },
      { new: true }
    );
    if (!user) {
      res.status(404).json({
        message: "No user found with this username! Orphan thought created",
      });
    }
    res.status(200).json({ message: "Thought created and linked to user" });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
