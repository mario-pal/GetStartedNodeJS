//const mongoose = require("mongoose");//moved to subscriber.js in models folder
const Subscriber = require("./models/subscriber");
mongoose.connect("mongodb://localhost:27017/recipedb", {
  useNewUrlParser: true
});
const db = mongoose.connection;

db.once("open", () => {
  console.log("connected to MongoDB using Mongoose!");
});

/*const subscriberSchema = mongoose.Schema({//moved to subscriber.js
  name: String,
  email: String,
  zipCode: Number
});*/

//const Subscriber = mongoose.model("Subscriber", subscriberSchema);//moved to subscriber.js

var s1 = new Subscriber({
  name: "Jon",
  email: "hi"
});

s1.save((error, savedDocument) => {
  if (error) console.log(error);
  console.log(savedDocument);
});
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

/*const express = require("express"),
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
app.get("/contact", homeController.showSignUp);
app.post("/contact", homeController.postedSignUpForm);

//error handling routes
app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

//listen
app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});*/
