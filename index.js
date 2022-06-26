const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const passport = require("passport");
const initialize = require("./passport-config");
const flash = require("express-flash");
const session = require("express-session");
initialize(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id)
);
const users = [];
const cors = require("cors");
app.use(flash());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.set("view-engine", "ejs");
app.get("/", (req, res) => {
  res.render("index.ejs", { name: "nobel" });
});
app.get("/login", (req, res) => {
  res.render("login.ejs");
});
app.get("/register", (req, res) => {
  res.render("register.ejs");
});
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
    };
    users.push(user);
    res.redirect("/login");
    console.log(users);
  } catch (err) {
    console.log(err);
  }
});
app.listen(3000, () => {
  console.log("server is running on port 3000");
});
