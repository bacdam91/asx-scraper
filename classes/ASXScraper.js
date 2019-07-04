const Company = require("./Company");
const request = require("request");
const cheerio = require("cheerio");
const requestPromise = require("request-promise-native");

class ASXScraper {
	static getPageRange() {
		const PAGE_RANGE = "0-9,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z".split(
			","
		);
		return PAGE_RANGE;
	}

	async getASXPage(pageRange) {
		return await requestPromise(
			"https://www.asx.com.au/asx/research/listedCompanies.do?coName=" +
				pageRange
		);
	}

	parseHTML(htmlString) {
		return cheerio.load(htmlString, { normalizeWhitespace: true });
	}

	getTableRows($) {
		return $(".contenttable").find("tr");
	}

	getCompanyDetails(currentRow, $) {
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

	async runScraper() {
		let self = this;
		let pageRange = ASXScraper.getPageRange();
		for (let i = 0; i < pageRange.length; i++) {
			let currentRange = pageRange[i];
			const page = await this.getASXPage(currentRange);
			const $ = this.parseHTML(page);
			const rows = this.getTableRows($);

			rows.each(function(index) {
				let currentRow = $(rows[index]);
				self.getCompanyDetails(currentRow, $);
			});
		}
	}
}

module.exports = ASXScraper;
