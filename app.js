const express= require("express"),
      bodyParser=require("body-parser"),
      mongoose=require("mongoose"),
      passport=require("passport"),
      localStrategy=require("passport-local"),
      User=require("./model/user")
      ejs=require("ejs");
 
const app=express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


app.set("view engine", "ejs");


let authRoutes=require("./routes/userAuth");




const mongoURI = "mongodb://localhost:27017/auth-api";
mongoose.connect(mongoURI, { useNewUrlParser: true });


app.use(require("express-session")({

    secret: "This is my key",
    resave: false,
    saveUninitialized: false

}));


//passport config 
//==================================================================

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//==================================================================



app.get("/api",(req,res)=>{

        res.json({message: "Auth API GET"});
    

});

app.use(authRoutes);


//app.use(authRoutes,"/api");
app.listen(3300,()=>console.log("AuthAPI Server started on PORT 3300"));

