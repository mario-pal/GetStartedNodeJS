const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/recipedb", {
  useNewUrlParser: true
});
mongoose.Promise = global.Promise; //needed for using promises to handle errors (and to use promise chains)
//const db = mongoose.connection;

/*db.once("open", () => {
  console.log("connected to MongoDB using Mongoose!");
});
/*

/*const MongoDB = require("mongodb").MongoClient,
  dbURL = "mongodb://localhost:27017",
  dbName = "recipedb";

MongoDB.connect(dbURL, (error, client) => {
  if (error) throw error;
  let db = client.db(dbName);
  let dbCol = db.collection("contacts");
  dbCol.find().toArray((error, data) => {
    if (error) throw error;
    console.log(data);
  });
  dbCol.insert(
    {
      name: "Fred",
      note: "rhap"
    },
    (error, db) => {
      if (error) throw error;
      console.log(db);
    }
  );
});*/

const express = require("express"),
  app = express(),
  //controllers
  homeController = require("./controllers/homeController"),
  errorController = require("./controllers/errorController"),
  usersController = require("./controllers/usersController"),
  subscribersController = require("./controllers/subscribersController"),
  coursesController = require("./controllers/coursesController"),
  //layout
  layouts = require("express-ejs-layouts"),
  //router
  router = express.Router(),
  //to enable this express app to interpret put requests
  methodOverride = require("method-override"),
  //session management
  expressSession = require("express-session"), //sessions contain data about the most recent interaction between a user and an application
  cookieParser = require("cookie-parser"),
  connectFlash = require("connect-flash"); //this package is dependent on sessions and cookies to pass flash messages between requests

app.set("view engine", "ejs");
app.use(layouts);

//enable/ease static file assets
app.use(express.static("public"));

app.set("port", process.env.PORT || 3000);

//body parsing
app.use(
  express.urlencoded({
    extended: false
  })
);

app.use(express.json());

//routes
/*app.get("/", (req, res) => {
  res.send("Welcome to  Kitchen Pal!");
});
//app.get("/recipes", homeController.showRecipes);
//app.get("/contact", homeController.showSignUp);
//app.post("/contact", homeController.postedSignUpForm);
//app.get("/users", usersController.index);
*/

//app.use("/", router) should be used after all other configuration is done.
//if not, there could be error in parsing the request body for example.
//try moving app.use("/", router) to the top after the const declarations and update a user's profile...
//...there will be a bug where req.body is undefined
app.use("/", router); //this tells this Express.js application to use the router object...
//...as a system for middleware and routing

router.use(cookieParser("HaHaULose")); //this indicates that you want to use cookies and that you want your sessions to parse cookie data sent back
//cookieParser uses the code in its argument to encrypt your data  in cookies sent to the browser
router.use(
  expressSession({
    //youre telling express-sessions that you wasnt it to use cookies as its storage method
    //espressSessions is necessary to pass messages between the application and the client. You can store masages in a user's browser in many ways including cookies
    secret: "HaHaULose", //this secret key should be stored in an environment variable...this will be changed in unit 8 (same with the cookieParser)
    cookie: {
      //cookies are a form of session storage
      maxAge: 4000000 //expire cookies after about an hour
    },
    resave: false, //specifies that you dont want to update existing session data on the server if nothing has changed in the existibng session
    saveUninitialized: false //specifiess that you dont want to send a cookie to a user if no messages are added to the session
  })
);
router.use(connectFlash()); //flash messages display inofrmation to users of an application. They travel to user's browser from your server
//...as part of a session.

router.use((req, res, next) => {
  //this middleware configuration treats connectFlash messages like a local variable on the response
  res.locals.flashMessages = req.flash(); //a flash message is no different from a local variable being available to the view.
  next(); //to show potential success and error flash messages I add the code to display those messages in layout.ejs
});
//end of session management

router.use(
  /*configure the application router to use methodOverride as middleware.
  Express.js receives the HTML form submissions as POST since the method attribute in the form tag,
  is set to POST in edit.ejs. We could have simply set the method ="PUT" however support,
  from browsers for PUT (and DELETE) is rare source: HTML&CSS the complete reference Thomas A. Powell
  Method override is simply one solution out of many to address this limitation.
  */

  methodOverride("_method", {
    //look for the _method query parameter in the url and interpret
    methods: ["POST", "GET"] //the request by using the method specified by the paramter
  })
);
//-------------------------------------USERS------------------------------------
router.get("/users", usersController.index, usersController.indexView); //decoupled version from users app.get above
router.get("/users/new", usersController.new); //note: ommiting the leading '/' in "/users/new"...
//...will make this route not work(this is true for any route)
router.post(
  "/users/create",
  usersController.create,
  usersController.redirectView
);
router.get("/users/login", usersController.login); //route to view login page
router.post(
  "/users/login",
  usersController.authenticate,
  usersController.redirectView
);
//the :id parameter will be filled with the user's ID passing in from the index page
//note: you can change the name of the :id paramter as long as you're consistent in your other code
//extra note: now all paths /users/* that dont already have a specific router will lead to a 500 error...
//...for example if the /users/login path was listed after /users/:id then login would be interpreted as an id by Express.js
router.get("/users/:id", usersController.show, usersController.showView);

router.get("/users/:id/edit", usersController.edit);
router.put(
  "/users/:id/update",
  usersController.update,
  usersController.redirectView
);
router.delete(
  "/users/:id/delete",
  usersController.delete,
  usersController.redirectView
);
//-------------------------------------SUBSCRIBERS------------------------------------
router.get(
  "/subscribers",
  subscribersController.index,
  subscribersController.indexView
);
//===============
router.get("/subscribers/new", subscribersController.new);
router.post(
  "/susbcribers/create",
  subscribersController.create,
  subscribersController.redirectView
);
//===============
router.get(
  "/subscribers/:id",
  subscribersController.show,
  subscribersController.showView
);
//===============
router.get("/subscribers/:id/edit", subscribersController.edit);
router.put(
  "/susbcribers/:id/update",
  subscribersController.update,
  subscribersController.redirectView
);
//===============
router.delete(
  "/subscribers/:id/delete",
  subscribersController.delete,
  subscribersController.redirectView
);
//-------------------------------------COURSES------------------------------------
router.get("/courses", coursesController.index, coursesController.indexView);
//================
router.get("/courses/new", coursesController.new);
router.post(
  "/courses/create",
  coursesController.create,
  coursesController.redirectView
);
//================
router.get("/courses/:id", coursesController.show, coursesController.showView);
//================
router.get("/courses/:id/edit", coursesController.edit);
router.put(
  "/courses/:id/update",
  coursesController.update,
  coursesController.redirectView
);
//================
router.delete(
  "/courses/:id/delete",
  coursesController.delete,
  coursesController.redirectView
);

//error handling routes
app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

//listen
app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
