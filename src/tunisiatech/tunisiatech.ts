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
  "https://tunisiatech.tn/17-univers-telephonie?q=Catégories-Accessoires+Téléphonies+-Smartphones-Smartwatch+Tunisie/Disponibilité-En+stock/Marque-ACME-infinix-JBL-Xiaomi&order=product.sales.desc";

async function main() {
  const browser: Browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url);

  const shop = await page.evaluate((url) => {
    const convertPrice = (price: string) => {
      return parseFloat(price.replace("DT", ""));
    };
    const itm = Array.from(
      document.querySelectorAll(
        "div.product-list div.products.product-list-wrapper.clearfix.js-product-list-view.columns-3.grid article.product-miniature.js-product-miniature"
      )
    );
    const data = itm.map((items) => ({
      title: items.querySelector(
        "div.product-container.product-style div.second-third-block div.second-block h5.product-name a"
      ).textContent,
      imgSRC: items
        .querySelector(
          "div.product-container.product-style div.first-block div.product-thumbnail a.product-cover-link img"
        )
        .getAttribute("src"),
      link: items
        .querySelector(
          "div.product-container.product-style div.first-block div.product-thumbnail a.product-cover-link"
        )
        .getAttribute("href"),
      price: convertPrice(
        items.querySelector(
          "div.product-container.product-style div.second-third-block div.third-block div.third-block-left div.product-price-and-shipping.d-flex div.first-prices.d-flex.flex-wrap.align-items-center span.price.product-price"
        ).textContent
      ),
      manufacturer: "tunisiatech",
    }));
    const newData: Data[] = [];
    for (let i = 0; i < 12; i++) {
      newData.push(data[i]);
    }
    return newData;
  }, url);
  console.log(shop);
  console.log(shop.length, "items from tunisiatech");
  await browser.close();
  fs.writeFile("data2.json", JSON.stringify(shop), (err: any) => {
    if (err) throw err;
    console.log("file saved JSON");
  });
}
main();
