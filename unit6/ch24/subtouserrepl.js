const mongoose = require("mongoose"),
  Subscriber = require("./models/subscriber"),
  Course = require("./models/course"),
  User = require("./models/user");

mongoose.connect("mongodb://localhost:27017/recipedb", {
  useNewUrlParser: true
});

mongoose.Promise = global.Promise;

var testUser;

User.create({
  name: {
    first: "Mario",
    last: "Luigi"
  },
  email: "mario@luigi.com",
  password: "passwerd"
})
  .then(user => {
    testUser = user;
    return Subscriber.findOne({
      email: user.email
    });
  })
  .then(subscriber => {
    testUser.subscribedAccount = subscriber;
    testUser.save().then(user => console.log("user updated"));
  })
  .catch(error => console.log(error.message));
