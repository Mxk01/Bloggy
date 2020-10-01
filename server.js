 let express = require('express');
 let app = express();
 const Article = require('./models/Article.js');
 let port = process.env.PORT||3000;
 let passport = require('passport');
 let session =  require('express-session');
const fileUpload = require("express-fileupload");
 let mongoose = require('mongoose');
 const methodOverride = require('method-override')
let mongoDbStore = require('connect-mongo')(session);
let path = require('path');
let flash = require('connect-flash')
let authRoute = require('./routes/auth.js');
const articlesRoute = require('./routes/articles');
const bodyParser = require("body-parser")
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
let dotenv = require('dotenv');
dotenv.config();


// Using fileUpload middleware
app.use(fileUpload());
app.use(express.static("uploads"));

 mongoose.connect(process.env.MONGO_URI,{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true,useFindAndModify:false});
   let connection  = mongoose.connection;
   connection.once('open',()=>{ console.log('Succesfully connected to mongo') }).catch((e)=>{ console.log(e); });


let mongoStore = new mongoDbStore(
  {
    mongooseConnection:connection,// using this connection
    collection:'sessions' // store session data in here;
  }
)



 let {passportInit} = require('./passportAuth.js');
 // to use environment variables we need to set up  dotenv;

// pass in a secret to  session middleware
app.use(session({
secret:process.env.COOKIE_SECRET,
resave: false, // Resaves data saves registration data when data is not modified
saveUninitialized:true, // Keeps track of user choices  such as if user didn't choose to save something in the database
// We won't be using mongostore yet
cookie:{maxAge:60*60*24*1000}, // Lifetime of the cookie (here it's 24 hrs )  // Now finally the times has come to store our sessions xD
mongoStore:mongoStore

}))

app.use(methodOverride('_method'))

passportInit(passport);
app.set('views',path.join(__dirname,'/front-end/views'))
app.set('view engine','ejs');
app.use(passport.initialize()); //  initializes passport and lets us use serializeUser and deserializeUser functions
app.use(passport.session()); // session support for passport

app.use(flash());
app.use((req,res,next)=>{
  res.locals.session = req.session;
  res.locals.error_msg = req.flash('error_msg');
  res.locals.user = req.user;
  next();
})





app.get('/',(req,res)=>{
 return res.redirect('/login')
})



app.use('/',authRoute);
app.use('/articles',articlesRoute);


 app.listen(port,()=>{console.log('Logging to the server....')})
