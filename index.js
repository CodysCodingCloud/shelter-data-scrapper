import puppeteerScrapper from "./scrapper.js";
const testLink = "https://www.homelessshelterdirectory.org/state/new-york.html";
const scrappedLinksPuppeteer = await puppeteerScrapper(testLink);
console.log("scrapping ny data");
console.log(scrappedLinksPuppeteer);
// scrappedLinksPuppeteer.save();
