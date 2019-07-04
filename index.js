const mongoose = require("mongoose");
const config = require("config");
// const ASXScraper = require("./classes/ASXScraper");
// const scraper = new ASXScraper();
// console.log(scraper);

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
