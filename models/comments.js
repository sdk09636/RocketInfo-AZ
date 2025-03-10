const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    body: String,
    likes: Number,
    author : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    usersLiked: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
});

module.exports = mongoose.model('Comment', commentSchema);