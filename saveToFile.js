import fs from "fs";
// this function will save contents of the links into `scrappedContent/${url.host}.js`
export default function save() {
	const links = this;
	const url = this.url;
	// creates folder if it does not exist
	if (!fs.existsSync("scrappedContent")) {
		fs.mkdirSync("scrappedContent");
	}
	// writes the files
	fs.writeFile(
		`scrappedContent/${url.host}.js`,
		JSON.stringify(links),
		(err) => {
			if (err) throw err;
			console.log(" link File saved!");
		}
	);
	return this.links;
}
