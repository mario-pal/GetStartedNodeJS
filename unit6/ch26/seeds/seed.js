//Note: update this file (seed.js) to use Passport.js (similar to create in useController.js)instead of the Mongoose create method
const mongoose = require("mongoose"),
  Subscriber = require("./models/subscriber"),
  User = require("./models/user");

mongoose.connect("mongodb://localhost:27017/recipedb", {
  useNewUrlParser: true
});

mongoose.connection;

/*var contacts = [
  {
    name: "Jon Wexler",
    email: "jon@jonwexler.com",
    zipCode: 10016
  },
  {
    name: "Chef Eggplant",
    email: "eggplant@recipeapp.com",
    zipCode: 20331
  },
  {
    name: "Professor Souffle",
    email: "souffle@recipeapp.com",
    zipCode: 19103
  }
];*/

var contacts = [
  {
    name: { first: "Jordan", last: "Peterson" },
    email: "j@p.com",
    zipCode: 11111
  },
  {
    name: { first: "Slavoj", last: "Zizek" },
    email: "s@z.com",
    zipCode: 22222
  },
  {
    name: { first: "Javier", last: "Harvard" },
    email: "j@harvard.com",
    zipCode: 13370
  }
];

User.deleteMany()
  .exec() //needed if youd like to work with genuine javascript promises even if no callback is passed
  .then(() => {
    console.log("User data is empty!");
  });

var commands = [];

contacts.forEach(c => {
  //commands.push(
  /*Subscriber.create({
      name: c.name,
      email: c.email
    })*/
  User.register(c, "passwerd", (error, user) => {
    if (error) console.log(error);
  });
  //);
});

/*Promise.all(commands)
  .then(r => {
    console.log(JSON.stringify(r));
    mongoose.connection.close();
  })
  .catch(error => {
    console.log(`ERROR: ${error}`);
  });*/

//mongoose.connection.close();
