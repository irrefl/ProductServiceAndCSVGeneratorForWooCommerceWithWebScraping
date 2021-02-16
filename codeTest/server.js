const request = require("request-promise")
const fetch = require('node-fetch')
const express = require('express')
const cheerio = require("cheerio")
const imageDownloader = require('node-image-downloader')
const fs = require('fs')



const app = express()

app.get("/", async (req, res) => {

    let products = await getProducts()

    res.json(products)

    products.forEach(p => DownloadImages('arroces', p.img))

})

app.listen(5000)



const DownloadImages = (destination, imagesrc) => {

    const dir = `./${destination}`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {
            recursive: true
        });
    }

    imageDownloader({
        imgs: [
            {
                uri: imagesrc
            }
        ],
        dest: `./${destination}`, //destination folder
    })
        .then((info) => {
            console.log('all done', info)
        })
        .catch((error, response, body) => {
            console.log('something goes bad!')
            console.log(error)
        })

}

const getProducts = async () => {
    const url = 'https://www.lacolonia.com/supermercado/abarrotes/arroz'

    const response = await fetch(url)

    const body = await response.text()

    const $ = cheerio.load(body)

    const products = []

    $('.la-colonia').each((i, item) => {
        const $item = $(item)

        const name = $item.find('h2.nombreProducto').text()
            .replace(/[\r\n]+/gm, "")
            .trim()

        const price = $item.find('span.mejorPrecio').text()
            .replace(/[\r\n]+/gm, "")
            .trim()

        const img = $item.find('img').attr('src');

        const adress = []
        $item.find('div.address-container .address').each((i, part) => {
            const $part = $(part)

            adress.push($part.text().trim())
        })



        const product = {
            id: i,
            name,
            img,
            price
        }

        products.push(product)
    })

    return products
}