const mongoose = require("mongoose"),
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
    password: {
      type: String,
      required: true
    },
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
  if (user.subscribedAccount === undifined) {
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

module.exports = mongoose.model("User", userSchema);
