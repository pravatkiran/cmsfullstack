const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const expressJwt = require('express-jwt');
const sequelize = require('./config/connection');

const userRoute = require('./routes/user.route');
const customerRoute = require('./routes/customer.route');

const app = express();

// bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// session
app.use(session({
    secret: 'supersecretkey',
    resave: false,
    saveUninitialized: false,
    store: new SequelizeStore({
        db: sequelize
    })
}));

// express jwt
app.use(expressJwt({ secret: 'supersecretkey', algorithms: ['HS256'] }).unless({ path: ['/login', '/signup'] }));

// cors
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization")
    next();
})


// passport
require('./auth/passport');
app.use(passport.initialize());
app.use(passport.session());


// routes
app.use('/', userRoute);
app.use('/', customerRoute);

const port = process.env.PORT || 4000;

sequelize.sync().then(result => {
    app.listen(port, console.log(`app listening to ${port}`))
})
