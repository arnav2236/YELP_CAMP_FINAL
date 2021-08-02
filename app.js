var express=require("express")
var app=express();
app.set("view engine","ejs");
app.use(express.static("public"));

var passport=require("passport");
var localstrategy=require("passport-local");
var passportlocalmongoose=require("passport-local-mongoose");
var expresssession=require("express-session");
var User=require("./models/user");

var methodoverride=require("method-override");
app.use(methodoverride("_method"));

var bodyparser=require("body-parser");
app.use(bodyparser.urlencoded({extended:true}));

var mongoose=require("mongoose");
// mongoose.connect(process.env.DATABASEURL);
// mongodb+srv://Avinash2609:Avinash@5181@cluster0.qa8fk.mongodb.net/YelpCamp?retryWrites=true&w=majority
// mongodb://localhost:27017/yelpcamp_v10

// mongoose.connect("mongodb://localhost:27017/yelpcamp_v10")

mongoose.connect("mongodb+srv://yelpcamp:AK47AK47@cluster0.wzjxs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");

// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://Avinash2609:Avinash@5181@cluster0.qa8fk.mongodb.net/YelpCamp?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });


var flash = require("connect-flash");
app.use(flash());

var campground=require("./models/campground");
var Comment=require("./models/comments");


// var seedDb=require("./seed");

var indexroutes=require("./routes/index");
var campgroundroutes=require("./routes/campgrounds");
var commentroutes=require("./routes/comments");





///////////////////////////////////////
////////////////configuration/////////
app.use(expresssession({
    secret: "can be anything",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentuser=req.user; //req.user contains the info of currently logged in user
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
})


app.use(indexroutes); 
app.use(campgroundroutes);
app.use(commentroutes);



//////////////////////////////
app.listen(process.env.PORT,process.env.IP ,function(){
    console.log("server has been started");
})

// app.listen(3000,function(){
//     console.log("server has been started");
// })

