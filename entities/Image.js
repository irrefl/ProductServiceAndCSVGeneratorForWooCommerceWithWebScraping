
const ProductInfo = require('./ProductInfo')

class Image {
    constructor(ProductInfo) {

        const { Name,
            Isfeatured,
            ShortDescription,
            InStock,
            LowStockAmount,
            SoldIndividually,
            Weight,
            AllowCustomerReviews,
            SalePrice,
            RegularPrice,
            Categories,
            Img } = ProductInfo;

        this.Name = Name;
        this.Isfeatured = Isfeatured;
        this.ShortDescription = ShortDescription;
        this.InStock = InStock;
        this.LowStockAmount = LowStockAmount;
        this.SoldIndividually = SoldIndividually;
        this.Weight = Weight;
        this.AllowCustomerReviews = AllowCustomerReviews;
        this.SalePrice = SalePrice;
        this.RegularPrice = RegularPrice;
        this.Categories = Categories;
        this.Img = Img;
    }

    getChildCategory() {
        let processedCategory = this.Categories.trim()
            .split(">")[1]
            .replace(/, /g, '-')
            .trim();

        return processedCategory;
    }

    getNewName() {
        let newName = this.Name.replace(/-/g, ', ')
            .replace(/^\w/, c => c.toUpperCase());

        return newName;
    }
}

module.exports = { Image }