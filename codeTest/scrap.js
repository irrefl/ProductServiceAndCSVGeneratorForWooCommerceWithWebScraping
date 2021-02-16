const fetch = require('node-fetch')
const cheerio = require('cheerio')

const getRestaurants = async () =>{
    const url = 'https://www.allmenus.com/il/chicago/'

    //first:'https://www.lacolonia.com/supermercado/abarrotes/cafe-tes-e-infusiones?page=1',

    const response = await fetch(url)

    const body = await response.text()

    const $ = cheerio.load(body)

    const restaurants = []

    $('.restaurant-list-item').each((i, item) =>{
        const $item = $(item)
        const name = $item.find('h4.name').text()

        const adress = []
        $item.find('div.address-container .address').each((i, part)=>{
            const $part = $(part)

            adress.push($part.text().trim())
        })

    
        
        const restaurant = {
            name, 
            address: adress.join('\n')
        }

        restaurants.push(restaurant)
    })

    console.log(restaurants)
}

getRestaurants()