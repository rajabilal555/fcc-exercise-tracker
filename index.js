const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const mongoose = require("mongoose");
let User = require("./models/user");
let Exercise = require("./models/exercise");

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
		User.find({ _id: req.params._id });

		Exercise.find({ username: req.params.id }, function (err, users) {
			res.json(users);
		});
	} catch (err) {
		res.status(400).json([err]);
	}
});
app.get("/api/users/:_id/logs", async function (req, res) {
	//[from][&to][&limit]
	console.log(req.query);
});

const listener = app.listen(process.env.PORT || 3000, () => {
	console.log("Your app is listening on port " + listener.address().port);
});
