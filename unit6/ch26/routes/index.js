const router = require("express").Router(),
  userRoutes = require("./userRoutes"),
  subscriberRoutes = require("./subscriberRoutes"),
  courseRoutes = require("./courseRoutes"),
  //homeRoutes = require("./homeRoutes"),
  errorRoutes = require("./errorRoutes");

//Note: order matters!
//Note 2: You are creating namespaces for these routes essentially
router.use("/users", userRoutes);
router.use("/subscribers", subscriberRoutes);
router.use("/courses", courseRoutes);
//router.use("/", homeRoutes);
router.use("/", errorRoutes);

module.exports = router;
