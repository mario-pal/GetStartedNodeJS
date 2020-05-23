const router = require("express").Router(),
  usersController = require("../controllers/usersController");

//with the following routes, notice that "users" is left out of the path...
//...it's defined in index.js

router.get("/", usersController.index, usersController.indexView);
router.get("/new", usersController.new); //note: ommiting the leading '/' in "/users/new"...
//...will make this route not work(this is true for any route)
router.post(
  "/create",
  usersController.validate, //handle requests before they reach the create action
  usersController.create,
  usersController.redirectView
);
router.get("/login", usersController.login); //route to view login page
router.post(
  "/login",
  usersController.authenticate //,
  //usersController.redirectView//usersController.redirectView no longer needed if using passport.js autheticate method in usersController
);
router.get("/logout", usersController.logout, usersController.redirectView);
//the :id parameter will be filled with the user's ID passing in from the index page
//note: you can change the name of the :id paramter as long as you're consistent in your other code
//extra note: now all paths /users/* that dont already have a specific router will lead to a 500 error...
//...for example if the /users/login path was listed after /users/:id then login would be interpreted as an id by Express.js
router.get("/:id", usersController.show, usersController.showView);

router.get("/:id/edit", usersController.edit);
router.put("/:id/update", usersController.update, usersController.redirectView);
router.delete(
  "/:id/delete",
  usersController.delete,
  usersController.redirectView
);

module.exports = router; //the absence of this will cause an error like the following in index.js
//TypeError: Router.use() requires a middleware function but got a Object
