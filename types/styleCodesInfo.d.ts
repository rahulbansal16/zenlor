export interface StyleCodesInfo {
    styleCodes: StyleCodes[],
    company: string
}

export type Product = "Shirt" | "Trousers" | "Jeans" | "T-shirts"
export type ProductType = "Wovenwear" | "Knitwear"
export type ProductCategory = "Men Formal Shirt" | "Women Formal Shirt" | "Men T-Shirt" | "Women T-Shirt"
export type FitType = "Slim" | "Regular" | "Custom"
// export type ProductType

// styleCode get, post, put, delete
// styleCodes --> post
// styleCodes --> GET 
// styleCodes/:stylCodeId --> GET
// styleCodes/:stylCodeId --> delete
// styleCodes/:styleCodeId --> PUT 

export interface StyleCodes {
    id: string,
    name: string,
    buyer?: string,
    brand: string
    season?: string, 
    salesChannel?: string,
    product: Product,
    productType: ProductType,
    productCategory: ProductCategory,
    productColor: string,
    productMRP?: number,
    styleDescription?: string,
    fitType?: FitType,
    collarType?:string,
    sleeveType?:string,
    fabricContent?:string,
    fabricPattern?:string,
    fabricWeave?:string,
    fabricWash?:string,
    orderNo?:string,
    confirmDate: string,
    orderQty: number,
    makeQty: number,
    deliveryDate: string,
    unitSellingPrice?:number,
    xsSizeQty?:number,
    sSizeQty?:number,
    mSizeQty?:number,
    xlSizeQty?:number,
    xxlSizeQty?:number,
}