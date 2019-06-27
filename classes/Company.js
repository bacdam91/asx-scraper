const cheerio = require("cheerio");

class Company {
	constructor(name, code, link, industry) {
		this.name = name;
		this.code = code;
		this.link = link;
		this.industry = industry;
	}

	extractCompanyDetails(columns) {
		const $ = cheerio.load(columns);
		this.name = $(columns[0]).html();
		this.code = $(columns[1])
			.find("a")
			.html();
		this.link = $(columns[1])
			.find("a")
			.prop("href");
		this.industry = $(columns[2]).html();
	}

	printCompanyDetails() {
		console.log(
			`${this.name}, ${this.code}, ${this.industry}, ${this.link}`
		);
	}
}

module.exports = Company;
