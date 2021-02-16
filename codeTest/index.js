const express = require('express')
const cheerio = require("cheerio")
const imageDownloader = require('node-image-downloader')
const request = require("request")
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


app.get("/", (req, res) => {
    let url = 'https://www.lacolonia.com/supermercado/abarrotes/arroz?O=OrderByScoreDESC'

    let products = []
    request(url, (error, response, html) => {
        if (!error) {
            var $ = cheerio.load(html)

            var imageSrc = $('.resultItemsWrapper').each((index, element) => {

                //const htmlContent = $(element).html()

                const productName = $(element).find('.mejorPrecio').map((i, obj) => $(obj).text()
                    .replace(/[\r\n]+/gm, "")
                    .trim())

                products.push(productName)
                /*const uniquePrice = $(element).find('.mejorPrecio')
                    .each((index, element) => {

                        const productPrice = $(element)
                            .text()
                            .replace(/[\r\n]+/gm, "")
                            .trim()

                        products.push({productPrice} )
                    })*/

                /*const product = {
                    productName,
                    uniquePrice
                }

                /(\r\n|\n|\r)/gm," "

                res.json(product)*/

                res.json(products)
            })

            /*let output = imageSrc.html()
            console.log(output)*/
            // DownloadImages('downloads', imageSrc)
        }
    })
})

app.listen(5000)


