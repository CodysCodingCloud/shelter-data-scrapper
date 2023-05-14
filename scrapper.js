import puppeteer from "puppeteer";
import save from "./saveToFile.js";

export default async function puppeteerScrapper(url) {
	// converts url into a useable format for the save function later
	if (typeof url === "string") {
		url = new URL(url);
	}

	const browser = await puppeteer.launch({ headless: "new" });
	const page = await browser.newPage();
	await page.goto(url);

	// Grabs HTML content
	const citylinks = await page.evaluate(() =>
		Array.from(
			document.querySelectorAll("table > tbody > tr > td:first-child > a")
		).map((e) => e.href)
	);
	const shelterlinks = [];
	let count = 0;
	for (let city of citylinks) {
		// let city = citylinks[0];

		// console.log(typeof city);
		if (count < 3) {
			console.log("goin to:", city);
			await page.goto(new URL(city));
			const shelterlink = await page.evaluate(() =>
				Array.from(
					document.querySelectorAll(
						"div.layout_post_2.clearfix > div.item_content > a.btn.btn_red"
					)
				).map((e) => e.href)
			);
			for (let link of shelterlink) {
				shelterlinks.push(link);
			}
		}
		count++;
	}
	console.log(count);
	// closes browser
	await browser.close();
	let data = shelterlinks;
	data.__proto__.save = save;
	data.__proto__.url = url;
	return data;
}
