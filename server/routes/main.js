const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

/**
 * GET /
 * HOME
*/
router.get('', async (req, res) => {
  try {
    const locals = {
      title: "Fashionista's Fables",
      description: "Navigating Trends with Ease"
    }

    let perPage = 10;
    let page = req.query.page || 1;

    const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ])
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec();

    // Count is deprecated - please use countDocuments
    // const count = await Post.count();
    const count = await Post.countDocuments({});
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render('index', { 
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: '/'
    });

  } catch (error) {
    console.log(error);
  }

});

// router.get('', async (req, res) => {
//   const locals = {
//     title: "Fashionista's Fables",
//     description: "Navigating Trends with Ease"
//   }

//   try {
//     const data = await Post.find();
//     res.render('index', { locals, data });
//   } catch (error) {
//     console.log(error);
//   }

// });


/**
 * GET /
 * Post :id
*/
router.get('/post/:id', async (req, res) => {
  try {
    let slug = req.params.id;

    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title,
      description: "Navigating Trends with Ease",
    }

    res.render('post', { locals, data });
  } catch (error) {
    console.log(error);
  }

});


/**
 * POST /
 * Post - searchTerm
*/
router.post('/search', async (req, res) => {
  try {
    const locals = {
      title: "Seach",
      description: "Navigating Trends with Ease"
    }

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
        { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
      ]
    });
    res.render("search", { 
      data,
      locals
    });

  } catch (error) {
    console.log(error);
  }

});


/**
 * GET /
 * About
*/
router.get('/about', (req, res) => {
  res.render('about', {
    currentRoute: '/about'
  });
});


// function insertPostData () {
//   Post.insertMany([
//     {
//       title: "Latest Fashion Trends",
//       body: "Check out the newest styles and trends for this season. From bright colors to cool patterns, find out what's hot right now."
//     },
//     {
//       title: "Accessorize Your Look",
//       body: "Learn how to add accessories to your outfits. Jewelry, bags, and more – discover easy ways to upgrade your style."
//     },
//     {
//       title: "Go Green with Fashion",
//       body: "Explore eco-friendly fashion choices. Find out about clothes that are good for the planet and where to get them."
//     },
//     {
//       title: "Dress Like a Star",
//       body: "Get fashion inspiration from your favorite celebrities. See what they wear on the red carpet and how you can get the look."
//     },
//     {
//       title: "DIY Fashion Fun",
//       body: "Try your hand at fashion projects. Learn to transform old clothes into something new and express your unique style."
//     },
//     {
//       title: "Wardrobe Essentials",
//       body: "Simplify your closet with key pieces. Discover timeless clothes that go with everything and make getting dressed easy."
//     },
//     {
//       title: "Fashion Week Behind the Scenes",
//       body: "See what happens behind the scenes at fashion week. From models to makeup, get a sneak peek into the world of high fashion."
//     },
//     {
//       title: "Cultural Style Influences",
//       body: "Explore how different cultures inspire fashion. Learn about styles from around the world and how to mix them into your own look."
//     },
//     {
//       title: "Confident Style Tips",
//       body: "Find out how your clothes can boost your confidence. Learn to express yourself through fashion and feel great about it."
//     },
//     {
//       title: "Simple Wardrobe Tips",
//       body: "Get tips for a simple and stylish wardrobe. Learn about classic pieces that never go out of style."
//     },
//   ])
// }

// insertPostData();

module.exports = router;
