const express = require('express');
const session = require('express-session');
const mongoose = require("mongoose");
const passport = require("passport");
    const bodyParser = require("body-parser");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
var cookieParser = require('cookie-parser');
const User = require("./models/user");
const app = express();
const PORT = 3000;

//Database connection

mongoose.connect("mongodb://localhost/posystemDB", { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true })
.then((result) => console.log("connected to db"))
.catch((err) => console.log("error mess:" + err));

//set static files
app.use(express.static('public'));

//set view engine
app.set('view engine', 'ejs');
app.set('views', ['./views', 'views/admin_views', 'views/user_views', 'views/manager_views']);

//COOKIE PARSER
app.use(cookieParser());

//EXPRESS SESSIONS
app.use(session({
    secret: "Rusty is a dog",
    resave: true,
    saveUninitialized: true,
    // cookie: { maxAge: 60000 }
}));

//body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//PASSPORT INITIALIZATION
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

// app.use( (req, res, next) =>{
//     res.locals.cart = req.cookies.cart;
//     console.log("from debug :"+req.cookies.cart);
//     next();
// });
const adminRoutes = require('./router/adminRoutes');
const userRoutes = require('./router/userRoutes');
const cartRoutes = require('./router/cartRoutes');
const managerRoutes = require('./router/managerRoutes');

//ROUTES//
 
app.get('/', (req, res) => {

    if (req.isAuthenticated()) {
        if (req.user.admin_role) {
            res.redirect("/admin");
        }
        else if (req.user.manager_role) {
            res.redirect("/manager");
        }
        else{
        res.redirect('/user');
        }
    } else{
        res.render('index', { title: 'Home' });
    } 
});


//adminRoutes
app.use('/manager', managerRoutes);
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
app.use('/cart', cartRoutes);

//registration
app.get('/registration', (req, res) => {
    res.render('registration', { title: 'registration', pStatus: 'active', msg: '' });
});

app.post("/registration", function (req, res) {
    var username = req.body.username;
    var phoneno = req.body.phoneno;
    var password1 = req.body.password1;
    var password2 = req.body.password2;
    var email = req.body.email;
    // console.log("debugging--------------" + req.body.username);
    if (password1 === password2) {

        User.register(new User({
            username: username,
            phoneno: phoneno,
            email: email
        }),
            password1, function (err, user) {
                if (err) {
                    console.log(err);
                    return res.render("registration", { msg: "registration fail !!", title: "registration" });
                }
            res.render("registration", { msg: "registration successfull!!", title: "registration" });
        });

    }

});

app.get('/login', (req, res) => {
    res.render('login', { title: 'Login', pStatus: 'active' });

});

//USER LOGIN
app.post("/login", passport.authenticate("local"), function (req, res) {    
    if (req.user.admin_role) {
        res.redirect('/admin');

    } else if (req.user.manager_role) {
        res.render('managerdash',{title: "Manager"});
        
    }
     else {   
        res.redirect('/user');
    }

    // console.log(req.user.admin_role);
});

//logout
app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});

app.get('/about', (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.admin_role) {
            res.redirect("/admin");
        }
        else if (req.user.manager_role) {
            res.redirect("/manager");
        }
        else{
        res.redirect('/user');
        }
    } else{
        res.render('about', { title: 'About' });
    } 

});
app.get('/chef', (req, res) => {

    if (req.isAuthenticated()) {
        if (req.user.admin_role) {
            res.redirect("/admin");
        }
        else if (req.user.manager_role) {
            res.redirect("/manager");
        }
        else{
        res.redirect('/user');
        }
    } else{
        res.render('chef', { title: 'Chef' });
    } 

});
app.get('/contact', (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.admin_role) {
            res.redirect("/admin");
        }
        else if (req.user.manager_role) {
            res.redirect("/manager");
        }
        else{
        res.redirect('/user');
        }
    } else{
        res.render('contact', { title: 'Contact' });
    } 

});
app.get('/reservation', (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.admin_role) {
            res.redirect("/admin");
        }
        else if (req.user.manager_role) {
            res.redirect("/manager");
        }
        else{
        res.redirect('/user');
        }
    } else{
        res.render('reservation', { title: 'Reservation' });
    } 
   

});
app.get('/menu', (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.admin_role) {
            res.redirect("/admin");
        }
        else if (req.user.manager_role) {
            res.redirect("/manager");
        }
        else{
        res.redirect('/user');
        }
    } else{
        res.render('menu', { title: 'Menu' });
    } 
    

});
app.get('*', function(req, res){
    res.render('404.ejs', {title: 'Not Found'});
  });

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));