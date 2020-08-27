// Requiring path to so we can use relative routes to our HTML files
const path = require("path");
const db = require("../models");
// Requiring our custom middleware for checking if a user is logged in
//const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {
  // app.get("/", (req, res) => {
  //   // If the user already has an account send them to the members page
  //   if (req.user) {
  //     res.redirect("/members");
  //   }
  //   res.sendFile(path.join(__dirname, "../public/signup.html"));
  // });

  app.get("/login", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });

  /*
  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/members", isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "../public/members.html"));
  });
  */

  app.get("/", (req, res) => {
    db.Bike.findAll({}).then(dbBike => {
      const category = [...new Set(dbBike.map(ele => ele.dataValues.category))];

      const brand = [...new Set(dbBike.map(ele => ele.dataValues.brand))];

      const colour = [...new Set(dbBike.map(ele => ele.dataValues.colour))];

      const frameSize = [
        ...new Set(dbBike.map(ele => ele.dataValues.framesize))
      ];

      const frameMaterial = [
        ...new Set(dbBike.map(ele => ele.dataValues.framematerial))
      ];

      const year = [...new Set(dbBike.map(ele => ele.dataValues.year))];

      const card = [...new Set(dbBike.map(ele => ele.dataValues))];

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
        card: card
      });
    });
  });
};
