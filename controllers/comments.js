const Comment = require('../models/comments')
const Launch = require('../models/launch')


module.exports.createComment = async(req, res) => {
    const launch = await Launch.findById(req.params.id);
    const comment = new Comment(req.body.comment);
    comment.likes = 0;
    comment.author = req.user._id;
    launch.comments.push(comment);
    await comment.save();
    await launch.save();
    req.flash('success', 'Created new comment!');
    res.redirect(`/launches/${ req.params.id }`);
}

module.exports.likeComment = async (req, res) => {
    const { id, cid } = req.params;
    const comment = await Comment.findById(cid);
    const index = comment.usersLiked.indexOf(req.user._id);
    if(index !== -1) {
        comment.likes = comment.likes - 1;
        comment.usersLiked.splice(index, 1);
        req.flash('error', 'Removed your like');
    }
    else {
        comment.usersLiked.push(req.user._id);
        comment.likes = comment.likes + 1;
        req.flash('success', 'Liked a Comment');
    }
    await comment.save();
    res.redirect(`/launches/${ id }`);
}

module.exports.deleteComment = async (req, res) => {
    const { id, cid } = req.params;
    await Launch.findByIdAndUpdate(id, {$pull: {comments: cid}});
    await Comment.findByIdAndDelete(cid);
    req.flash('success', 'Deleted a Comment');
    res.redirect(`/launches/${ id }`);
}