let Article = require('../models/Article.js');
// We might need one more route for articles without edit and delete buttons
// We'll create that route in the next episode
// Until then hope you had fun and good luck coding ;)  We might also cover validation in next video,image upload and sanitization
let articleController = {
createArticle:(req,res)=>{ return res.render('new',{article: new Article() })

},
readMore:(req,res)=>{
  let articleId = req.params.id;
  Article.findById({_id:articleId}).then((article)=>
  {
   res.render('readMore',{article})
});
},
deleteArticle:(req,res)=>{
  let articleId = req.params.id;
  Article.findByIdAndDelete({_id:articleId}).then(()=>{
  return  res.redirect('/homepage');
  })
},
editArticle:async(req,res)=> {

await  Article.findById({_id:req.params.id}).then((fullArticle)=>{
      return res.render('edit',{article:fullArticle});
  })},

  changeArticle:async(req,res,next)=>{
     req.article = await Article.findById({_id:req.params.id})
     next();
  },
seeMyArticle:async(req,res)=>{

  let userId = req.user._id;
  console.log(req.user._id);
     // Few more things before showing you this in work
     // I've searched for all the articles created by this user  by using the customerId
     const articles =  await Article.find({customerId:req.user._id});
  return  res.render('myArticles',{articles});
},
likeArticle: (req, res,next) => {
  // console.log(req.body.like);
  /* The $addToSet operator adds a value to an array unless the value is already present, in which case $addToSet does nothing to that array. */
  /* {$addToSet:{likes:req.user._id} */
  Article.findByIdAndUpdate({_id:req.params.id},{$push:{likes:req.user._id} }, function(err, data){
          if(err){ return res.json(err)}
          else{
             return res.redirect('/homepage');
            }
   });

 },

 dislikeArticle: (req, res,next) => {
   Article.findByIdAndUpdate({_id:req.params.id},{$pull:{likes:req.user._id}}, function(err, data){
           if(err){ return res.json(err)}
           else{
              return res.redirect('/homepage'); }
    });

  }
  // ,
  // displayCategoryArticle:(req,res)=>{
  // let categoryName = Object.keys(req.body)[0];
  // categoryName = categoryName.charAt(0).toLowerCase() + categoryName.slice(1);
  //
  // Article.find({category:categoryName}).then((filteredArticles)=>{
  //   // after that send this to middleware
  // req.session.filteredArticles = filteredArticles;
  // console.log(req.session.filteredArticles);
  // res.redirect('/testHP');
  // })
  // }
/*
,
likeArticle: (req,res)=>{
 Article.findByIdAndUpdate(req.body.myArticleId,{ $push:{likes:req.user._id} },{new:true})
 .exec((err,result)=>{
   if(err)
   {
     console.log(err);
   }
   else
   {
     return res.json(result);
   }
 })

},
dislikeArticle: (req,res)=>{
 Article.findByIdAndUpdate(req.body.myArticleId,{ $pull:{likes:req.user._id} },{new:true})
 .exec((err,result)=>{
   if(err)
   {
     console.log(err);
   }
   else
   {
     return res.json(result);
   }
 }) */

}

module.exports = articleController;
