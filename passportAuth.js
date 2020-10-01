let LocalStrategy = require('passport-local').Strategy;
let User = require("./models/User.js");
let bcrypt = require('bcrypt');

function passportInit(passport)
{
// I will comment this out for now;
let authenticateUser = async(email,password,done)=>{
// Ok so first of all let's find a user by email then compare the passwords

let user = await User.findOne({email});
console.log(user);

// console.log(user.password);
// done function takes in three parameters: 1.error if there is none pass in null, 2. user if there's none pass false, 3.message  which is an object {message:'Some message'}
if(!user)
{
  done(null,false,{message:`User doesn't exist`});
}

// Comparing the passwords
bcrypt.compare(password,user.password).then((match)=>{
  // user is returned and now serialize function has access to it
  if(match)   done(null,user,{message:'Passwords match.Logged in! :) '});
   return   done(null,false,{message:'Passwords do not match'})
})
  .catch((e)=>
  {
  return  done(null,false,{message:'Something went wrong'});
  });

}
// Lmao another mistake xD
passport.use(new LocalStrategy({usernameField:'email'},authenticateUser)); // We are using local strategy to log in user ,which means login with password and email

// We're getting user._id from our user saved in the database;
// upon calling serializeUser  the user id gets stored in the session like :  req.session.passport.user._id = 'some id '
passport.serializeUser((user,done)=>{
done(null,user._id); // now when we call this user._id will be passed to deserializeUser
});

passport.deserializeUser((id,done)=>{
  // So we're getting the id from serializeUser after our user id has been saved in the session as req.session.passport._id
  // Then searching for the respective user in the db;
  User.findById(id,(err,user)=>{
    done(err,user);
  })
})
}


module.exports = {passportInit};
