const mongoose = require("mongoose");
const config = require("config");
const Company = require("./classes/Company");
const ASXScraper = require("./classes/ASXScraper");
const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;
// const ASXScraper = require("./classes/ASXScraper");
// const scraper = new ASXScraper();
// console.log(scraper);

app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

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

async function getCompanies(pageRange) {
	let regexp =
		pageRange === "0-9"
			? new RegExp("^[0-9]")
			: new RegExp("^" + pageRange);
	return await Company.find({ companyName: regexp }).sort({
		companyName: "asc"
	});
}

async function getCompany(companyCode) {
	return await Company.find({ companyCode });
}

async function getCompanyInfo(companyCode) {
	const asxScraper = new ASXScraper();
	const price = await asxScraper.getCompanyFinancials(companyCode);
	//console.log(price);
	const company = await getCompany(companyCode);
	company[0].setPrice(price);
	return company;
}

app.get("/", (req, res) => {
	res.render("home");
});

app.get("/companies/:page", (req, res) => {
	const page = req.params.page;
	getCompanies(page).then(data => {
		res.header("Content-type", "text/plain").send(JSON.stringify(data));
	});
});

app.get("/company/:companyCode", (req, res) => {
	const companyCode = req.params.companyCode;
	getCompanyInfo(companyCode).then(data => {
		//console.log(data);
		res.header("Content-type", "text/plain").send(data);
	});
});

app.listen(PORT, err => {
	if (err) throw err;
	console.log(`Listening to port ${PORT}...`);
});
