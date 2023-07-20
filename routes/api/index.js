const router = require("express").Router();
const userRoutes = require("./user-routes.js");
const thoughtRoutes = require("./thought-routes.js");
const reactionRoutes = require("./reaction-routes.js");

router.use("/users", userRoutes);
router.use("/thoughts", thoughtRoutes);
router.use("/reactions", reactionRoutes);

module.exports = router;
