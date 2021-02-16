let { Image } = require('./entities/Image.js');

var ImageKit = require("imagekit");

var imagekit = new ImageKit({
    publicKey: "public_AmM3XtAwat+P5K5gzgbGssNHhxc=",
    privateKey: "private_AeOgv5nohKuGtpgQ4AN1HibKWEA=",
    urlEndpoint: "https://ik.imagekit.io/wlqrwe5vf6p"
});

var fs = require('fs');

function capitalize(str) {
    const t = str.replace(/-/g, ', ')
        .replace(/^\w/, c => c.toUpperCase());
    return t;
}

const ImageUploader = async (dataSource) => {

    var newData = dataSource;

    let index = 0;
    for (let product of dataSource) {

        const { Img } = product;

        let childCategory = product.getChildCategory();

        let newName = product.getNewName();

        const res = await imagekit.upload({
            file: Img, //required
            fileName: `${newName}.png`, //required,
            folder: `/${childCategory}`
        });

        newData[index].Img = res.url;

        index++;

    }

    return newData;

}



const ImagesDataApiGenerator = async (dataSource) => {

    const newProducts = await ImageUploader(dataSource);
    return newProducts;

}


function UploadImageFromLocalhost() {

    fs.readFile('./cafes/164302-500-auto.jpeg', function (err, data) {
        if (err) throw err; // Fail if the file can't be read.
        imagekit.upload({
            file: data, //required
            fileName: "/cafes/primerCafe.jpg", //required
        }, function (error, result) {
            if (error) console.log(error);
            else console.log(result);
        });
    });

    let i = "https://lacolonia.vtexassets.com/arquivos/ids/222523-500-auto"

}


function ReadImage() {
    var imageURL = imagekit.url({
        src: "https://ik.imagekit.io/wlqrwe5vf6p/Bebidas/nectar_sula_tetrapack_manzana_rvjLvU4TSc.jpg",
        transformation: [{
            "height": "300",
            "width": "400"
        }]
    });

    console.log(imageURL)

}

module.exports = {
    ImagesDataApiGenerator
}