const User = require("../model/user"),
    mongoose = require("mongoose"),
    express = require("express"),
    router = express.Router({ mergeParams: true }),
    passport = require("passport"),
    jwt = require("jsonwebtoken"),
    BearerStrategy = require("passport-http-bearer");



//takeaways:
//1. creating authentication bearer token using jwt for every new user
//2. authorizing each user with dedicated token (if using API) , or using the passport local strategy (if using it in a system)
//3. use the protected routes using bearer strategy



passport.use(new BearerStrategy(function (token, done) {

    console.log(`bearer strategy fired`)
    User.findOne({ token: token,tokenExpiry:{$gt :Date.now()}}, (err, foundUser) => {

        if (err) { return done(err) };
        if (!foundUser) { return done(null, false) };
        return done(null, foundUser, { scope: `read` });

    });


}));

const privateKey = "mymothertoldmenottotalkbadwords"


// //Register Auth
router.post("/api/register", async (req, res) => {

    let newUserObj = { username: req.body.username };
    let password = req.body.password;


    try{

        let newUser=await User.register(newUserObj,password);
        // registeredUser.token=token;
        // registeredUser.tokenExpiry=Date.now() + 3600000;
        // let savedUser=await registeredUser.save();
        // let user=await User.findOne({token:token}).exec();
        res.status(201).json({message : "registration successful"});

    }catch(err){

        res.json({err:err.message});

    }
   
});



router.get("api/users/:username",async (req,res)=>{

    let username=req.params.username;
    let foundUser=await User.findOne({username}).exec();
    console.log(foundUser.username);
    res.render("test",{user:foundUser});
});



    router.post("/api/authenticate",passport.authenticate("local"), async (req, res) => {

            //1 generate json web tokens for the registered user- bearer
        
            let foundUser=await User.findOne({username:req.body.username}).exec();
            let token= jwt.sign({foundUser},privateKey);

        
            //2.set to to the token attribute of the user and set token expiry
            foundUser.token=token;
            foundUser.tokenExpiry=Date.now() + 3600000;
            await foundUser.save();
            
            //3 send out the token to access the protected routes
            let responseObj={username:foundUser.username,token:foundUser.token,tokenExpiry:foundUser.tokenExpiry};
            res.json(req.user);

    });




    router.post("/api/create", passport.authenticate("bearer"), function (req, res) {

        res.json({message:"authorized"});

    });


    
    
    
    
    
    
    // function setTokenToReq(req, res, next) {

    //     let bearerToken = req.headers[`authorization`];

    //     let accessToken = bearerToken.split(` `)[1];

    //     req.token = accessToken;

    //     next();

    // }


    module.exports = router;