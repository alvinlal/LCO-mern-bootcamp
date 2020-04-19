const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const { signout, signup, signin, isSignedIn } = require("../controllers/auth");

const signupValidators = [
  check("name", "Name should be at least 3 char").isLength({ min: 3 }),
  check("email", "Enter valid email").isEmail(),
  check("password", "Password should be at least 3 char").isLength({ min: 3 }),
];
const signinValidators = [
  check("email", "Email is required").isEmail(),
  check("password", "Password is required").isLength({ min: 1 }),
];
router.post("/signup", signupValidators, signup);
router.post("/signin", signinValidators, signin);
router.get("/prot", isSignedIn, (req, res) => {
  res.send("inside protected route");
});
router.get("/signout", signout);

module.exports = router;
