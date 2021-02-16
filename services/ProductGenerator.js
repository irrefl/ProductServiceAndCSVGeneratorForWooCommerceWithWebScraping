
const fetch = require('node-fetch')
const cheerio = require("cheerio")

const { Image } = require('../entities/Image');


const ProductsPager = (parentCategory, childCategory, pageNumber) => {
    let uri = `https://www.lacolonia.com/supermercado/${parentCategory}/${childCategory}?page=${pageNumber}`;
    return uri;
}


const GetCustomProducts = async (parentCategory, childCategory, pageNumber) => {

    const pageUri = ProductsPager(parentCategory, childCategory, pageNumber);


    const products = []

    const body = await fetch(pageUri)
                        .then(response => response.text())
                        .catch(err => console.log(err))
    //const body = await response.text()

    const $ = cheerio.load(body)

    $('div.vtex-search-result-3-x-galleryItem ').each((i, item) => {
        const $item = $(item)

        const Name = $item.find('h3.vtex-product-summary-2-x-productNameContainer').text()
        // .replace(/[\r\n]+/gm, "")
        //.trim()

        const searchRegExp = /L/gi;
        const replaceWith = '';

        const price = $item.find('span.vtex-store-components-3-x-sellingPrice').text()
            .replace(searchRegExp, replaceWith).trim();
        // .replace(/[\r\n]+/gm, "")
        // .trim()

        const Img = $item.find('img').attr('src');

        let correctNamedImage = Img.split('?')[0]



        const ProductInfo = {
            Name,
            Isfeatured: 1,
            ShortDescription: `${Name}`,
            InStock: 1,
            LowStockAmount: 3,
            SoldIndividually: 1,
            Weight: 2,
            AllowCustomerReviews: 1,
            SalePrice: price,
            RegularPrice: price + 300,
            Categories: `Despensa > Cafes e Infusiones`,
            Img: correctNamedImage,
        }

        let product = new Image(ProductInfo);
        products.push(product)

    })


    return products
}



const GetProducts = async (parentCategory, childCategory, pageNumber) => {

    const pageUri = ProductsPager(parentCategory, childCategory, pageNumber);

    const response = await fetch(pageUri)

    const body = await response.text()

    const $ = cheerio.load(body)

    const products = []


    $('div.vtex-search-result-3-x-galleryItem ').each((i, item) => {
        const $item = $(item)

        const Name = $item.find('h3.vtex-product-summary-2-x-productNameContainer').text()
        // .replace(/[\r\n]+/gm, "")
        //.trim()

        const searchRegExp = /L/gi;
        const replaceWith = '';

        const price = $item.find('span.vtex-store-components-3-x-sellingPrice').text()
            .replace(searchRegExp, replaceWith).trim();
        // .replace(/[\r\n]+/gm, "")
        // .trim()


        const ReplaceWith = '';
        const Img = $item.find('img').attr('src');

        let data = Img.split('?')


        const product = {
            Name,
            Isfeatured: 1,
            ShortDescription: `${Name}`,
            InStock: 1,
            LowStockAmount: 3,
            SoldIndividually: 1,
            Weight: 2,
            AllowCustomerReviews: 1,
            SalePrice: price,
            RegularPrice: price + 3,
            Categories: `${parentCategory} > ${childCategory}`,
            Img: data,
        }

        products.push(product)
        countId++;
    })

    return products
}





module.exports = {
    GetCustomProducts
}