const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jsonwt = require("jsonwebtoken");
const passport = require("passport");
const key = require("../../setup/myurl");
// type  Get
// route  /api/auth
// desc   just for testing
// access Public
router.get("/", (req, res) => res.json({ test: "Auth is success" }));

// import schema for person to register
const Person = require("../../models/Person");

// type  post
// route  /api/auth/register
// desc   route for registration of user
// access Public
router.post("/register", (req, res) => {
  Person.findOne({ email: req.body.email })
    .then(person => {
      if (person) {
        return res
          .status(400)
          .json({ emailerror: "email is already registred in our system" });
      } else {
        const newperson = new Person({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        });
        // encrypating password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newperson.password, salt, (err, hash) => {
            if (err) throw err;
            newperson.password = hash;
            newperson
              .save()
              .then(person => res.json(person))
              .catch(err => console.log(err));
          });
        });
      }
    })
    .catch(err => console.log(err));
});
// type  post
// route  /api/auth/login
// desc   route for login of user
// access Public
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  Person.findOne({ email })
    .then(person => {
      if (!person) {
        return res.status(404).json({ emailerror: "user not found}" });
      }
      bcrypt
        .compare(password, person.password)
        .then(isCorrect => {
          if (isCorrect) {
            // res.json({ success: "user is able to login suceessfully" });
            // use payload and create token for user
            const payload = {
              id: person.id,
              name: person.name,
              email: person.email
            };
            jsonwt.sign(
              payload,
              key.secret,
              { expiresIn: 3600 },
              (err, token) => {
                res.json({
                  success: true,
                  token: "Bearer " + token
                });
              }
            );
          } else {
            res.status(400).json({ passerror: "password is not correct" });
          }
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

// type  get
// route  /api/auth/profile
// desc   route for profile of user
// access private

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // console.log(req);
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      profilepic: req.user.profilepic
    });
  }
);

module.exports = router;
