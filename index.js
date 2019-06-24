const request = require("request");
const cheerio = require("cheerio");
const requestPromise = require("request-promise-native");
const fs = require("fs");

// requestPromise(
// 	"https://www.psa.org.au/wp-content/uploads/2018/05/cropped-psa-logo.png"
// ).pipe(fs.createWriteStream("./resources/logo.png"));

const stream = fs.createReadStream("./resources/test.html", "utf8");

requestPromise(
	"https://www.asx.com.au/asx/research/listedCompanies.do?coName=0-9"
)
	.then(function(htmlString) {
		const $ = cheerio.load(htmlString, { normalizeWhitespace: true });

		const contentTable = $(".contenttable");
		const rows = contentTable.find("tr");

		rows.each(function(index) {
			let currentRow = rows[index];
			let columns = $(currentRow).children("td");
			if (columns.length > 0) {
				let companyName = $(columns[0]).html();
				let companyCode = $(columns[1])
					.find("a")
					.html();
				let link = $(columns[1])
					.find("a")
					.prop("href");
				let industry = $(columns[2]).html();

				console.log(
					`${companyName}, ${companyCode}, ${industry}, ${link}`
				);
			}
		});
	})
	.catch(err => {
		console.log(err);
	});

// stream.on("data", chunk => {
// 	const $ = cheerio.load(chunk, { normalizeWhitespace: true });
// 	const fruitNames = $(".fruit");

// 	fruitNames.each(index => {
// 		console.log($(fruitNames[index]).html());
// 	});
// });
