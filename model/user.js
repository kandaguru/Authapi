const passportLocalMongoose = require(`passport-local-mongoose`)
        mongoose=require(`mongoose`);



const userSchema=new mongoose.Schema({

        username:{type:String ,required:true,unique:true},
        password:{type:String},
        token:{type:String},
        tokenExpiry:{type:Date ,default:Date.now}

});

userSchema.plugin(passportLocalMongoose);
const User=mongoose.model("user",userSchema);

module.exports=User;