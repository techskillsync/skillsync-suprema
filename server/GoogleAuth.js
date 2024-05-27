// NOTE THIS IS A SKELETON. WE NEED A CLIENT-ID AND CLIENT-SECRET FOR IT TO WORK

const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Configure passport to use Google OAuth
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
},
    function (token, tokenSecret, profile, done) {
        // Extract the user's email from the profile
        const email = profile.emails[0].value;
        console.log(`User's email: ${email}`);
        return done(null, { email });
    }
));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

// Middleware for sessions
app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/auth/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'email'] })
);

app.get('/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Successful authentication, return user's email
        res.send(`User's email: ${req.user.email}`);
    }
);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
