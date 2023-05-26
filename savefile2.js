import fs from "fs";
export default function saveint(links, filename) {
	// creates folder if it does not exist
	if (!fs.existsSync("scrappedContent")) {
		fs.mkdirSync("scrappedContent");
	}
	// writes the files
	fs.writeFile(
		`scrappedContent/${filename}.json`,
		JSON.stringify(links),
		(err) => {
			if (err) throw err;
			console.log(filename, "saved!");
		}
	);
}
