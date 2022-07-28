const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const mongoose = require("mongoose");
let User = require("./models/user");
let Exercise = require("./models/exercise");
let helpers = require("./misc/helpers");

mongoose.connect(process.env.MONGO_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
const db = mongoose.connection;
db.once("open", function () {
	console.log("Connected to database successfully...");
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/views/index.html");
});

app.get("/api/users", async function (req, res) {
	try {
		User.find({}, function (err, users) {
			res.json(users);
		});
	} catch (err) {
		res.status(400).json(err);
	}
});
app.post("/api/users", async function (req, res) {
	const user = new User({
		username: req.body.username,
	});
	try {
		await user.save();
		res.json(user);
	} catch (err) {
		res.status(400).json({ error: "Cannot Add User", details: err });
	}
});
app.post("/api/users/:_id/exercises", async function (req, res) {
	try {
		User.findOne({ _id: req.params._id }, function (err, user) {
			if (user) {
				let date = helpers.formatDate(new Date(), "yyy-mm-dd");
				if (req.body.date) {
					date = req.body.date;
				}
				const exercise = new Exercise({
					username: user.username,
					description: req.body.description,
					duration: req.body.duration,
					date: date,
				});
				exercise.save();

				res.json({
					_id: user._id,
					username: user.username,
					description: exercise.description,
					duration: exercise.duration,
					date: exercise.date,
				});
			} else {
				res.status(400).json({ error: "Invalid user" });
			}
		});
	} catch (err) {
		res.status(400).json(err);
	}
});
app.get("/api/users/:_id/logs", async function (req, res) {
	console.log(req.query);
	User.findOne({ _id: req.params._id }, function (err, user) {
		console.log(user);
		if (user) {
			let searchQuery = {};
			if (req.query.from) {
				searchQuery.date = { $gte: req.query.from };
			}
			if (req.query.to) {
				searchQuery.date = { $lte: req.query.to };
			}

			//[from][&to][&limit]
			Exercise.find(
				{ username: user.username, ...searchQuery },
				"description duration date"
			)
				.limit(req.query.limit || 10)
				.exec(function (err, exercises) {
					res.json({
						_id: user._id,
						username: user.username,
						count: exercises.length,
						log: exercises.map((val) => val.toJSON()),
					});
				});
		} else {
			res.status(400).json({ error: "Invalid user" });
		}
	});
});

const listener = app.listen(process.env.PORT || 3000, () => {
	console.log("Your app is listening on port " + listener.address().port);
});
