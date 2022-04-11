
export abstract class Constants {
   static readonly NAMES = "";
   static readonly PO_TEMPLATE_FILE = "PurchaseOrder.xlsx";
   static readonly GRN_TEMPLATE_FILE = "GRN.xlsx";
}
export enum GRN_STATUS {
    ACTIVE = 'ACTIVE',
    CANCELED = 'CANCELED',

}
export enum PURCHASE_ORDER_STATUS {
    ACTIVE = 'ACTIVE',
    CANCELED = 'CANCELED',
    GRN_DONE = 'GRN DONE',
    GRN_STARTED = 'GRN STARTED'
}