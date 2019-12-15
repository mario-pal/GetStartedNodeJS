const subscribersController = require("./controllers/subscribersController");
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
  //layout
  layouts = require("express-ejs-layouts"),
  //router
  router = express.Router(),
  //to enable this express app to interpret put requests
  methodOverride = require("method-override");

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
app.get("/s", subscribersController.getAllSubscribers);
app.get("/contact", subscribersController.getSubscriptionPage);
app.post("/subscribe", subscribersController.saveSubscriber);
//app.get("/users", usersController.index);
*/

//app.use("/", router) should be used after all other configuration is done.
//if not, there could be error in parsing the request body for example.
//try moving app.use("/", router) to the top after the const declarations and update a user's profile...
//...there will be a bug where req.body is undefined
app.use("/", router); //this tells this Express.js application to use the router object...
//...as a system for middleware and routing

router.get("/users", usersController.index, usersController.indexView); //decoupled version from users app.get above

router.get("/users/new", usersController.new); //note: ommiting the leading '/' in "/users/new"...
//...will make this route not work(this is true for any route)
router.post(
  "/users/create",
  usersController.create,
  usersController.redirectView
);
//the :id parameter will be filled with the user's ID passing in from the index page
//note: you can change the name of the :id paramter as long as you're consistent in your other code
//extra note: now all paths /users/* that dont already have a specific router will lead to a 500 error
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

//error handling routes
app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

//listen
app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
