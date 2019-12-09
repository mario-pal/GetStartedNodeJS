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
  //layout
  layouts = require("express-ejs-layouts");

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
app.get("/", (req, res) => {
  res.send("Welcome to  Kitchen Pal!");
});
app.get("/recipes", homeController.showRecipes);
//app.get("/contact", homeController.showSignUp);
//app.post("/contact", homeController.postedSignUpForm);
app.get("/s", subscribersController.getAllSubscribers);
app.get("/contact", subscribersController.getSubscriptionPage);
app.post("/subscribe", subscribersController.saveSubscriber);

//error handling routes
app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

//listen
app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
