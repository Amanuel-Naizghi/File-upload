const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcryptjs");
const userControllerHelper = require('../controller/userControllerHelper');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy(
            { usernameField: 'userName', passwordField: 'password' },
            async (userName, password, done) => {
                try {
                    const user = await userControllerHelper.getUser(userName.toLowerCase());
                    if (!user) {
                        return done(null, false, { message: "Incorrect user name" });
                    }
                    const match = await bcrypt.compare(password, user.password);
                    if (!match) {
                        return done(null, false, { message: "Incorrect password" });
                    }
                    return done(null, user);
                } catch (err) {
                    return done(err);
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const { rows } = await userControllerHelper.getUserById(id);
            done(null, rows[0]);
        } catch (err) {
            done(err);
        }
    });
};