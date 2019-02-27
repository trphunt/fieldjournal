var express             = require("express"),
    methodOverride      = require("method-override"),
    flash               = require("connect-flash"),
    app                 = express(),
    bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"),
    passport            = require("passport"),
    LocalStrategy       = require("passport-local"),
    User                = require("./models/user");

//var seedDB = require("./seeds"); // Uncomment to seed site
    
//requiring routes
var entryRoutes = require("./routes/entries"),
    entryRoutes = require("./routes/entries"),
    libraryRoutes = require("./routes/libraries"),
    indexRoutes = require("./routes/index");
    
var url = process.env.DATABASEURL || "mongodb://localhost/field_journal";

mongoose.Promise = global.Promise;
mongoose.connect(url, {useMongoClient: true});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB; // seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
   secret: "This string is for your protection",
   resave: false,
   saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use("/", indexRoutes);
app.use("/libraries", libraryRoutes);
app.use("/libraries/:id/entries", entryRoutes);
app.use("/libraries/:id/entries/:entry_id:/entries", entryRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("FieldJournal server started");
});