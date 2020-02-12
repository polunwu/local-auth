const passport      = require('passport');
const bcrypt        = require('bcrypt');

module.exports = function(app, db) {
  
  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/");
  }

  app.route("/")
    .get((req, res) => {
    
    res.render(process.cwd() + "/views/pug/index", {
      title: "Home page",
      message: "Please login",
      showLogin: true,
      showRegistration: true
    });
    
  });

  app.route("/login")
    .post(
      passport.authenticate("local", { failureRedirect: "/" }),
      (req, res) => {
        res.redirect("/profile");
      }
    );

  app.route("/profile")
    .get(ensureAuthenticated, (req, res) => {
    
    res.render(process.cwd() + "/views/pug/profile", {
      username: req.user.username
    });
    
  });

  app.route("/register")
    .post(
    // 1. Register the new user
    (req, res, next) => {
      db.collection("ps-users").findOne(
        { username: req.body.username },
        function(err, user) {
          if (err) {
            next(err);
          } else if (user) {
            res.redirect("/");
          } else {
            let hash = bcrypt.hashSync(req.body.password, 12);
            db.collection("ps-users").insertOne(
              {
                username: req.body.username,
                password: hash
              },
              (err, doc) => {
                if (err) {
                  res.redirect("/");
                } else {
                  next(null, user);
                }
              }
            );
          }
        }
      );
    },
    // 2. Authenticate the new user
    passport.authenticate("local", { failureRedirect: "/" }),
    // 3. Redirect to /profile
    (req, res, next) => {
      res.redirect("/profile");
    }
  );

  app.route("/logout")
    .get((req, res) => {
    req.logout();
    res.redirect("/");
  });
  
  // HANDLE 404 (**after all routes**)
  app.use((req, res, next) => {
    res.status(404)
       .type('text')
       .send('Not Found');
  });
  
};
