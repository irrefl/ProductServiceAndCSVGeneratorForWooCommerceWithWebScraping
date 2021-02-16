const records = allProducts;
const output = await CsvWritter(childCategory, records)

allProducts.forEach(pro => {
    const { imageUrl, imageName } = pro;
    upload.UploadImageFromUrl(imageUrl, imageName, childCategory)
})
allProducts.forEach(p => DownloadImages('cafes', p.Img))


const imageDownloader = require('node-image-downloader')

const DownloadImages = async (destination, imagesrc) => {
    console.log(imagesrc)
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
            //console.log(error)
        })

}
