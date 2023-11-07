const mongoose = require('mongoose');
const Comment = require('./comments');
const Schema = mongoose.Schema;

const LaunchSchema = new Schema({
    organization: String,
    name: String,
    location: String,
    datetime: Date,
    description : String,
    image : {
        url: String,
        filename: String
    },
    author : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
})

LaunchSchema.post('findOneAndDelete', async (doc) => {
    if(doc) {
        await Comment.deleteMany({
            _id: {
                $in: doc.comments 
            }}
        )
    }
})

module.exports = mongoose.model('Launch', LaunchSchema);