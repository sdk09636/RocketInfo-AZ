const Joi = require('joi');

const launchSchema = Joi.object({
    launch: Joi.object(
        {
            organization: Joi.string().required(),
            name: Joi.string().required(),
            location: Joi.string().required(),
            datetime: Joi.date().required(),
            description : Joi.string().required(),
        }
    ).required()
});

const commentSchema = Joi.object({
    comment: Joi.object(
        {
            body: Joi.string().required(),
            likes: Joi.number()
        }
    ).required()
});

module.exports.launchSchema = launchSchema;
module.exports.commentSchema = commentSchema;