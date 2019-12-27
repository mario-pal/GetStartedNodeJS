var recipes = [
  {
    title: "Beans",
    time: "1 hour"
  },
  {
    title: "Rice",
    time: "1 hour"
  },
  {
    title: "Eggs",
    time: "10 minutes"
  }
];

exports.showRecipes = (req, res) => {
  res.render("recipes", { availableRecipes: recipes });
};

exports.showSignUp = (req, res) => {
  res.render("contact");
};

exports.postedSignUpForm = (req, res) => {
  res.render("thanks");
};

//The below example demonstartes more compact syntax for the exports module
//i.e. you dont have to keep module.exports several times over like in the above 3 exports
var courses = [
  {
    title: "Event Driven Cakes",
    cost: 50
  }
];

module.exports = {
  showCourses: (req, res) => {
    res.render("courses", {
      offeredCourses: courses
    });
  }
};
