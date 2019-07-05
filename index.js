const mongoose = require("mongoose");
const config = require("config");
const Company = require("./classes/Company");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
// const ASXScraper = require("./classes/ASXScraper");
// const scraper = new ASXScraper();
// console.log(scraper);

app.set("view engine", "pug");

mongoose
	.connect(
		`mongodb+srv://${config.get("dbConnection.username")}:${config.get(
			"dbConnection.password"
		)}@studybox-mjczc.mongodb.net/test`,
		{ useNewUrlParser: true }
	)
	.then(() => {
		console.log("Connected to MongoDB...");
		//scraper.runScraper();
	})
	.catch(err => console.error("Could not connect...", err));

app.get("/", (req, res) => {
	let query = Company.find({ companyCode: "A2M" }, (err, docs) => {
		if (err) throw err;
		console.log(docs);
	}).limit(500);
	let promise = query.exec();
	promise.then(data => {
		res.render("home", { companies: data });
	});
});

app.listen(PORT, err => {
	if (err) throw err;
	console.log(`Listening to port ${PORT}...`);
});
