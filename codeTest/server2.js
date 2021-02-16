const request = require("request-promise")
const fetch = require('node-fetch')
const express = require('express')
const cheerio = require("cheerio")
const imageDownloader = require('node-image-downloader')
const { json } = require('body-parser')



const app = express()

const DownloadImages = (destination, imagesrc) => {
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


app.get("/", async (req, res) => {

    let products = await getRestaurants()
    res.json(products)
    console.log(products)
})

app.listen(8000)


const getRestaurants = async () => {
    const url = 'https://www.lacolonia.com/supermercado/abarrotes/aceites-y-mantecas'

    const response = await fetch(url)

    const body = await response.text()

    const $ = cheerio.load(body)

    const products = []

    $('.prateleira .n20colunas').each((i, item) => {
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



        const restaurant = {
            id:i,
            name,
            img,
            price
        }

        products.push(restaurant)
    })

    return products
}