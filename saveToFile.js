import fs from "fs";
// this function will save contents of the links into `scrappedContent/${url.host}.js`
export default function save(setfn) {
	const links = this;
	const url = this.url;
	// creates folder if it does not exist
	if (!fs.existsSync("scrappedContent")) {
		fs.mkdirSync("scrappedContent");
	}
	// writes the files
	const saveFileName = setfn || url.host;
	fs.writeFile(
		`scrappedContent/${saveFileName}.js`,
		JSON.stringify(links),
		(err) => {
			if (err) throw err;
			console.log(" link File saved! to", saveFileName);
		}
	);
	return this.links;
}
