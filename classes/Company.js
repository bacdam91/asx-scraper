const cheerio = require("cheerio");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CompanySchema = new Schema({
	companyName: { type: String, required: true },
	companyCode: { type: String, min: 3, required: true },
	industryGroup: String,
	link: String,
	price: Number
});

CompanySchema.methods.extractCompanyDetails = function(columns) {
	const $ = cheerio.load(columns);
	this.companyName = $(columns[0]).html();
	this.companyCode = $(columns[1])
		.find("a")
		.html();
	this.link = $(columns[1])
		.find("a")
		.prop("href");
	this.industryGroup = $(columns[2]).html();
};

CompanySchema.methods.printCompanyDetails = function() {
	console.log(
		`${this.companyName}, ${this.companyCode}, ${this.industryGroup}, ${
			this.link
		}`
	);
};

CompanySchema.methods.setPrice = function(price) {
	this.price = price;
};

const Company = mongoose.model("Company", CompanySchema);

module.exports = Company;
