let bcrypt = require('bcrypt');
let User = require("../models/User.js");
let Article = require('../models/Article.js');
let moment = require('moment')
// let Article = require("../models/Article.js");
let passport = require('passport');


let authController = {

  homepage:async(req,res)=>
{


let query = {};
let page = 1; // Page is 1 just in case req.query.page is null or undefined;
let perpage = 3; // number of items per page (e.g 3 posts)  ( this is basically our limit )

// console.log(`Page number ${req.query.page}`);

if(req.query.page!=null) page = req.query.page; // getting page data from link queries

// Query goes as query options 3rd parameter for our find function

// skip simply means don't retrieve certain results like  show first 4 results

// On first page  we'll skip 0 posts ( we want to show all 4 posts );
// On second page we'll skip the first 4 posts
// On third page we'll skip  the first 8 posts so display only 4 posts
// On fourth we'll skip 12  so display 4



query.skip = (perpage * page)-perpage; // So limit*page-limit is just to make sure our array starts at index 0    4*1-4 =0  4*2-
// console.log(`Skip ${query.skip} values`)
query.limit = perpage; // It's like passing {limit:2} as 3rd parameter

// find takes in 3 parameter  1.the condition (find all elements by id: 'someid ') 2.queryProjection (which fields to exclude and include  from the documents)
// 3. query options (like limit, skip, etc).

// Example of query options : User.find({ age: {$gte:10}}, null, {limit:2})    limit:2
// So in our find method we say that we want all documents (no criteria,no specific fields and we want to apply a query )
Article.find({},{},query,(err,articles)=>{
if(err) console.log(err);

  Article.countDocuments((err,count)=>{
  if(err) console.log(err);
  // count parameter gives us the number of documents then we divide it by our limit (perpage) E.g 16 documents / 4 perpage =  4 pages
return   res.render('homepage',{ articles,current:page,pages:Math.ceil(count/perpage),moment });
  });
  })
    //
    //
    // // let articles =  await  Article.find().sort({createdAt:'desc'}); // Find all the articles and display them;
    // res.locals.articles = articles;
    // console.log(req.user._id);
    // res.render('homepage')
   },
  loginGet: (req,res)=>{ res.render('authentication/login') },
  registerGet:(req,res)=>{ res.render('authentication/register') },
  loginPost:(req,res,next)=>
  {
   let {email,password} = req.body;
   if(!email|| !password)
   {
     req.flash('error_msg','Please fill in both email field and password field');
   }
  passport.authenticate('local',(err,user,info)=>{  // err,user,info come from passportAuth  where info is the message and others error and user
    if(err)
    {
    // info.message comes from message object;
    req.flash('error_msg',info.message);
    return next(err);

    }
    if(!user)
    {
    req.flash('error_msg',info.message); // Checks if user is false,if it is go back to login ;
    return res.redirect('/login');
    }
    /*
  Passport exposes a login() function on req (also aliased as logIn()) that can be used to establish a login session.
  When the login operation completes, user will be assigned to req.user
  */
  req.logIn(user,(err)=>{
    if(err)
    {
      // displaying error if any
      req.flash('error',info.message);
      return next(err);

    }
// And set up the  user local variable right before redirecting to homepage so we can access our user data;
// Now let's see how this works :)
// Now let's create a new user to see if the user can see other users articles.Looks good
// Now all is left in this video is to make delete and edit links available only for personal articles

      res.locals.user = req.user;
    // console.log(req.user);
    return res.redirect('/homepage');
  // the ERR HTTP headers happens when we use two or more times in a row  res   like res.render('home') then res.redirect('/')
  // to fix it we just need to put return  in front of res
  })
  })(req,res,next);
  },
  registerPost:async(req,res)=>{
   let {email,password,username} = req.body;

   User.exists({email},(err,result)=>{
     if(result) // If we find a user with our credentials redirect to /register
     {
       console.log('User already exists');
       return res.render('authentication/register');
     }
   })

    // Hash the password,  make a new user,save the user
    let hashedPassword = await bcrypt.hash(password,10); // 10 is the no of times the hashing algorithm will repeat on this password;

    let user =  new User({
      username,
      email,
      password:hashedPassword
    });
    user.save().then(()=>{

      return  res.redirect('/register'); }).catch((e)=>console.log(e));


  },
  logout:(req,res)=>{
    req.logout(); // Logging out the user;
    // req.session.destroy();

   return  res.redirect('/login');
  }
};
module.exports = authController;
