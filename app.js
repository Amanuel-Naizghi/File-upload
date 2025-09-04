const express = require('express');
const path = require("node:path");
const session = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const prisma = require("./index");
const passport = require("passport");
require("./config/passport")(passport);
const flash = require("connect-flash");

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
      cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      },
      secret: process.env.SESSION_SECRET || "supersecret",
      resave: false,
      saveUninitialized: false,
      store: new PrismaSessionStore(
        prisma,
        {
          checkPeriod: 2 * 60 * 1000,  // every 2 min remove expired
          dbRecordIdIsSessionId: true,
          dbRecordIdFunction: undefined,
        }
      ),
    })
  );

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
    res.locals.error = req.flash("error");
    next();
})


const router = require('./routes/userRouter');
app.use('/', router);
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`You are running on port ${PORT}`));