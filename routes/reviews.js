const express = require('express');
const router = express.Router({mergeParams : true});
const Campground = require('../models/campground');
const Review = require('../models/review');
const ExpressError = require('../utils/ExpressError')
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, validateReview, isReviewer} = require('../middleware');
const reviews = require('../controllers/reviews')


router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewer, catchAsync(reviews.deleteReview))



module.exports = router;