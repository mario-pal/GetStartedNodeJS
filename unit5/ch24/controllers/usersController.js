const User = require("../models/user"),
  passport = require("passport");

//This is fine only if you want to couple your query and the displaying of the index view
/*module.exports = {
  index: (req, res) => {
    User.find({})
      .then(users => {
        res.render("users/index", { users: users });
      })
      .catch(error => {
        console.log(`Error fetching users: ${error.message}`);
        res.redirect("/");
      });
  }
};*/
const getUserParams = body => {
  //create a custom function to pull subscriber data from the request
  return {
    name: { first: body.first, last: body.last },
    email: body.email,
    zipCode: parseInt(body.zipCode)
  };
};
//this approach decouples the query from the index view display
module.exports = {
  index: (req, res, next) => {
    User.find()
      .then(users => {
        res.locals.users = users; //locals is an object in res that lets you define variables...
        //...to which you'll have access to in your view
        next(); //call the next middleware function
      })
      .catch(error => {
        console.log(`Error fetching users: ${error.message}`);
        next(error);
      });
  },
  indexView: (req, res) => {
    //purpose of indexview: display all documents for a particlar model
    res.render("users/index", {
      flashMessages: { success: "Loaded all users!" }
    }); //the flashMessage is optional and used to demonstarte that you can pass a flash message directly as a local variable
  }, //whne passing flashMessages object directly to the vie, you dont need to wait for a redirect or use connect-flash
  //actions to create a new user from a form on this webpage
  new: (req, res) => {
    res.render("users/new");
  },
  create: (req, res, next) => {
    if (req.skip) {
      //refer to the validate action that sets this custom property to true if there was a problem with user data validation
      next();
    }
    let newUser = new User(getUserParams(req.body));

    User.register(newUser, req.body.password, (error, user) => {
      if (user) {
        req.flash(
          "success",
          `${user.fullName}'s account created successfully!`
        );
        res.locals.redirect = "/users";
        next();
      } else {
        req.flash(
          "error",
          `Failed to create user account because: ${error.message}.`
        );
        res.locals.redirect = "/users/new";
        next();
      }
    });
    /*let userParams = {
      name: {
        first: req.body.first, //where the form input feild has the name attribute set to first
        last: req.body.last
      },
      email: req.body.email,
      //password: req.body.password,
      zipCode: req.body.zipCode
    };

    User.create(userParams) //now using mongoose create function
      .then(user => {
        req.flash(
          //success and error are made up flash-message types that attaches the key (i.e. success, error, etc) to the message on the right
          "success",
          `${user.fullName}'s account created successfully!`
        ); //respond with a success flash message to the user
        res.locals.redirect = "/users";
        res.locals.user = user;
        next();
      })
      .catch(error => {
        console.log(`Error saving user: ${error.message}`);
        res.locals.redirect = "/users/new";
        req.flash(
          "error",
          `Failed to create user account because: ${error.message}.` //respond with a failure flash message
        );
        next();
        //next(error);
      });*/
  },
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },
  //===============================
  login: (req, res) => {
    res.render("users/login");
  },
  /*(req, res, next) => {
    User.findOne({
      email: req.body.email
    })
      .then(*/
  authenticate:
    /*user => {
        if (user) {
          user.passwordComparison(req.body.password).then(passwordsMatch => {
            if (passwordsMatch) {
              //user.password === req.body.password) { this compared the inputted password with the non-hashed version of the password
              res.locals.redirect = `/users/${user._id}`;
              req.flash(
                "success",
                `${user.fullName}'s logged in successfully!`
              );
              res.locals.user = user;
            } else {
              req.flash(
                "error",
                "Your password is incorrect. Please try again or contact your system administrator"
              );
              res.locals.redirect = "/users/login";
            }
            next();
          });
        } else {
          req.flash(
            "error",
            "User account not found. Please try again or contact your system administrator"
          );
          res.locals.redirect = "/users/login";
          next();
        }
      }*/
    /*)
      .catch(error => {
        console.log(`Error logging in user: ${error.message}`);
        next(error);
      });*/
    passport.authenticate("local", {
      //authenticating via the "local" strategy
      failureRedirect: "/users/login",
      failureFlash: "Failed to login",
      successRedirect: "/",
      successFlash: "Logged in!"
    }), //the login route in index.js(main file) no longer needs the usersController.redirectView action when using this
  //},
  //===============================
  //show action (showing a specific user's profile)
  show: (req, res, next) => {
    let userId = req.params.id;
    User.findById(userId)
      .then(user => {
        res.locals.user = user; //pass the user through the res object to the next middleware function
        next();
      })
      .catch(error => {
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error);
      });
  },
  showView: (req, res) => {
    res.render("users/show");
  },
  //actions to edit and update user info
  edit: (req, res, next) => {
    let userId = req.params.id;
    User.findById(userId)
      .then(user => {
        res.render("users/edit", {
          user: user
        });
      })
      .catch(error => {
        console.error(`Error fetching user by ID: ${error.message}`);
        next(error);
      });
  },
  update: (req, res, next) => {
    let userId = req.params.id,
      userParams = {
        name: {
          first: req.body.first,
          last: req.body.last
        },
        email: req.body.email,
        //password: req.body.password,
        zipCode: req.body.zipCode
      };
    User.findByIdAndUpdate(userId, { $set: userParams }) //mongoose method
      .then(user => {
        res.locals.redirect = `/users/${userId}`;
        res.locals.user = user;
        next();
      })
      .catch(error => {
        console.log(`Error updating user by ID: ${error.message}`);
        next(error);
      });
  },
  //delete action for user
  delete: (req, res, next) => {
    let userId = req.params.id;
    User.findByIdAndRemove(userId)
      .then(() => {
        res.locals.redirect = "/users";
        next();
      })
      .catch(error => {
        console.log(`Error deleting user by ID: ${error.message}`);
        next(error);
      });
  },
  //validating user data entered in web page form
  validate: (req, res, next) => {
    req
      .sanitizeBody("email")
      .normalizeEmail({
        all_lowercase: true
      })
      .trim(); //remove whitespace with the trim method
    req.check("email", "Email is invalid").isEmail();
    req
      .check("zipCode", "Zip code is invalid")
      .notEmpty()
      .isInt()
      .isLength({
        min: 5,
        max: 5
      })
      .equals(req.body.zipCode);

    //req.check("password", "Password cannot be empty").notEmpty();

    req.getValidationResult().then(error => {
      if (!error.isEmpty()) {
        let messages = error.array().map(e => e.msg);
        req.skip = true;
        req.flash("error", messages.join(" and "));
        res.locals.redirect = "/users/new";
        next();
      } else {
        next();
      }
    });
  },

  logout: (req, res, next) => {
    req.logout(); //this uses the logout method provided by passport.js; it clears the current user's session
    req.flash("success", "You have been logged out!");
    res.locals.redirect = "/";
    next();
  }
};
