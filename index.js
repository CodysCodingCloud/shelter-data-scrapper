import puppeteerScrapper from "./scrapper.js";

import stateInfo from "./state_links.json" assert { type: "json" };
// grabs state data one at a time
const get_data = async function (stateNum) {
	const state = stateInfo[stateNum];
	// states that need a retry
	if (!["TX"].includes(state.stateAbbreviation)) return;

	console.log(`scrapping data from ${state.state}`);

	const scrappedLinksPuppeteer = await puppeteerScrapper(
		state.link,
		state.state,
		state.stateAbbreviation
	);

	// console.log(scrappedLinksPuppeteer);
	scrappedLinksPuppeteer.save(state.saveFile);
};
// get_data(1);
const get_data_range = async function (start, end) {
	for (let i = start; i < end; i++) {
		await get_data(i);
	}
};
// control how many states to pull from at a time
get_data_range(0, 50);
