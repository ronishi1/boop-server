const { model, Schema, ObjectId } = require('mongoose');

const PageSchema = new Schema(
	{
        _id: {
			type: ObjectId,
			required: true
		},
        page_content: {
            type: String,
        }
    }
);

const Page = model('Page', PageSchema);
module.exports = Page;