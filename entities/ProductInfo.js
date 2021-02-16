class ProductInfo {
    constructor() {
        this.Name = '';
        this.Isfeatured = 0;
        this.ShortDescription = '';
        this.InStock = 0;
        this.LowStockAmount = 0;
        this.SoldIndividually = 1;
        this.Weight = 0;
        this.AllowCustomerReviews = 0;
        this.SalePrice = 0;
        this.RegularPrice = 0;
        this.Categories = '';
        this.Img = '';
    }

    WithName(name) {
        this.Name = name
        return this;
    }


    WithShortDescription(description) {
        this.ShortDescription = description
        return this;
    }


    WithLowStockAmount(lowStock) {
        this.LowStockAmount = lowStock
        return this;
    }

    WithDiscount(haveDiscount) {
        this.Isfeatured = haveDiscount
        return this;
    }

    SetAvailable(inStock) {
        this.InStock = inStock
        return this;
    }

    CanSoldIndividually(soldIndividually) {
        this.SoldIndividually = soldIndividually
        return this;
    }
    AllowReviews(allowReview) {
        this.AllowCustomerReviews = allowReview
        return this;
    }

    WithSalePrice(salePrice) {
        this.SalePrice = salePrice
        return this;
    }

    WithRegularPrice(regularPrice) {
        this.RegularPrice = regularPrice
        return this;
    }

    WithCategory(category) {
        this.Categories = category;
        return this;
    }


    WithImage(img) {
        this.Img = img;
        return this;
    }

    Build() {
        return {
            Name: this.Name,
            Isfeatured: this.Isfeatured,
            ShortDescription: this.ShortDescription,
            InStock: this.InStock,
            LowStockAmount: this.LowStockAmount,
            SoldIndividually: this.SoldIndividually,
            Weight: this.Weight,
            AllowCustomerReviews: this.AllowCustomerReviews,
            SalePrice: this.SalePrice,
            RegularPrice: this.RegularPrice,
            Categories: this.Categories,
            Img: this.Img,
        }

    }
}


module.exports = {
    ProductInfo
}