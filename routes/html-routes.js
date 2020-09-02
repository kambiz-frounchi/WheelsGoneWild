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
    } else {
      res.sendFile(path.join(__dirname, "../public/signup.html"));
    }
  });

  app.get("/login", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/");
    } else {
      res.sendFile(path.join(__dirname, "../public/login.html"));
    }
  });

  // Route for logging user out
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/cart", isAuthenticated, (req, res) => {
    res.redirect("/#cart");
  });

  app.get("/orderhistory", isAuthenticated, (req, res) => {
    res;
  });

  app.get("/profile", isAuthenticated, (req, res) => {
    console.log("test");
    if (!req.user) {
      res.json(false);
    } else {
      const { email, firstname, lastname, phone } = req.user;
      res.render("profile", {
        email: email,
        firstname: firstname,
        lastname: lastname,
        phone: phone
      });
    }
  });

  app.get("/", async (req, res) => {
    let admin = false;
    if (req.user) {
      const user = await db.User.findOne({
        where: {
          id: req.user.id
        }
      });

      if (user.role === "admin") {
        admin = true;
      }
    }

    const dbBike = await db.Bike.findAll({});
    const category = [
      ...new Set(dbBike.map(element => element.dataValues.category))
    ];

    const brand = [...new Set(dbBike.map(element => element.dataValues.brand))];

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
    // console.log(req.user);

    let cart, cartCounter;
    if (req.user) {
      cart = await db.OrderItem.findAll({
        // raw: true,
        include: [
          {
            model: db.Order,
            where: {
              UserId: req.user.id,
              state: "pending"
            },
            attributes: {
              exclude: ["UserId"]
            }
          },
          {
            model: db.Bike
          }
        ]
      });
      if (cart.length > 0) {
        cartCounter = cart[0].dataValues.Order.dataValues.totalquantity;
      } else {
        cartCounter = 0;
      }
      // console.log(cart[0].dataValues);
    } else {
      cart = null;
    }
    // console.log(cart);
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
      loggedIn: req.user,
      cart: cart,
      cartCounter: cartCounter,
      admin: admin
    });
  });

  app.get("/admin", isAuthenticated, async (req, res) => {
    const dbBikes = await db.Bike.findAll({});

    const bikes = dbBikes.map(element => element.dataValues);

    const categories = [
      ...new Set(dbBikes.map(element => element.dataValues.category))
    ];

    const brands = [
      ...new Set(dbBikes.map(element => element.dataValues.brand))
    ];

    const currentYear = new Date().getFullYear();
    const years = [
      `${currentYear - 1}`,
      `${currentYear}`,
      `${currentYear + 1}`
    ];

    const frameMaterials = [
      ...new Set(dbBikes.map(element => element.dataValues.framematerial))
    ];

    res.render("admin", {
      bikes: bikes,
      categories: categories,
      brands: brands,
      years: years,
      framematerials: frameMaterials
    });
  });
};
