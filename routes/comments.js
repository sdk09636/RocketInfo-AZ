const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Comment = require('../models/comments')
const Launch = require('../models/launch')
const { validateComment, isLoggedIn, isCommentAuthor } = require('../middleware');
const comments = require('../controllers/comments');

router.post('/', isLoggedIn, validateComment, catchAsync(comments.createComment));

router.put('/:cid', isLoggedIn, catchAsync(comments.likeComment));

router.delete('/:cid', isLoggedIn, isCommentAuthor, catchAsync(comments.deleteComment));

module.exports = router;