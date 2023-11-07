if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
//const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user')
const helmet = require('helmet');


const MongoDBStore = require('connect-mongo');
const dbUrl = process.env.DB_URL;

// to remove mongo injection
// removes certain characters from query strings and body
const mongoSanitize = require('express-mongo-sanitize'); 


const launchesRoutes = require('./routes/launches');
const commentsRoutes = require('./routes/comments');
const usersRoutes = require('./routes/users');

//'mongodb://localhost:27017/rocket-info'



// During Deployment 
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// mongoose.connect('mongodb://localhost:27017/rocket-info', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });


//connection for mongoose
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize({
    replaceWith: '_'
}));
app.use(helmet({
    contentSecurityPolicy: false
}));

// const store = MongoDBStore.create({
//     mongoUrl: 'mongodb://localhost:27017/rocket-info',
//     crypto: {
//         secret: process.env.SESSION_SECRET
//     },
//     touchAfter: 24 * 60 * 60
// })

// During Deployment
const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SESSION_SECRET
    },
    touchAfter: 24 * 60 * 60
})

store.on("error", function(e) {
    console.log("Session Store Error", e)
})

const sessionConfig = {
    store: store,
    name: 'myID',
    secret : process.env.SESSION_SECRET,
    resave : false,
    saveUninitialized: true,
    cookie : {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        //cookies only using https
        //secure: true
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/launches', launchesRoutes);
app.use('/launches/:id/comments', commentsRoutes);
app.use('/', usersRoutes);
//app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.render('home');
})

app.all('*', (req, res, next) => {
    next(new ExpressError("Not Found", 404));
})

app.use((err, req, res, next) => {
    const{statusCode = 500} = err;
    if(!err.message) {
        err.message = "Something went wrong";
    }
    res.status(statusCode).render('error', { err });
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Live on port ${ port }...`);
})