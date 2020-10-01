let express = require('express');
let router = express.Router();
let {registerGet,loginGet,loginPost,registerPost,logout,homepage} = require('../controllers/authController');
let checkIfLogged = (req,res,next)=>{
  if(!req.isAuthenticated()) // Checking if user is logged in
  {
      return next();  // If user is not  logged in run the function handler so it can log in xd
  }
      return res.redirect('/login') // otherwise redirect to /login

}
// Get routes;
router.get('/login',loginGet)
router.get('/register',registerGet)
router.get('/homepage',homepage)
// Post routes;

router.post('/login',checkIfLogged,loginPost);
router.post('/register',registerPost);

router.post('/logout',logout);




module.exports = router;
