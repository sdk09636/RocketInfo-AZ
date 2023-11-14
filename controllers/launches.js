const Launch = require('../models/launch');
const Comment = require('../models/comments');
const { cloudinary } = require('../cloudinary');
const { convertDate } = require('../xtrafunctions');

module.exports.index = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 8;
    const totalUpcomingLaunches = await Launch.countDocuments({ datetime: { $gte: new Date() } });
    const rem = totalUpcomingLaunches % pageSize;
    const pagesUpcomingL = Math.ceil(totalUpcomingLaunches / pageSize);
    const totalLaunches = await Launch.countDocuments();
    const totalPages = Math.ceil(totalLaunches / pageSize);
    const l1 = await Launch.find({ datetime: { $gte: new Date() } })
        .sort({ datetime: 1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize);
    const pastLaunchesCount = Math.max(0, pageSize - l1.length);
    var launches;
    if(pastLaunchesCount <= 0) {
        launches = l1;
    }
    else if(pastLaunchesCount < pageSize) {
        const l2 = await Launch.find({ datetime: { $lt: new Date() } })
            .sort({ datetime: -1 })
            .limit(pageSize - rem);
        launches = l1.concat(l2);
    }
    else if(pastLaunchesCount == pageSize) {
        const l2 = await Launch.find({ datetime: { $lt: new Date() } })
            .sort({ datetime: -1 })
            .skip((page - pagesUpcomingL - 1) * pageSize + (pageSize - rem))
            .limit(pastLaunchesCount);
        launches = l1.concat(l2);
    }
    res.render('launches/index', { launches, convertDate, page, totalPages, pageSize});
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