const mongoose = require("mongoose"); //see bottom of page 304 to learn how to run mongo on terminal

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/recipedb",
  {
    useNewUrlParser: true,
  }
); //added for heroku deployment
mongoose.Promise = global.Promise; //needed for using promises to handle errors (and to use promise chains)

const express = require("express"),
  app = express(),
  router = require("./routes/index"),
  //layout
  layouts = require("express-ejs-layouts"),
  //to enable this express app to interpret put requests
  methodOverride = require("method-override"),
  //session management
  expressSession = require("express-session"), //sessions contain data about the most recent interaction between a user and an application
  cookieParser = require("cookie-parser"),
  connectFlash = require("connect-flash"), //this package is dependent on sessions and cookies to pass flash messages between requests
  //user data entry validation
  expressValidator = require("express-validator"),
  passport = require("passport");

//note: middleware added within express.js gives the request object access to a library of methods...
//...These methods are extended to the request as it enters the application. As the request is passed through the...
//...middleware chain, you can call these middleware methods (e.g. passport.js methods) anywhere you like.
app.set("view engine", "ejs");
app.use(layouts);

//enable/ease static file asset access
app.use(express.static("public"));

app.set("port", process.env.PORT || 3000);

const server = app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
}); //listening placed here for heroku deployment

//body parsing
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(express.json());

app.use(expressValidator()); //this must be added after express.json() and express.urlencoded() middleware is introduced...
//...since the request body must be parsed before it can be validated...you must also install express-validator 5.3 or before to use...
//...express-validator as a function in this way

app.use(cookieParser("HaHaULose")); //this indicates that you want to use cookies and that you want your sessions to parse cookie data sent back
//cookieParser uses the code in its argument to encrypt your data  in cookies sent to the browser
app.use(
  expressSession({
    //youre telling express-sessions that you wasnt it to use cookies as its storage method
    //espressSessions is necessary to pass messages between the application and the client. You can store masages in a user's browser in many ways including cookies
    secret: "HaHaULose", //this secret key should be stored in an environment variable...this will be changed in unit 8 (same with the cookieParser)
    cookie: {
      //cookies are a form of session storage
      maxAge: 4000000, //expire cookies after about an hour
    },
    resave: false, //specifies that you dont want to update existing session data on the server if nothing has changed in the existibng session
    saveUninitialized: false, //specifiess that you dont want to send a cookie to a user if no messages are added to the session
  })
);
app.use(connectFlash()); //flash messages display inofrmation to users of an application. They travel to user's browser from your server
//...as part of a session.

app.use(passport.initialize()); //this line is where passport officially becomes middleware
app.use(passport.session()); //must be defined after the definiton of express session

//setting up passport serializing
const User = require("./models/user");
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  //make sure to initialize passport and all its configurations before defining this middleware since you use passport.js methods
  //purpose of this custom middleware is to gain access to variables in the clientside views
  //this middleware configuration treats connectFlash messages like a local variable on the response
  res.locals.flashMessages = req.flash(); //a flash message is no different from a local variable being available to the view.
  res.locals.loggedIn = req.isAuthenticated(); //isAuthenticated is a method provided by Passport.js...
  //...(checks whether there is an exxisting user stored in the request cookies)
  res.locals.currentUser = req.user; //req.user is set to the authenticated user after log in via passport.authenticate in the usersController
  next(); //to show potential success and error flash messages I add the code to display those messages in layout.ejs
});
//end of session management?

app.use(
  /*configure the application router to use methodOverride as middleware.
  Express.js receives the HTML form submissions as POST since the method attribute in the form tag,
  is set to POST in edit.ejs. We could have simply set the method ="PUT" however support,
  from browsers for PUT (and DELETE) is rare source: HTML&CSS the complete reference Thomas A. Powell
  Method override is simply one solution out of many to address this limitation.
  */

  methodOverride("_method", {
    //look for the _method query parameter in the url and interpret
    methods: ["POST", "GET"], //the request by using the method specified by the paramter
  })
);

//After all the middleware has been configured, you call app.use("/", router);
//Note: If you want the router middleware to be part of the main application's middleware flow,
//you need to add it with app.use. In this file, many router.use became app.use
app.use("/", router); //here you're telling express.js to use router as middleware
