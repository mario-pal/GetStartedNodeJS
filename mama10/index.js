const port = 3000,
  express = require("express"),
  app = express(),
  homeController = require("./controllers/homeController"),
  layouts = require("express-ejs-layouts");

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
