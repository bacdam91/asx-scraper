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

async function getCompanies() {
	return await Company.find()
		.limit(100)
		.sort({ companyName: "asc" });
}

app.get("/", (req, res) => {
	getCompanies()
		.then(data => {
			res.render("home", { companies: data });
		})
		.catch(err => {
			res.send("Something went wrong.");
		});
});

app.listen(PORT, err => {
	if (err) throw err;
	console.log(`Listening to port ${PORT}...`);
});
