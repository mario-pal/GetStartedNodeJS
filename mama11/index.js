const port = 3000,
  express = require("express"),
  app = express(),
  homeController = require("./controllers/homeController"),
  layouts = require("express-ejs-layouts"),
  errorController = require("./controllers/errorController");

app.set("view engine", "ejs");

//middleware
app.use(layouts);

/*app.use("/recipe", (req, res, next) => {
  console.log(`request mode to: ${req.url}`);
  next();
});*/
app.get("/name/:myName", homeController.respondWithName);
app.use(
  express.urlencoded({
    extended: false
  })
);

app.use(express.json());

//To more easily serve static files
app.use(express.static("public"));

app
  .get("/", (req, res) => {
    //let meal = req.params.meal;
    //res.send(`This is the page for ${meal}`);
    console.log(req.query);
  })
  .post("/", (req, res) => {
    console.log(req.body);
    console.log(req.query);
    res.send("POST Successful!\n");
  })
  .listen(port, () => {
    console.log(
      `The Express.js server has started and is listening on port number ${port}`
    );
  });
//error loggging middleware
//app.use(errorController.logErrors);
app.use(errorController.respond404);
app.use(errorController.respond500);
