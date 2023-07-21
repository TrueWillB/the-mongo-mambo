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
    // const postingThought = await Thought.create(req.body);

    // if (req.body.userId) {
    //   //If the user ID supplied does not exist, the thought will not be created
    //   if (!User.findOne({ _id: req.body.userId })) {
    //     res.status(404).json({
    //       message: "No user found with this username/id! Thought not created",
    //     });
    //   } else {
    //     const postingThought = await Thought.create(req.body);
    //     const user = await User.findOneAndUpdate(
    //       { _id: req.body.userId },
    //       { $addToSet: { thoughts: postingThought._id } },
    //       { new: true }
    //     );
    //   }
    // } else
    if (req.body.username) {
      //This does take extra time in an api call, but I it ensures that you don't enter an incorrect username and create an orphaned thought
      if (!(await User.findOne({ username: req.body.username }))) {
        res.status(404).json({
          message: "No user found with this username/id! Thought not created",
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
        message: "No username or userId supplied, thought not created",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
