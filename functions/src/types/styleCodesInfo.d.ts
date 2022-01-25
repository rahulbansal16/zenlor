export interface StyleCodesInfo {
    styleCodes: StyleCodes[],
    company: string
}

export type Product = "Shirt" | "Trousers" | "Jeans" | "T-shirts"
export type ProductType = "Wovenwear" | "Knitwear"
export type ProductCategory = "Men Formal Shirt"
| "Women Formal Shirt" | "Men T-Shirt" | "Women T-Shirt"
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
    styleCode: string,
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
    deliveryDate: number,
    unitSellingPrice?:number,
    xsSizeQty?:number,
    sSizeQty?:number,
    mSizeQty?:number,
    xlSizeQty?:number,
    xxlSizeQty?:number,
    status:string,
}
export interface BOMInfo {
    boms: BOM[],
    company: string,
}

export interface BOM {
    id: string,
    styleCode: string,
    no: number,
    category: string,
    type: string,
    materialId: string,
    materialDescription: string,
    consumption: number,
    wastage: number,
    unit: string,
    placement: string,
    reqQty: number,
    inventory?: number,
    activeOrdersQty?: number,
    pendingQty?: number,
    issueQty?: number
}

export interface PurchaseMaterialsInfo{
    purchaseMaterials: PurchaseMaterials[]
    createdAt: string
    company: string
}

export interface PurchaseMaterials{
    id: string,
    styleCode: string,
    category: string,
    type: string,
    materialId: string,
    materialDescription: string,
    unit: string,
    status: string,
    pendingQty: number,
    purchaseQty: number,
    rate: number,
    discount: number,
    preTaxAmount: number,
    tax: number,
    taxAmount: number,
    totalAmount: number,
    supplier: string,
    deliveryDate: string
}

export interface PurchaseOrdersInfo{
    purchaseOrders: PurchaseOrder[],
    company: string
}

export interface PurchaseOrder {
    id: string,
    purchaseOrderId: string,
    lineItems: PurchaseOrderLineItems[],
    amount: number,
    status: string,
    supplier: string
    createdAt: string,
    deliveryDate: string
}

export interface PurchaseOrderLineItems {
    id: string,
    // styleCode: string
    category: string,
    unit: string,
    type: string,
    materialId: string,
    materialDescription: string,
    purchaseQty: number
}


// All the inventory will be directly inserted by the user
export interface InventoryInfo {
    company: string,
    createdAt: string,
    inventory: InventoryItems[]
}

export interface InventoryItems {
    // id: string,
    materialId: string,
    materialDescription: string,
    inventory: number,
    issue: number,
    activeOrdersQty: number
}

export interface GRNInfo {
    company: string,
    createdAt: string,
    GRN: GRNItems[]
}

export interface GRNItems {
    id: string,
    purchaseOrderId: string,
    category: string,
    type: string,
    // styleCode: string,
    materialId: string,
    materialDescription: string,
    unit: string,
    purchaseQty: number,
    receivedQty: number,
    receivedDate: string,
    rejectedQty: number,
    rejectedReason: string,
    acceptedQty: number
}
