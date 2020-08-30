// This is middleware for restricting routes a user is not allowed to visit if not logged in
module.exports = function(req, res, next) {
  console.log("auth");
  // If the user is logged in, continue with the request to the restricted route
  if (req.user) {
    console.log(req.user);
    return next();
  }

  // If the user isn't logged in, redirect them to the login page
  return res.redirect("/login");
};

// This is middleware for restricting routes a user is not allowed to visit if not logged in
/*
class UserAuthentication {
  constructor() {
    this.loggedIn = false;
  }

  isAuthenticated(req, res, next) {
    console.log("auth");
    // If the user is logged in, continue with the request to the restricted route
    if (req.user) {
      console.log(req.user);
      this.loggedIn = true;
      return next();
    }

    // If the user isn't logged in, redirect them to the login page
    return res.redirect("/login");
  }
}

module.exports = UserAuthentication;*/
