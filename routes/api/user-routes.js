const router = require("express").Router();
const { User } = require("../../models");
const db = require("../../config/connection");
const { cp } = require("fs");

router.get("/", async (req, res) => {
  try {
    const result = await User.find({});
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/:userId", async (req, res) => {
  try {
    //populate fills in the the "thoughts" array on the returned user object with data from the "findeOne" query
    const result = await User.findOne({ _id: req.params.userId }).populate(
      "thoughts"
    );
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const result = await User.create(req.body);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
module.exports = router;

//This function adds friends to a user and updates the other user's friends list as well
router.post("/:userId/friends/:friendId", async (req, res) => {
  try {
    const result = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { new: true } //returns the updated document, not the original document
    );
    // console.log(req.body.friends);
    await User.findOneAndUpdate(
      { _id: req.params.friendId },
      { $addToSet: { friends: req.params.userId } }
    );

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.delete("/:userId/friends/:friendId", async (req, res) => {
  try {
    const result = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: { $in: req.params.friendId } } }, //$in tells it to remove all instances of the ids in req.body.friends
      { new: true } //returns the updated document, not the original document
    );
    //This deletes the links in the other user. Unfriended smh :(
    await User.findOneAndUpdate(
      { _id: req.params.friendId },
      { $pull: { friends: { $in: req.params.userId } } }
    );

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
