<<<<<<< HEAD
const mongoose = require("mongoose");
const config = require("config");
// const ASXScraper = require("./classes/ASXScraper");
// const scraper = new ASXScraper();
// console.log(scraper);
=======
require("express-async-errors");
const request = require("request");
const cheerio = require("cheerio");
const requestPromise = require("request-promise-native");
const Company = require("./classes/Company");
const mongoose = require("mongoose");
const config = require("config");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const PAGE_RANGE = "0-9,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z".split(
	","
);

async function getASXPage(pageRange) {
	return await requestPromise(
		"https://www.asx.com.au/asx/research/listedCompanies.do?coName=" +
			pageRange
	);
}

function parseHTML(htmlString) {
	return cheerio.load(htmlString, { normalizeWhitespace: true });
}

function getTableRows($) {
	return $(".contenttable").find("tr");
}

function getCompanyDetails(currentRow, $) {
	let columns = currentRow.children("td");
	if (columns.length > 0) {
		let company = new Company();
		company.extractCompanyDetails(columns);
		company.save(function(err) {
			if (err) throw err;
			company.printCompanyDetails();
		});
	}
}

async function runScraper(range) {
	const page = await getASXPage(range);
	const $ = parseHTML(page);
	const rows = getTableRows($);
	rows.each(function(index) {
		let currentRow = $(rows[index]);
		getCompanyDetails(currentRow, $);
	});
}
>>>>>>> d6da5267a0e03f14311a3d5d1875f7fe8eec6e57

mongoose
	.connect(
		`mongodb+srv://${config.get("dbConnection.username")}:${config.get(
			"dbConnection.password"
		)}@studybox-mjczc.mongodb.net/test`,
		{ useNewUrlParser: true }
	)
	.then(() => {
<<<<<<< HEAD
		console.log("Connected to MongoDB...");
		//scraper.runScraper();
=======
		console.log("Connected to DB...");
		// for (let i = 0; i < PAGE_RANGE.length; i++) {
		// 	runScraper(PAGE_RANGE[i]);
		// }
>>>>>>> d6da5267a0e03f14311a3d5d1875f7fe8eec6e57
	})
	.catch(err => console.error("Could not connect...", err));

app.get("/", (req, res) => {
	res.send("Hello");
});

app.listen(PORT, err => {
	if (err) throw err;
	console.log(`Listening to port ${PORT}...`);
});
