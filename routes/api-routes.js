// Requiring our models and passport as we've configured it
const db = require("../models");
const { Op } = require("sequelize");
const passport = require("../config/passport");
const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    // Sending back a password, even a hashed password, isn't a good idea
    res.json({
      email: req.user.email,
      id: req.user.id
    });
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", (req, res) => {
    console.log(req.user);
    db.User.create({
      email: req.body.email,
      password: req.body.password,
      firstname: req.body.firstname,
      lastname: req.body.lastname
    })
      .then(() => {
        res.redirect(307, "/api/login");
      })
      .catch(err => {
        res.status(401).json(err);
      });
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", isAuthenticated, (req, res) => {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id,
        firstname: req.user.firstname,
        lastname: req.user.lastname
      });
      // res.json(true);
    }
  });

  app.post("/api/orderItem", isAuthenticated, async (req, res) => {
    console.log(req.body);
    console.log(req.user);
    //find pending order under current user
    let order = await db.Order.findOne({
      where: {
        UserId: req.user.id,
        state: "pending"
      }
    });

    //need to get the bike to calculate the order totalprice
    const bike = await db.Bike.findOne({
      where: {
        id: req.body.bikeId
      }
    });

    //if pending order does not exist, create one
    if (!order) {
      order = await db.Order.create({
        totalprice: bike.price,
        state: "pending",
        UserId: req.user.id
      });
    } else {
      await db.Order.update(
        {
          totalprice: order.totalprice + bike.price
        },
        {
          where: {
            id: order.id
          }
        }
      );
    }

    const orderItem = await db.OrderItem.findOne({
      where: {
        BikeId: req.body.bikeId,
        Orderid: order.id
      }
    });

    if (!orderItem) {
      await db.OrderItem.create({
        OrderId: order.id,
        BikeId: req.body.bikeId,
        quantity: req.body.quantity
      });
    } else {
      console.log(`order id: ${order.id}`);
      await db.OrderItem.update(
        {
          quantity: ++orderItem.quantity
        },
        {
          where: {
            BikeId: req.body.bikeId,
            Orderid: order.id
          }
        }
      );
    }

    res.status(200).json();
  });

  app.post("/api/order", isAuthenticated, (req, res) => {
    //find order and update its state to ordered
    db.Order.findOne({
      where: {
        UserId: req.user.id,
        state: "pending"
      }
    }).then(order => {
      db.Order.update(
        {
          state: "ordered"
        },
        {
          where: {
            id: order.id
          }
        }
      ).then(() => {
        res.status(200).end();
      });
    });
  });

  app.get("/api/orderItems", isAuthenticated, async (req, res) => {
    //find pending order under current user
    const order = await db.Order.findOne({
      where: {
        UserId: req.user.id,
        state: "pending"
      }
    });

    if (order) {
      const orderItems = await db.OrderItem.findAll({
        where: {
          OrderId: order.id
        },
        include: [db.Bike, db.Order]
      });

      //TODO: render cart page via handlebars
      if (orderItems) {
        // console.log(orderItems);
        res.json(orderItems);
      }
    }

    res.status(200).end();
  });

  app.get("/api/orders", isAuthenticated, async (req, res) => {
    //find non-pending orders under current user
    const nonPendingOrders = await db.Order.findAll({
      where: {
        state: {
          [Op.not]: "pending"
        },
        UserId: req.user.id
      }
    });

    if (nonPendingOrders) {
      nonPendingOrders.forEach(async order => {
        const orderItems = await db.OrderItem.findAll({
          where: {
            OrderId: order.id
          }
        });
        if (orderItems) {
          //TODO: render order history page via handlebars
          console.log(orderItems);
        }
      });
    }

    res.status(200).end();
  });

  app.get("/api/user", (req, res) => {
    //req.user --> to find order
    res;
  });

  app.get("/api/users/", (req, res) => {
    res;
  });

  app.get("/api/bikes", (req, res) => {
    res;
  });

  app.get("/api/bikes/:id", (req, res) => {
    res;
  });

  app.get("/api/bikes/filter/featured", (req, res) => {
    res;
  });

  app.get("/api/bikes/filter/brand/:id", (req, res) => {
    console.log(req.user);
    db.Bike.findAll({
      where: {
        brand: req.params.id
      }
    }).then(dbBike => {
      res.json(dbBike);
    });
  });

  app.get("/api/bikes/filter/category/:id", (req, res) => {
    db.Bike.findAll({
      where: {
        category: req.params.id
      }
      // limit: 10
    }).then(dbBike => {
      console.log(dbBike);
      res.json(dbBike);
    });
  });

  app.get("/api/bikes/filter/color/:id", (req, res) => {
    res;
  });

  app.get("/api/bikes/filter/frame_size/:id", (req, res) => {
    res;
  });

  app.get("/api/bikes/filter/frame_material/:id", (req, res) => {
    db.Bike.findAll({
      where: {
        framematerial: req.params.id
      }
      // limit: 10
    }).then(dbBike => {
      console.log(dbBike);
      res.json(dbBike);
    });
  });

  app.get("/api/bikes/filter/year/:id", (req, res) => {
    db.Bike.findAll({
      where: {
        year: req.params.id
      }
      // limit: 10
    }).then(dbBike => {
      console.log(dbBike);
      res.json(dbBike);
    });
  });
};
