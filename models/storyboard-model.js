const { model, Schema, ObjectId } = require('mongoose');

const storyboardSchema = new Schema(
	{
        _id: {
			type: ObjectId,
			required: true
		},
        series_id: {
			type: ObjectId,
			required: true
		},
        characters:{ type:[
            {
                _id: {type: ObjectId, requred: true},
                character_name: {
                    type: String,
                    required: true
                },
                notes: {
                    type: String,
                },
                character_image: {
                    type: String,
                },

            }
        ]},
        plot_points:{ type:[
            {
                _id: {type: ObjectId, requred: true},
                plot_point_name: {
                    type: String,
                    required: true
                },
                notes: {
                    type: String,
                },
                plot_point_image: {
                    type: String,
                },

            }
        ]},
    }
);

const Storyboard = model('Storyboard', storyboardSchema);
module.exports = Storyboard;