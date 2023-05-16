if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
//const { cloudinary } = require('./cloudinary')
//console.log(process.env.CLOUDINARY_NAME)

const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');;
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user')
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError')

const dbUrl = process.env.DB_URL ||'mongodb://localhost:27017/yelp-camp';
//process.env.DB_URL || 
//process.env.DB_URL;
//'mongodb://localhost:27017/yelp-camp'

const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const MongoStore = require('connect-mongo');

const userRoutes = require('./routes/users')
const mongoose = require('mongoose');
const { join } = require('path');
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    //useCreateIndex: true,
    useUnifiedTopology: true,
    //useFindAndModify: false

})

const db = mongoose.connection;
db.on('err', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
})

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')));
const secret = process.env.SECRET || "thisshouldbebettersecret!"
//

const store = new MongoStore({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 3600 ,
})

store.on("error", function(e){
    console.log("Session Store Error", e)
})

const sessionConfig = {
    store,
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expire: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(flash());
app.use(session(sessionConfig));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
    //console.log('req', req.session.returnTo);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    //res.locals.success_msg= req.flash('success_msg')
    next();
})



app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

app.get('/', (req, res) => {
    res.render('home');
})




app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found!', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh no, something went wrong!'
    res.status(statusCode).render('error', { err });
})

const port =  process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})