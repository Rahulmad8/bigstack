const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// model of Personal
const Person = require("../../models/Person");

// model of Profile
const Profile = require("../../models/Profile");

// type  get
// route  /api/profile/
// desc   route for personal user profile
// access Private

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          return res.status(404).json({ profileErr: "profile not found" });
        }
        res.json(profile);
      })
      .catch(err => console.log("got some error in profile " + err));
  }
);

// type  Post
// route  /api/profile/
// desc   route UPDATING / SAVING for personal user profile
// access Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //   storing profile values
    const profileValues = {};
    profileValues.user = req.user.id;
    if (req.body.username) profileValues.username = req.body.username;
    if (req.body.country) profileValues.country = req.body.country;
    if (req.body.website) profileValues.website = req.body.website;
    if (req.body.portfolio) profileValues.portfolio = req.body.portfolio;
    if (typeof req.body.Languages !== undefined) {
      profileValues.Languages = req.body.Languages.split(",");
    }
    // get spcial link
    profileValues.social = {};
    if (req.body.facebook) profileValues.social.facebook = req.body.facebook;
    if (req.body.instagram) profileValues.social.instagram = req.body.instagram;
    if (req.body.youtube) profileValues.social.youtube = req.body.youtube;

    // update the profile
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (profile) {
          Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileValues },
            { new: true }
          )
            .then(profile => res.json(profile))
            .catch(err => console.log("update error " + err));
        } else {
          Profile.findOne({ username: profileValues.username })
            .then(profile => {
              // Username already exist
              if (profile) {
                res.status(400).json({ usernameErr: "username already exist" });
              }
              // save user
              new Profile(profileValues)
                .save()
                .then(profile => res.json(profile))
                .catch(err => console.log("save user" + err));
            })
            .catch(err => console.log("username" + err));
        }
      })
      .catch(ere => console.log("profile update error " + err));
  }
);
// type  get
// route  /api/profile/:username
// desc   route for getting infomation based on username
// access public
router.get("/:username", (req, res) => {
  Profile.findOne({ username: req.params.username })
    .populate("user", ["name", "profilepic"])
    .then(profile => {
      if (!profile) {
        res.status(404).json({ profileErr: "user not found" });
      }
      res.json(profile);
    })
    .catch(err => console.log("fetching username" + err));
});

// type  get
// route  /api/profile/:id
// desc   route for getting infomation based on ID
// access public
router.get("/id/:user", (req, res) => {
  Profile.findOne({ userid: req.params.user.id })
    .populate("user", ["name", "profilepic"])
    .then(profile => {
      if (!profile) {
        res.status(404).json({ profileErr: "user not found" });
      }
      res.json(profile);
    })
    .catch(err => console.log("fetching id" + err));
});

// type  get
// route  /api/profile/find/everyone
// desc   route for getting all the users from database
// access public
router.get("/find/everyone", (req, res) => {
  Profile.find()
    .populate("user", ["name", "profilepic"])
    .then(profiles => {
      if (!profiles) {
        res.status(404).json({ profileErr: "user not found" });
      }
      res.json(profiles);
    })
    .catch(err => console.log("fetching user" + err));
});

// type  post
// route  /api/profile/mywork
// desc   route for posting work inforamtion
// access private

router.post(
  "/mywork",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          res.status(404).json({ error: "profile not found" });
        }
        const newWork = {
          role: req.body.role,
          Company: req.body.Company,
          from: req.body.from,
          To: req.body.To,
          Details: req.body.Details
        };
        profile.workrole.push(newWork);
        profile
          .save()
          .then(profile => res.json(profile))
          .catch(err => console.log("saving error" + err));
      })
      .catch(err => console.log(err));
  }
);

// type  Delete
// route  /api/profile/mywork/:w_id
// desc   route for deleting specific workrole
// access private

router.delete(
  "/mywork/:w_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        const removethis = profile.workrole
          .map(item => item.id)
          .indexof(req.params.w_id);

        profile.workrole.splice(removethis, 1);
        profile
          .save()
          .then(profile => res.json(profile))
          .catch(err => console.log(err));
      })
      .catch(err => console.log("profile not found" + err));
  }
);

module.exports = router;
