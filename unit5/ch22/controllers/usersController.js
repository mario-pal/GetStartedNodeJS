const User = require("../models/user");

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
    let userParams = {
      name: {
        first: req.body.first, //where the form input feild has the name attribute set to first
        last: req.body.last
      },
      email: req.body.email,
      password: req.body.password,
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
      });
  },
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },
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
        password: req.body.password,
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
  }
};
