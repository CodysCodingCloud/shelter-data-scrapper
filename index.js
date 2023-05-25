import puppeteerScrapper from "./scrapper.js";
// const testLink = "https://www.homelessshelterdirectory.org/state/new-york.html";
// const testLink = "https://www.homelessshelterdirectory.org/state/california";
import stateInfo from "./state_links.json" assert { type: "json" };
const get_data = async function (stateNum) {
	const state = stateInfo[stateNum];
	// const state = "New York";
	// const stateAbbreviation = "NY";
	console.log(`scrapping data from ${state.state}`);

	const scrappedLinksPuppeteer = await puppeteerScrapper(
		state.link,
		state.state,
		state.stateAbbreviation
	);

	// console.log(scrappedLinksPuppeteer);
	scrappedLinksPuppeteer.save(state.saveFile);
};
const get_data_range = async function (start, end) {
	for (let i = start; i <= end; i++) {
		await get_data(i);
	}
};
get_data_range(5, 10);
