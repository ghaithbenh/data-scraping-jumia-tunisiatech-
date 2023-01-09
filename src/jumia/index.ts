import puppeteer from "puppeteer";
import { Browser } from "puppeteer";
import * as fs from "fs";

interface Data {
  title: string;
  imgSRC: string;
  link: string;
  price: number;
  manufacturer: string;
}

const url =
  "https://www.jumia.com.tn/mlp-telephone-tablette/telephone-tablette/?tag=Boost";

async function main() {
  const browser: Browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url);

  const shop = await page.evaluate((url) => {
    const convertPrice = (price: string) => {
      return parseFloat(price.replace("DT", ""));
    };
    const itm = Array.from(
      document.querySelectorAll("section.card.-fh article.prd._fb.col.c-prd")
    );
    const data = itm.map((items) => ({
      title: items.querySelector("a.core div.info h3.name")?.textContent,
      imgSRC: items
        .querySelector("a.core div.img-c img")!
        .getAttribute("data-src"),
      link: items.querySelector("a.core")?.getAttribute("href"),
      price: convertPrice(
        items.querySelector("a.core div.info div.prc")?.textContent!
      ),
      manufacturer: "jumia",
    }));

    const newData: Data[] = [];
    for (let i = 0; i < 20; i++) {
      newData.push(data[i]);
    }

    return newData;
  }, url);

  console.log(shop);
  console.log(shop.length, "items from jumia");

  await browser.close();
  fs.writeFile("data.json", JSON.stringify(shop), (err: any) => {
    if (err) throw err;
    console.log("file saved JSON");
  });
}
main();
