export interface StyleCodesInfo {
    styleCodes: StyleCodes[],
    company: string
}

export type Product = "Shirt" | "Trousers" | "Jeans" | "T-shirts"
export type ProductType = "Wovenwear" | "Knitwear"
export type ProductCategory = "Men Formal Shirt"
| "Women Formal Shirt" | "Men T-Shirt" | "Women T-Shirt"
export type FitType = "Slim" | "Regular" | "Custom"
export type Category = "FABRIC" | "TRIM" | "LABEL" | "PACKAGING"
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
    deliveryDate: string,
    unitSellingPrice?:number,
    xsSizeQty?:number,
    sSizeQty?:number,
    mSizeQty?:number,
    xlSizeQty?:number,
    xxlSizeQty?:number,
    styleCodeStatus:string
}
export interface BOMInfo {
    boms: BOM[],
    company: string,
}

export interface BOM {
    id: string,
    styleCode: string,
    no: number,
    category: Category,
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
    pendingQty: number,
    issueQty?: number
}

export interface BOMInfoDto {
    boms: BOMDto[],
    company: string,
}

export interface BOMDto {
    styleCode: string,
    category: Category,
    type: string,
    materialId: string,
    materialDescription: string,
    consumption: number,
    wastage: number,
    unit: string,
    placement: string,
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
    pendingQty: number,
    purchaseQty: number,
    rate: number,
    discount: number,
    preTaxAmount: number,
    tax: number,
    taxAmount: number,
    totalAmount: number,
    supplier?: string,
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
    fileUrl?: string,
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
    rate: number,
    discount: number,
    preTaxAmount: number,
    tax: number,
    taxAmount: number,
    totalAmount: number,
    supplier: string,
    deliveryDate: string
}

export interface MigrationInfo{
    company: string,
    source: string,
    destination: string,
    sourceName: string,
    destinationName: string
}
export interface DeleteData {
    company: string,
    collectionName: string,
    objectName: string
    // destinatio    "token": "3:LHl7/wXDi8NmoWoCnhARIw==:6FRAoab+fwZtsfdintR2c3w/D/gokmN2SmmS7VG9+LB6PCByrDxLaIR7SEYyf1g1Egy/7Ex9nkFqwj7XbgtV2gnlkCUVXMjM3Aose+0uvaQ5RVQikNR2pd0TlBW7TioAsIEmVNmWSUlK9EsP8LWtTBQbadOjXEsPhKjLN4aaaHdMEYbAoKm4XWjMzg/hmltMsZQgEy/kxK8AFrk6La9RA7DFf9arcALGDeCCftkAAzw3nXXo6yjNQDUgm4RwT4N+5+BnMckybFMr1Osoi5XDiU6EfD8ZirmnPc+oqjOP3e6ioyude5BDJh2Zuq/j5detkyVIug0njnx/q6lOBfyWwlUg70WAgxn8HSeHLm0DCRSzstFCO3Zy3exn++QRNzcRBaXO5hes1SK1MGyXibxc57UrMFrRPWMXnmcT7eFxpekl0Ova6rpukRbSNEnjPCKP29kIDnYOx8rMTRo5CUbBB4VhzSEm+OB9uOwBVnOha/m2EQgKKsf029735gyG3u/kwCPe2hwbChHrH0ZIj3vxLjDYbeAXm6FH0coJ5fXCuJwkprCmhOiixqNSx7D1ydh4:MEPuTaZdifyG1xhedETSo/bUMiRts/GWCEFwPDn5xoo=",

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

export interface MaterialIssue {
    styleCode:string,
    materialIssue: MaterialIssueItem[]
}

export interface MaterialIssueItem {
    materialId: string,
    materialDescription: string,
    issueAmount: number,
}

export interface GRNInfo {
    company: string,
    createdAt: string,
    GRN: GRNItems[]
}

export interface GRNs {
    poId: string,
    status: string,
    grnDocUrl: string,
    GRN: GRN[]
}

export interface GRN {
    id: string,
    lineItems: GRNItems[],
    createdAt: string,
    updatedAt: string,
    status: string,
    supplier: string,
    itemsCount: number,
    amount: number,
    lrNo: string,
    trans: string, // transporter 
    dcNo: string,
    invoiceNo: string
}

export interface GRNItems {
    id: string,
    purchaseOrderId: string,
    category: string,
    type: string,
    grnId: string,
    // styleCode: string,
    status: string,
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

export interface SupplierInfo {
    company: string,
    createdAt: string,
    suppliers: Supplier[]
}
export interface Supplier {
    name: string,
    address1: string,
    address2: string,
    city: string,
    state: string,
    pin: number,
    gst: string,
    pan: string,
    person: string,
    phoneNumber: number,
    email: string
}
interface upsertGRNItem {
    id: string,
    lrNo: string,
    trans: string,
    dcNo: string,
    invoiceNo: string
}
export interface upsertGRN {
    company: string,
    GRN: upsertGRNItem[]
}

export interface InventoryGRN {
    id: string,
    date: string,
    status: string,
    receivedQty: number,
    acceptedQty: number,
    rejectedQty: number
}
export interface PO {
    id: string,
    orderQty: number,
    supplier: string,
    price: number,
    grns: InventoryGRN[]
}
export interface Issue{
    qty: number,
    date: string
}
export interface InventoryResult {
    category: string,
    type: string,
    id: string,
    description: string,
    // desc: string,
    unit: string,
    // color: string,
    grnAcceptedQty: number,
    issuedQty: number,
    // inHouseAllocatedty: number,
    storeQty: number,
    pos: PO[]
    issues: Issue[]
}

export interface InventoryRequest {
    company: string
}

export interface Store {
    styleCode: string,
    createdAt: string
    values: {
        [key:string]: number
    }
}