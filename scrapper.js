import puppeteer from "puppeteer";
import save from "./saveToFile.js";
import saveint from "./savefile2.js";
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
	saveint(citylinks, "citylinks");
	const shelterlinks = [];
	for (let city of citylinks) {
		// console.log("goin to:", city);
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
				shelterlinks.push(link);
			}
		} catch (error) {
			console.log("skipped city:", city);
		}
	}
	saveint(shelterlinks, "shelterlinks");
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
			shelterData.state = "NY";
			shelterData.stateAbbreviation = "New York";
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
				return [contact[0].innerText.trim(), contact[1].href];
			});
			shelterData.phone = phone;
			shelterData.website = website;
			shelterData.description = await page.evaluate(
				() => document.querySelector("div.entry_content > p").innerText
			);
			shelterDataList.push(shelterData);
		} catch (error) {
			console.log("skipped shelter:", shelter);
		}
	}

	// closes browser
	await browser.close();
	let data = shelterDataList;
	data.__proto__.save = save;
	data.__proto__.url = url;
	return data;
}
