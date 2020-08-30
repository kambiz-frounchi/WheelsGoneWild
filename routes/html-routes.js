// Requiring path to so we can use relative routes to our HTML files
const path = require("path");
const db = require("../models");
// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {
  app.get("/signup", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/");
    }
    res.sendFile(path.join(__dirname, "../public/signup.html"));
  });

  app.get("/login", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/");
    }
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });

  // Route for logging user out
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/cart", isAuthenticated, (req, res) => {
    //res.sendFile(path.join(__dirname, "../public/members.html"));
    //res.render();
    res;
  });

  app.get("/orderhistory", isAuthenticated, (req, res) => {
    // res.sendFile(path.join(__dirname, "../public/members.html"));
    res;
  });

  app.get("/profile", isAuthenticated, (req, res) => {
    // res.sendFile(path.join(__dirname, "../public/members.html"));
    res;
  });

  app.get("/", (req, res) => {
    loggedIn = false;
    if (req.user) {
      loggedIn = true;
    }
    db.Bike.findAll({}).then(dbBike => {
      const category = [
        ...new Set(dbBike.map(element => element.dataValues.category))
      ];

      const brand = [
        ...new Set(dbBike.map(element => element.dataValues.brand))
      ];

      const colour = [
        ...new Set(dbBike.map(element => element.dataValues.colour))
      ];

      const frameSize = [
        ...new Set(dbBike.map(element => element.dataValues.framesize))
      ];

      const frameMaterial = [
        ...new Set(dbBike.map(element => element.dataValues.framematerial))
      ];

      const year = [...new Set(dbBike.map(element => element.dataValues.year))];

      const card = [...new Set(dbBike.map(element => element.dataValues))];
      console.log(req.user);
      res.render("index", {
        category: category.sort(),
        categoryTotal: category.length,
        brand: brand.sort(),
        brandTotal: brand.length,
        colour: colour.sort(),
        colourTotal: colour.length,
        frameSize: frameSize.sort(),
        frameSizeTotal: frameSize.length,
        frameMaterial: frameMaterial.sort(),
        frameMaterialTotal: frameMaterial.length,
        year: year.sort(),
        yearTotal: year.length,
        searchTotal: dbBike.length,
        card: card,
<<<<<<< HEAD
        loggedIn: req.user
=======
        loggedIn: loggedIn
>>>>>>> master
      });
    });
  });
};
