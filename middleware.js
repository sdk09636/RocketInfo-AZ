const { launchSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Launch = require('./models/launch');
const { commentSchema } = require('./schemas.js');
const Comment = require('./models/comments');
const catchAsync = require('./utils/catchAsync.js');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in!');
        return res.redirect('/login');
    }
    next();
};

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.isAuthor = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const launch1 =  await Launch.findById(id);
    if(!launch1.author.equals(req.user._id)) {
        req.flash('error', 'You are not the author!');
        return res.redirect(`/launches/${ id }`);
    };
    next();
})

module.exports.validateLaunch = (req, res, next) => {
    // ***** server side validation *****
    const result = launchSchema.validate(req.body);
    if(result.error) {
        const message = result.error.details.map(el => el.message).join(',');
        throw new ExpressError(message, 400);
    }
    else {
        next();
    }
    // ***** server side validation *****
}

module.exports.validateComment = (req, res, next) => {
    // ***** server side validation *****
    const result = commentSchema.validate(req.body);
    if(result.error) {
        const message = result.error.details.map(el => el.message).join(',');
        throw new ExpressError(message, 400);
    }
    else {
        next();
    }
    // ***** server side validation *****
}


module.exports.isCommentAuthor = async(req, res, next) => {
    const { id, cid } = req.params;
    const comment =  await Comment.findById(cid);
    if(!comment.author.equals(req.user._id)) {
        req.flash('error', 'You are not the author!');
        return res.redirect(`/launches/${ id }`);
    };
    next();
}
