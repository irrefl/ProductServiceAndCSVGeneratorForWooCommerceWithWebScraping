const fetch = require("node-fetch");
const express = require("express");
const cheerio = require("cheerio");

const fs = require("fs");

const { Image } = require("./entities/Image.js");
const { ProductInfo } = require("./entities/ProductInfo");
const upload = require("./upload.js");

const app = express();

const CsvWritter = async (fileName, records, pageNumber) => {
  const dir = `./productos/${fileName}`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {
      recursive: true,
    });
  }

  const createCsvWriter = require("csv-writer").createObjectCsvWriter;

  const csvWriter = createCsvWriter({
    path: `./productos/${fileName}/${fileName}-${pageNumber}.csv`,
    header: [
      { id: "Name", title: "Name" },
      { id: "Isfeatured", title: "Is featured?" },
      { id: "ShortDescription", title: "Short description" },
      { id: "InStock", title: "In stock?" },
      { id: "LowStockAmount", title: "Low stock amount" },
      { id: "SoldIndividually", title: "Sold individually?" },
      { id: "Weight", title: "Weight (kg)" },
      { id: "AllowCustomerReviews", title: "Allow customer reviews?" },
      { id: "SalePrice", title: "Sale price" },
      { id: "RegularPrice", title: "Regular price" },
      { id: "Categories", title: "Categories" },
      { id: "Img", title: "Images" },
    ],
  });

  csvWriter
    .writeRecords(records)
    .then(() => {
      console.log("All done");
    })
    .catch((err) => console.log(err));
};

const ProductsPager = (parentCategory, childCategory, pageNumber) => {
  let uri = `https://www.lacolonia.com/supermercado/${parentCategory}/${childCategory}?page=${pageNumber}`;
  return uri;
};

const GetCustomProducts = async (
  parentCategory,
  childCategory,
  pageNumber,
  customCategoryName
) => {
  const pageUri = ProductsPager(parentCategory, childCategory, pageNumber);

  const response = await fetch(pageUri);

  const body = await response.text();

  const $ = cheerio.load(body);

  const products = [];

  $("div.vtex-search-result-3-x-galleryItem ").each((i, item) => {
    const $item = $(item);

    const Name = $item
      .find("h3.vtex-product-summary-2-x-productNameContainer")
      .text();
    // .replace(/[\r\n]+/gm, "")
    //.trim()

    const searchRegExp = /L/gi;
    const replaceWith = "";

    const price = $item
      .find("span.vtex-store-components-3-x-sellingPrice")
      .text()
      .replace(searchRegExp, replaceWith)
      .trim();
    // .replace(/[\r\n]+/gm, "")
    // .trim()

    const Img = $item.find("img").attr("src");

    let correctNamedImage = Img.split("?")[0];

    const ProductInfo = {
      Name,
      Isfeatured: 0,
      ShortDescription: `${Name}`,
      InStock: 1,
      LowStockAmount: 3,
      SoldIndividually: 1,
      Weight: 2,
      AllowCustomerReviews: 1,
      SalePrice: price,
      RegularPrice: price + 3.3,
      Categories: `Despensa > ${childCategory}`,
      Img: correctNamedImage,
    };

    let product = new Image(ProductInfo);
    products.push(product);
  });

  return products;
};

const GenerateCustomProducts = async ({
  pageNumber,
  pageLimit,
  parentCategory,
  childCategory,
  customCategoryName,
}) => {
  let _pageNumber = pageNumber;
  let _products = [];
  while (_pageNumber <= pageLimit) {
    let productsPerPage = await GetCustomProducts(
      parentCategory,
      childCategory,
      pageNumber,
      customCategoryName
    );
    _products.push(...productsPerPage);

    _pageNumber++;
  }
  return _products;
};

let categorias = {
  despensa: "abarrotes",
  cafes: "cafe-tes-e-infusiones",
  granolas: "cereales-avenas-granolas-y-barras",
  frijoles: "frijoles",
  endulzantes: "endulzante",
  harinas: "harinas",
  leches: "leches-en-polvo-suplementos-y-modificadores",
  enlatados: "enlatados-y-empacados",
  mantecas: "aceites-y-mantecas",
  mieles : 'panqueques-jaleas-cremas-para-untar-y-miel',
  arroz : 'arroz',
  galletas : 'galletas',
  pastas:'pastas-tamales-y-pure-de-papas',
  frutasEnlata :'postres-y-frutas-en-conserva',
  aderezos : 'salsas-aderezos-y-toppings'
};

const App = async () => {
  const {
    despensa,
    frijoles,
    endulzantes,
    harinas,
    leches,
    enlatados,
    mantecas,
    mieles,
    arroz,
    galletas,
    pastas,
    frutasEnlata,
    aderezos
  } = categorias;

  const child = aderezos;

  let val = 3, count = 1;
  while(count <= val){
    const pagesConfig = {
        pageNumber: val,
        pageLimit: val,
        parentCategory: despensa,
        childCategory: child,
        customCategoryName: "Cereales y Barras",
      };
      const allProducts = await GenerateCustomProducts(pagesConfig);
    
      const newData = await upload.ImagesDataApiGenerator(allProducts);
      const output = await CsvWritter(child, newData, count);

      count++;
  }
};

App();

app.get("/", async (req, res) => {
  const { despensa, granolas } = categorias;

  const pagesConfig = {
    pageNumber: 1,
    pageLimit: 2,
    parentCategory: despensa,
    childCategory: granolas,
    customCategoryName: "Cereales y Barras",
  };
  const allProducts = await GenerateCustomProducts(pagesConfig);

  const newData = await upload.ImagesDataApiGenerator(allProducts);
  const output = await CsvWritter(granolas, newData, pagesConfig.pageNumber);

  res.json(allProducts);
});

//app.listen(7000)
