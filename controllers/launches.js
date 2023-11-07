const Launch = require('../models/launch');
const Comment = require('../models/comments');
const { cloudinary } = require('../cloudinary');
const { convertDate } = require('../xtrafunctions');

module.exports.index = async (req, res, next) => {
    const launches = await Launch.find({});
    res.render('launches/index', { launches, convertDate });
};

module.exports.renderNewForm = (req, res) => {
    res.render('launches/new');
};

module.exports.createLaunch = async (req, res, next) => {
    const launch = new Launch(req.body.launch);
    launch.author = req.user._id;
    launch.image = { filename: req.file.filename, url: req.file.path };
    await launch.save();
    req.flash('success', 'Sucessfully made a Launch!');
    res.redirect(`/launches/${ launch._id }`);
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const launch =  await Launch.findById(id);
    if(!launch) {
        req.flash('error', 'Cannot find launch!');
        return res.redirect('/launches');
    }
    res.render('launches/edit', { launch });
}

module.exports.showLaunch = async (req, res, next) => {
    const launch = await Launch.findById(req.params.id).populate({
        path: 'comments',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!launch) {
        req.flash('error', 'Cannot find launch!');
        return res.redirect('/launches');
    }
    res.render('launches/show', { launch });
}

module.exports.editLaunch = async (req, res) => {
    const { id } = req.params;
    const launch = await Launch.findByIdAndUpdate(id, { ...req.body.launch });
    req.flash('success', 'Sucessfully updated the Launch!');
    res.redirect(`/launches/${ id }`);
}

module.exports.deleteLaunch = async (req, res) => {
    const { id } = req.params;
    const l = await Launch.findById(id);
    await cloudinary.uploader.destroy(l.image.filename);
    await Launch.findByIdAndDelete(id);
    req.flash('success', 'Sucessfully deeleted the Launch!');
    res.redirect('/launches');
};