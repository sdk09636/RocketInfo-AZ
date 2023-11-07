const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Launch = require('../models/launch');
const { isLoggedIn, isAuthor, validateLaunch } = require('../middleware');
const launches = require('../controllers/launches');
const multer  = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });


router.get('/', catchAsync(launches.index));

router.get('/new', isLoggedIn, launches.renderNewForm);

router.get('/:id', catchAsync(launches.showLaunch));

router.post('/', isLoggedIn, upload.single('image'), validateLaunch, catchAsync(launches.createLaunch));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(launches.renderEditForm));

router.put('/:id', isLoggedIn, isAuthor, validateLaunch, catchAsync(launches.editLaunch));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(launches.deleteLaunch));

module.exports = router;