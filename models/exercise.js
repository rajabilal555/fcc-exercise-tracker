const mongoose = require("mongoose");

const ExerciseSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	duration: {
		type: Number,
		required: true,
	},
	date: {
		type: Date,
		required: true,
	},
	__v: { type: Number, select: false },
});

const Exercise = mongoose.model("Exercise", ExerciseSchema);

module.exports = Exercise;
