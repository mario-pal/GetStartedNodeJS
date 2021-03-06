const express = require("express"),
  app = express(),
  //controllers
  homeController = require("./controllers/homeController"),
  errorController = require("./controllers/errorController"),
  //layout
  layouts = require("express-ejs-layouts");

app.set("view engine", "ejs");
app.use(layouts);

//enable/ease static file assets (affects image file paths in ejs files in views)
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
});
