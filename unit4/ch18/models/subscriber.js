const mongoose = require("mongoose");

/*const subscriberSchema = mongoose.Schema({
  name: String,
  email: String,
  zipCode: Number
});*/

//Adding validators to the subscriber schema in subscriber.js
//require means that data must exist for the model instance before it can be saved to the database
//the subscriber's schema defines how instances of the subscriber model behave
//or visit http://mongoosejs.com/docs/queries.html
const subscriberSchema = new mongoose.Schema({
  name: {
    type: String, //not null or undefined
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true //unique is not a validator but rather a Mongoose schema helper.
    //Helpers are like methods that perform tasks that behave like a validator in this case
  },
  zipCode: {
    type: Number,
    min: [10000, "Zip code too short"],
    max: 99999
  },
  courses: [
    //one subscriber can have many courses pg 186
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course"
    }
  ]
});

//instance methods operate on an instance (a Mongoose document) of the Subscriber model
//static methods are used for genral porpuse queries that may relate to many Subscriber instances

//exec ensures that you get a promise back instead of needing to add an asynchronous callback

//When using methods with Mongoose, you wont be able to use ES6 arrow functions without drawbacks
//Mongoose makes use of binding this, which is removed with aroow functions.
//Inside the function you can use ES6 again
//other mongoose queries at page 181 in Get programming with Node js
subscriberSchema.methods.getInfo = function() {
  return `Name: ${this.name} Email: ${this.Email} Zip Code: ${this.zipCode}`;
};

subscriberSchema.methods.findLocalSubscribers = function() {
  return this.model("Subscriber")
    .find({ zipCode: this.zipCode })
    .exec();
};

module.exports = mongoose.model("Subscriber", subscriberSchema);
