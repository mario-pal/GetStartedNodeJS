const mongoose = require("mongoose"),
  bcrypt = require("bcrypt"),
  passportLocalMongoose = require("passport-local-mongoose"), //you can use this method to let the User model access passport methods such as User.register
  { Schema } = mongoose; //without this, you would otherwise need to do const userSchema = new mongoose.Schema({

const userSchema = new Schema(
  {
    name: {
      first: {
        type: String,
        trim: true
      },
      last: {
        type: String,
        trim: true
      }
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true
    },
    zipCode: {
      type: Number,
      min: [1000, "Zip code too short"],
      max: 99999
    },
    /*password: {
      type: String,
      required: true
    },*/
    courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
    subscribedAccount: { type: Schema.Types.ObjectId, ref: "Subscriber" }
  },
  {
    //this is the second argument to the Schema constructor
    timestamps: true
  }
);
//virtual atributes aka computed attribute is similar to a regular schema property...
//...but isnt saved in the database but behaves like any other property on the user model
userSchema.virtual("fullName").get(function() {
  return `${this.name.first} ${this.name.last}`;
}); //you cant use arrow functions for virtual because mongoose methods use the lexical this
//but ES6 arrow functions no longer depend on the lexical this

//Mongoose offers some methods, called hooks, that allow you to perform an operation
//before a database change, such as save, is run.
//a hook is added after the schema is defined but before the model is registered
//purpose: when a new user is created check for an existing subscriber with the same email...
//...address and associate the two
const Subscriber = require("./subscriber"); //needed for this hook to work
//as of writing this, arrow functions dont work with Mongoose hooks
//This hook runs before a user is created or saved (recall that mongoose' create makes and saves a new user)
userSchema.pre("save", function(next) {
  let user = this; //the lack of arrow functions force you to define a user outside the promise chain
  if (user.subscribedAccount === undefined) {
    Subscriber.findOne({
      email: user.email
    })
      .then(subscriber => {
        user.subscribedAccount = subscriber;
        next();
      })
      .catch(error => {
        console.log(`Error in connecting subsscriber: ${error.message}`);
        next(error);
      });
  } else {
    next();
  }
});

//hash passwords before they are saved in the database by using bcrypt
/*userSchema.pre("save", function(next) {
  //run everytime the mongoose create or save method is used
  let user = this;
  bcrypt
    .hash(user.password, 10)
    .then(hash => {
      user.password = hash;
      next();
    })
    .catch(error => {
      console.log(`Error in hashing password: ${error.message}`);
      next(error);
    });
});*/

/*userSchema.methods.passwordComparison = function(inputPassword) {
  let user = this;
  return bcrypt.compare(inputPassword, user.password);
};*/
//when the following plugin is in place,  Passport.js automatically takes care of password storage ...
//... so you can remove the password property from the userSchema. This plugin modifies your schema behind...
//...the scenes to add hash and salt fields to your User model in place of the password field that would otherwise be inputted manually
userSchema.plugin(passportLocalMongoose, { usernameField: "email" }); //use email of the user's login parameter instead of the default username...
//...The plugin sets up passportLocalMongoose to create salt and hash fields for the User model...
//...The plugin also removes the need to manually add a password field to the user schema
module.exports = mongoose.model("User", userSchema);
