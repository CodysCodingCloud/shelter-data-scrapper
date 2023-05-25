import puppeteer from "puppeteer";
import save from "./saveToFile.js";
import saveint from "./savefile2.js";
// import { cities as citylinks } from "./skippedlinks.js";
// import { shelter as shelterlinks } from "./skippedlinks.js";

export default async function puppeteerScrapper(url, state, stateAbbreviation) {
	// converts url into a useable format for the save function later
	if (typeof url === "string") {
		url = new URL(url);
	}

	const browser = await puppeteer.launch({ headless: "new" });
	const page = await browser.newPage();
	await page.goto(url);

	// grabs links to all cities and saves it to a file.
	const citylinks = await page.evaluate(() =>
		Array.from(document.querySelectorAll("table > tbody > tr"))
			.filter((row) => {
				const secondColumn = row.querySelector("td:nth-child(2)");
				if (!secondColumn) return false;
				return secondColumn.innerText.trim();
			})
			.map((row) => {
				console.log("hi?");
				return row.querySelector("td:first-child > a").href;
			})
	);
	saveint(citylinks, "citylinks");

	// visits cities and grabs shelter links, a Set is used for checking duplicate links
	const shelterLinksSet = new Set();
	let errorcount = 0;
	let dupe = 0;
	for (let city of citylinks) {
		try {
			await page.goto(new URL(city));
			const shelterlink = await page.evaluate(() =>
				Array.from(
					document.querySelectorAll(
						"div.layout_post_2.clearfix > div.item_content > a.btn.btn_red"
					)
				).map((e) => e.href)
			);
			for (let link of shelterlink) {
				if (shelterLinksSet.has(link)) dupe++;
				shelterLinksSet.add(link);
			}
		} catch (error) {
			console.log("skipped city:", city);
			console.log(error);

			if (errorcount < 10) {
				// retry link
				citylinks.push(city);
				errorcount++;
			}
		}
	}
	console.log(`there were ${dupe} duplicate link(s)`);
	const shelterlinks = [...shelterLinksSet];
	saveint(shelterlinks, "shelterlinks");

	// visits shelters and grabs shelter data
	let shelterDataList = [];
	for (let shelter of shelterlinks) {
		try {
			await page.goto(new URL(shelter));
			const shelterData = {};

			let addressdata = await page.evaluate(() =>
				document
					.querySelector("div.entry_content > div.row > div.col.col_4_of_12")
					.innerText.split("\n")
			);
			shelterData.addressLine1 = addressdata[1];
			shelterData.city = addressdata[2].split(", ")[0];
			shelterData.state = state;
			shelterData.stateAbbreviation = stateAbbreviation;
			let postal = addressdata[2].match(/\d{5}/);
			shelterData.postal = postal ? postal[0] : "00000";
			shelterData.name = await page.evaluate(
				() =>
					document.querySelector("div.entry_content > h1.entry_title").innerText
			);
			shelterData.organization = shelterData.name;

			let [phone, website] = await page.evaluate(() => {
				let contact = document.querySelectorAll(
					"div.entry_content > div.row > div.col.col_8_of_12 > p > a"
				);
				let phone = contact[0]?.innerText?.trim() || "";
				let website = contact[1]?.href || "";
				return [phone, website];
			});
			shelterData.phone = phone;
			shelterData.website = website;
			shelterData.description = await page.evaluate(
				() => document.querySelector("div.entry_content > p").innerText
			);
			if (shelterData.name.length > 0) {
				shelterDataList.push(shelterData);
			}
		} catch (error) {
			console.log("skipped shelter:", shelter);
			console.log(error);
		}
	}

	// closes browser
	await browser.close();
	let data = shelterDataList;
	data.__proto__.save = save;
	data.__proto__.url = url;
	return data;
}
