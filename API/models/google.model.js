const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const userModel = require('../models/user.model');
const jwt = require("../utils/jwt");
const randomstring = require('randomstring');


passport.use(new GoogleStrategy({
    clientID: env.social_network.google_auth.clientID,
    clientSecret: env.social_network.google_auth.clientSecret,
    callbackURL: env.social_network.google_auth.callbackURL
},
    async (accessToken, refreshToken, profile, done) => {
        const info = profile._json;
        let paramSend = {};


        if (info.email_verified === true) {
            let user = await userModel.findUserByEmail(info.email);

            if (!user) {
                paramSend.email = info.email;
                paramSend.full_name = info.name;
                paramSend.status = 1;
                paramSend.role = 2;
                paramSend.password = info.email;
                const idUser = await userModel.add(paramSend);

                user = await userModel.findUserById(idUser[0]);
            }

            // Generate token
            const accessToken = await jwt.sign({
                userId: user.id
            }, process.env.SECRET_KEY, {
                expiresIn: process.env.EXPIRESIN
            });

            // Update refresh token
            const refreshToken = randomstring.generate();
            await userModel.updateRefreshToken(user.id, refreshToken);

            let reduceUser = userModel.reduceUser(user);
            reduceUser.access_token = accessToken;
            reduceUser.refresh_token = refreshToken;

            done(null, reduceUser);
        }
        else {
            done(false, null);
            return false;
        }
    }
))


passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user);
});