// Requiring our models and passport as we've configured it
const db = require("../models");
const { Op, Sequelize } = require("sequelize");
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
    }
  });

  // Update profile data
  app.post("/profile", isAuthenticated, async (req, res) => {
    console.log(req.body);
    await db.User.update(req.body, { where: { id: req.user.id } });
    res.redirect("/profile");
  });

  // Upload avatar file
  app.post("/upload", async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("No files were uploaded.");
    }
    // console.log(req.files);
    const avatar = req.files.avatar;
    console.log(avatar);
    avatar.name = "avatar.jpg";
    console.log(avatar);
    // Use the mv() method to place the file somewhere on your server
    await avatar.mv("./public/avatar/" + avatar.name, err => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
    });
    res.redirect("/profile");
  });

  // Add item to shopping cart
  app.post("/api/orderItem", isAuthenticated, async (req, res) => {
    console.log(req.body);
    // console.log(req.user);
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
          totalprice: order.totalprice + bike.price,
          totalquantity: Sequelize.literal("totalquantity + 1")
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
    res.status(200).json(true);
  });

  // Request to decrease quantity of orderitem
  app.put("/api/orderItem", isAuthenticated, async (req, res) => {
    console.log(req.body);
    await db.OrderItem.update(
      {
        quantity: Sequelize.literal("quantity - 1")
      },
      {
        where: {
          bikeId: req.body.bikeId,
          quantity: {
            [Op.gt]: 0
          }
        },
        attributes: [db.OrderItem.quantity],
        include: [
          {
            model: db.Order,
            where: {
              UserId: req.user.id,
              state: "pending"
            }
          }
        ]
      }
    );
    const { price } = await db.Bike.findOne({
      raw: true,
      where: {
        id: req.body.bikeId
      }
    });
    // console.log(price);
    await db.Order.update(
      {
        totalquantity: Sequelize.literal("totalquantity - 1"),
        totalprice: Sequelize.literal(`totalprice - ${price}`)
      },
      {
        where: {
          state: "pending"
        }
      }
    );

    await db.OrderItem.destroy({
      where: {
        quantity: 0
      }
    }).then(item => {
      console.log(item);
      res.status(200).json(true);
    });
  });

  // Route to confirm pending order to ordered
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

  //find pending order under current user
  app.get("/api/orderItems", isAuthenticated, async (req, res) => {
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

  //find non-pending orders under current user
  app.get("/api/orders", isAuthenticated, async (req, res) => {
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

  // Empty shopping cart for current user
  app.delete("/api/order", isAuthenticated, (req, res) => {
    console.log("test");
    db.Order.destroy({
      where: {
        UserId: req.user.id
      }
    }).then(data => {
      console.log(data);
      res.status(200).json(true);
    });
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
    }).then(bikes => {
      console.log(bikes);
      res.json(bikes);
    });
  });

  app.get("/api/bikes/filter/year/:id", (req, res) => {
    db.Bike.findAll({
      where: {
        year: req.params.id
      }
    }).then(bikes => {
      console.log(bikes);
      res.json(bikes);
    });
  });

  //admin routes
  app.post("/api/bikes", isAuthenticated, async (req, res) => {
    if (req.user) {
      const user = await db.User.findOne({
        where: {
          id: req.user.id
        }
      });

      if (user.role === "admin") {
        console.log(req.body.bike);
        db.Bike.create(req.body.bike).then(dbBike => {
          res.json(dbBike);
        });
      }
    }
  });

  app.delete("/api/bikes/:id", isAuthenticated, async (req, res) => {
    console.log("delete");
    if (req.user) {
      const user = await db.User.findOne({
        where: {
          id: req.user.id
        }
      });

      if (user.role === "admin") {
        console.log(`bikeid = ${req.params.id}`);
        db.Bike.destroy({
          where: {
            id: req.params.id
          }
        })
          .then(() => {
            res.status(200).end();
          })
          .catch(() => {
            res.status(200).end();
          });
      }
    }
  });

  app.put("/api/bikes/:id", isAuthenticated, async (req, res) => {
    if (req.user) {
      const user = await db.User.findOne({
        where: {
          id: req.user.id
        }
      });

      if (user.role === "admin") {
        console.log(`bikeid = ${req.params.id}, new price = ${req.body}`);
        db.Bike.update(req.body, {
          where: {
            id: req.params.id
          }
        })
          .then(() => {
            res.status(200).end();
          })
          .catch(() => {
            res.status(200).end();
          });
      }
    }
  });
};
