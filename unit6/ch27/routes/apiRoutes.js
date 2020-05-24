//This module will contain all the api routes with json response bodies
const router = require("express").Router(),
coursesController = require("../controllers/coursesController");

router.get("/courses", coursesController.index, coursesController.filterUserCourses, coursesController.respondJSON);
router.get("/courses/:id/join", coursesController.join, coursesController.respondJSON);
/*If an action doesnt explicitly respond to the client, the connection is still open,
  and the request continues to flow through the chain of middleware functions. Typically,
  this situation means that an error has occured, and that error will propagate through 
  until error-handling middleare catches it */
router.use(coursesController.errorJSON);

module.exports = router;