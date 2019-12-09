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
