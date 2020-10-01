let express = require('express')
let router = express.Router();
let {createArticle,readMore,deleteArticle,likeArticle,dislikeArticle,editArticle,changeArticle,seeMyArticle} = require('../controllers/articleController');
let Article = require('../models/Article.js');
const path  = require('path');

function saveArticleAndRedirect(path)
{
  return async(req,res)=>{
    //
    //   let img = req.files.image;
    //   img.mv('./uploads/'+img.name); // Moving the image to the uploads path
    //
    // let data =
    //  {
    //  name: img.name,
    //  mimetype: img.mimetype,
    //  size: img.size
    //  }

let article = req.article;
article.customerId = req.user._id; // I've also set up the customerId to be our user id that we got from passport
article.title = req.body.title;
article.description = req.body.description;
article.markdown = req.body.markdown;
article.category = req.body.category;
article.image = req.files.image.name;
// article.image = data.name;

let savedArticle =  await article.save();
if(savedArticle)
{
  console.log('Article has been saved')
}
res.redirect(`/${path}`);
}
}


let uploadFile = (req,res,next) => {
   try {
       if(!req.files) {
           res.send({
               status: false,
               message: 'No file uploaded'
           });
       } else {
           //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
           let image = req.files.image;
           //Use the mv() method to place the file in upload directory (i.e. "uploads")
           image.mv('./uploads/' + image.name);
           next();
           //send response
          /* res.send({
               status: true,
               message: 'File is uploaded',
               data: {
                   name: image.name,
                   mimetype: image.mimetype,
                   size: image.size
               }
           });
        */
       }
   }
   catch (err) {
    res.status(500).send(err);
   }

}

router.post('/',uploadFile,(req,res,next)=>{


 req.article =  new Article();


  next();
},saveArticleAndRedirect('homepage'));

router.get('/readMore/:id',readMore);
router.get('/new',createArticle);
router.delete('/deleteArticle/:id',deleteArticle)
router.get('/editArticle/:id',editArticle);
router.put('/changeArticle/:id',changeArticle,saveArticleAndRedirect('homepage'));
router.get('/myArticle',seeMyArticle);
// router.put('/like',likeArticle);
// router.post('/displayCategoryArticle',displayCategoryArticle);
router.put('/like/:id',likeArticle);
router.put('/dislike/:id',dislikeArticle);
// router.post('/testHP',(req,res)=>{
//
//   let categoryName = Object.keys(req.body)[0];
//   categoryName = categoryName.charAt(0).toLowerCase() + categoryName.slice(1);
//
//   Article.find({category:categoryName}).then((filteredArticles)=>{
//     // after that send this to middleware
//   req.session.filteredArticles = filteredArticles;
//   console.log(filteredArticles);
//
// })
//
// });
router.post('/filteredArticles',(req,res)=>{
  let categoryName = req.body.filteredCategory;
    Article.find({category:categoryName}).then((filteredArticles)=>{
      console.log(filteredArticles);
      // after that send this to middleware
    // req.session.filteredArticles = filteredArticles;
    // console.log(filteredArticles);
    res.render('filteredArticles',{filteredArticles});
  });
})
module.exports = router;
