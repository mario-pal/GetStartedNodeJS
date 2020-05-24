const router = require("express").Router(),
  userRoutes = require("./userRoutes"),
  subscriberRoutes = require("./subscriberRoutes"),
  courseRoutes = require("./courseRoutes"),
  //homeRoutes = require("./homeRoutes"),
  errorRoutes = require("./errorRoutes"),
  apiRoutes = require("./apiRoutes");

//Note: order matters!
//Note 2: You are creating namespaces for these routes essentially
router.use("/users", userRoutes);
router.use("/subscribers", subscriberRoutes);
router.use("/courses", courseRoutes);
router.use("/api", apiRoutes);
//New routes with namespaces must be added above this line. Order matters...
//...The error and home routes are namespaced for /, meaning that any URL enetered that...
//...does not match a route name before reaching the error or home routes defaults to an error page
//router.use("/", homeRoutes);
router.use("/", errorRoutes);

module.exports = router;
