// import { FETCH_COMPLETE_TASKS, FETCH_INCOMPLETE_TASKS, UPDATE_TASK_STATUS } from "../actionType";

import { notification, Table, Tooltip } from "antd"
import ZenlorTags from "../../components/ZenlorTags"
import { functions } from "../../firebase"
import { performCalculation } from "../../util"
import { FETCH_DATA, 
  UPDATE_DATA, 
  FETCH_PO, FETCH_PURCHASE_MATERIALS_INFO, INSERT_ROW, UPDATE_AUTH, UPDATE_CELL, UPDATE_ROLE, UPDATE_STYLE_CODE_INFO } from "../actionType"

export const initialState = {
    user: {
        rolesFetched: false
    },
    departments:[],
    cutting:[],
    sewing: [],
    packing: [],
    kajjaandbuttoning: [],
    washing: [],
    styleCodes: [],
    suppliers: [],
    
    // I can store the data across a certain id which can be stored as
    // some global Id
    styleCodesInfo:[],  
    dashboard: {
        columns: [
          {
            title: "Style Code",
            dataIndex: "styleCode",
            key: "styleCode",
            filter: "multiSelect",
            showSorterTooltip: false,
          },
            {
              title: "Brand",
              dataIndex: "brand",
              key: "brand",
              showSorterTooltip: false,
              filter: "multiSelect",
              sortType:"", // date, number, integer, string
              // https://codesandbox.io/s/filter-and-sorter-antd-4-18-1-forked-zhoph?file=/index.js
              filters: [{
                text:"WROGN",
                value:"WROGN"
              }],
              render: (text) => <a>{text}</a>,
            },
            {
              title: "Product",
              dataIndex: "product",
              key: "product",
            },
            {
              title: "Order No",
              dataIndex: "orderNo",
              showSorterTooltip: false,
              key: "orderNo",
              editable: true
            },
            {
              title: "Order Confirmation",
              dataIndex: "confirmDate",
              showSorterTooltip: false,
              key: "confirmDate",
              editable: true
            },
            {
              title: "Order Quantity",
              showSorterTooltip: false,
              dataIndex: "orderQty",
              key: "orderQty",
              editable: true
            },
            {
              title: "To Make Quantity",
              dataIndex: "makeQty",
              key: "makeQty",
              editable: true
            },
            {
              title: "Delivery Date",
              dataIndex: "deliveryDate",
              key: "deliveryDate",
              editable: true
            },
            {
              title: "Status",
              dataIndex: "materialStatus",
              key: "status",
              filter: "multiSelect"
            },
            // {
              // children : [
               {
                title:"Material Status",
                dataIndex: "materialStatus",
                key: "materialStatus",
                filterMode: 'tree',
                filters: [
                  {
                    text: "NOT_ORDERED",
                    value: "NOT_ORDERED",
                    children: [
                      {
                        text: "FABRIC",
                        value: "FABRIC:NOT_ORDERED"
                      },
                      {
                        text: "TRIM",
                        value: "TRIM:NOT_ORDERED"
                      },
                      {
                        text: "LABEL",
                        value: "LABEL:NOT_ORDERED"
                      },
                      {
                        text: "PACKAGING",
                        value: "PACKAGING:NOT_ORDERED"
                      }
                    ]
                  },
                  {
                    text: "PARTIAL_ORDERED",
                    value: "PARTIAL_ORDERED",
                    children: [
                      {
                        text: "FABRIC",
                        value: "FABRIC:PARTIAL_ORDERED",
                      },
                      {
                        text: "TRIM",
                        value: "TRIM:PARTIAL_ORDERED",
                      },
                      {
                        text: "LABEL",
                        value: "LABEL:PARTIAL_ORDERED"
                      },
                      {
                        text: "PACKAGING",
                        value: "PACKAGING:PARTIAL_ORDERED"
                      }
                    ],
                  },
                  {
                    text: "FULLY_ORDERED",
                    value: "FULLY_ORDERED",
                    children: [
                      {
                        text: "FABRIC",
                        value: "FABRIC:FULLY_ORDERED"
                      },
                      {
                        text: "TRIM",
                        value: "TRIM:FULLY_ORDERED"
                      },
                      {
                        text: "LABEL",
                        value: "LABEL:FULLY_ORDERED"
                      },
                      {
                        text: "PACKAGING",
                        value: "PACKAGING:FULLY_ORDERED"
                      }
                    ]
                  },
                  {
                    text: "ALL_IN",
                    value: "ALL_IN",
                    children: [
                      {
                        text: "FABRIC",
                        value: "FABRIC:ALL_IN"
                      },
                      {
                        text: "TRIM",
                        value: "TRIM:ALL_IN"
                      },
                      {
                        text: "LABEL",
                        value: "LABEL:ALL_IN"
                      },
                      {
                        text: "PACKAGING",
                        value: "PACKAGING:ALL_IN"
                      }
                      ]
                  }
                ],
                onFilter: (value, record) => {
                  const [category, status] = value.split(":")
                  if(record.status){
                    return record.status[category] === status
                  } else {
                    return true
                  }
                },
                // editable: true,
                // render: () => <ZenlorTags text="partial order"></ZenlorTags>
               },
              //  {
              //   title:"Inventory",
              //   dataIndex: "inventoryStatus",
              //   key: "inventoryStatus",
              //   editable: true
              //  },
              // ]
            // },
            // Table.SELECTION_COLUMN,
          ],
        dataSource: []
    },
    inventory: {
      columns: [{
        title: "Material Id",
        dataIndex: "materialId",
        key: "materialId"
      },
      {
        title: "Material Description",
        dataIndex: "materialDescription",
        key: "materialDescription"
      }, 
      {
        title: "Inventory",
        dataIndex: "inventory",
        key: "inventory"
      }, 
      {
        title: "Issue",
        dataIndex: "issue",
        key: "issue"
      }, 
      {
        title: "Active Orders",
        dataIndex: "activeOrdersQty",
        key: "activeOrdersQty"
      }, 
    ],
      dataSource:[]
    },

    orderMaterials: {
            columns: [{
                title: "Style Code",
                dataIndex: "styleCode",
                filter: "multiSelect",
                key: "styleCode",
              },
              {
                title: "Cat.",
                dataIndex: "category",
                key: "category",
                filter: "multiSelect",
              },
              {
                title: "Type",
                dataIndex: "type",
                key: "type",
                filter: "multiSelect"
              },
              {
                title: "MATERIAL",
                children:[
                  // {
                  //   title: "S.No",
                  //   dataIndex: "no",
                  //   key: "no",
                  // },
                  {
                    title: "Id",
                    dataIndex: "materialId",
                    key: "materialId",
                  },
                  {
                    title: "Description",
                    dataIndex: "materialDescription",
                    key: "materialDescription",
                  },       
                  {
                    title: "Unit",
                    dataIndex: "unit",
                    key: "unit",
                  },
                
                ]
              },
              {
                title: "Placement",
                dataIndex: "placement",
                key: "placement",
                editable: true
              },
              {
                title:"Wastage",
                dataIndex: "wastage",
                key: "wastage",
                editable: true
              },
              {
                title: "Consumption",
                dataIndex: "consumption",
                key: "consumption",
                editable: true
              }, 
              {
                title: "Quantity",
                children:[              
                {
                  title: "Required",
                  dataIndex: "reqQty",
                  key: "reqQty",
                },
                {
                  title: "Inventory",
                  dataIndex: "inventory",
                  key: "inventory",
                },
                {
                  title: "Active Ordered",
                  dataIndex: "activeOrdersQty",
                  key: "activeOrdersQty",
                },             
                {
                  title:"Issued",
                  dataIndex:"issueQty",
                  key: "issueQty"
                },
              ]
              },
              {
                title: "Pend",
                dataIndex: "pendingQty",
                key: "pendingQty",
                filter: "multiSelect",
              },  
              // Table.SELECTION_COLUMN,
            ],
            actions:[

            ],
            dataSource: []
    },
    inwardMaterial: {
      columns: [
        // {
        //   title:"S.No",
        //   dataIndex:"",
        //   key:""
        // },
        {
          title: "PO",
          dataIndex: 'purchaseOrderId',
          key: 'purchaseOrderId'
        },
        {
          title: "Category",
          dataIndex: "category",
          key:"category"

        },
        {
          title:"Type",
          dataIndex:"type",
          key:"type"
        },
        // {
        //   title: "Reference",
        //   dataIndex: "styleCode",
        //   key:"styleCode"
   
        // },
        {
          title:"Material Id",
          dataIndex: "materialId",
          key: "materialId"
        },
        {
          title: "Material Description",
          dataIndex: "materialDescription",
          key:"materialDescription"
  
        },
        {
          title:"unit",
          dataIndex:"unit",
          key:"unit"
        },
        {
          title: "Order Qty",
          dataIndex: "purchaseQty",
          key:"purchaseQty"
        },
        {
          title:"Received Qty",
          dataIndex:"receivedQty",
          key:"receivedQty",
          editable: true
        },
        {
          title: "Received Date",
          dataIndex: "receivedDate",
          key:"receivedDate",
          editable: true
        },        
        {
          title:"Rejected Qty",
          dataIndex:"rejectedQty",
          key:"rejectedQty",
          editable: true
        },
        {
          title: "Rejected Reason",
          dataIndex: "rejectedReason",
          key:"rejectedReason",
          editable: true
        },
        {
          title: "Accepted Qty",
          dataIndex: "acceptedQty",
          key:"acceptedQty",
          editable: true,
        },
      ],
      dataSource:[]
    },
    createPO: {
            columns: [
            //   {
            //   title: "Style Code",
            //   dataIndex: "styleCode",
            //   filter: "multiSelect",
            //   key: "styleCode",
            // },
            {
              title: "Material",
              children: [
                {
                  title: "Category",
                  dataIndex: "category",
                  key: "category",
                },
                {
                  title: "Type",
                  dataIndex: "type",
                  key:"type"
                },{
                  title: "ID",
                  dataIndex: "materialId",
                  key: "materialId",
                },
                {
                  title: "Description",
                  dataIndex: "materialDescription",
                  key: "materialDescription",
                },
                {
                  title: "Unit",
                  dataIndex: "unit",
                  key: "unit",
                }
              ]
            },
            // {
              // title: "Quantity",
              // editable: true,
              // children:[
                {
                  title:"pending",
                  dataIndex:"pendingQty",
                  key:"pendingQty",
                  // editable: true
                },
                {
                  title:"purchase",
                  dataIndex:"purchaseQty",
                  key:"purchaseQty",
                  editable: true
                },
              // ]
            // },
              {
                title: "Rate",
                dataIndex: "rate",
                key: "rate",
                editable: true
              },
              {
                title: "Disc %",
                dataIndex: "discount",
                key: "discount",
                editable: true,
              },
              {
                title: "Pre Tax",
                dataIndex: "preTaxAmount",
                key: "preTaxAmount",
              }, 
              {
                title: "Tax %",
                dataIndex: "tax",
                key: "tax",
                editable: true,
              },
              {
                title: "Tax Amount",
                dataIndex: "taxAmount",
                key: "taxAmount",
                editable: true,
              }, 
              {
                title: "Total Amount",
                dataIndex: "totalAmount",
                key: "totalAmount",
              }, 
              {
                title: "Supplier",
                dataIndex: "supplier",
                key: "supplier",
                editable: true,
              },
              {
                title: "Delivery Date",
                dataIndex: "deliveryDate",
                key: "deliveryDate",
                editable: true,
              },
              // Table.SELECTION_COLUMN 
            ],
            dataSource: []
    },
    purchaseOrder: {
      columns: [
        // id: string,
        // purchaseOrderId: string,
        // lineItems: PurchaseOrderLineItems[],
        // amount: number,
        // status: string,
        // supplier: string
        // createdAt: string,
        // deliveryDate: string
      {
        title: "PO Id",
        dataIndex: "id",
        key: "id",
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
      },
      {
        title: "Supplier",
        dataIndex: "supplier",
        key: "supplier",
      },
      {
        title: "Created At",
        dataIndex: "createdAt",
        key: "createdAt",
      },
      {
        title: "Delivery Date",
        dataIndex: "deliveryDate",
        key: "deliveryDate",
        editable: true,
      },
      {
        title: "Amount",
        dataIndex: "amount",
        key: "amount",
      },
      {
        title: "Download",
        dataIndex: "fileUrl",
        key: "fileUrl",
        render : (text) => <a href={text}>Download</a>,
      }],
      dataSource: []
    },
    isFetching: true,
    name:  "Factory",
    form: [{
        "name": "cutting",
        "lines":[1],
        "process":["fabric issued", "output"],
        "form": {
            "fabric issued": [
                {
                    "label":"Enter Fabric Issued Quantity",
                    "field":"fabricIssued"
                }
            ],
            "output": [
                {
                    "label":"Enter Cutting Done Quantity",
                    "field": "output"
                }
            ]
        }
    },{
        "name": "sewing",
        "lines": [1, 2, 3],
        "process":["loading", "output"],
        "form": {
            "loading": [
                {
                    "label": "Enter Loading Received Quantity",
                    "field": "loadingReceivedQuantity"
                }
            ],
            "output": [
                {
                    "label":"Enter Sewing Done Quantity",
                    "field": "output"
                }
            ]
        }
    },{
        "name": "kajjaandbuttoning",
        "lines": [1],
        "process": ["received from sewing", "output"],
        "form": {
            "received from sewing": [
                {
                    "label": "Enter Sewing Received Quantity",
                    "field":"sewingReceivedQuantity"
                }
            ],
            "output": [
                {
                    "label": "Enter Kaja & Buttoning Done Quantity",
                    "field":"output"
                }
            ]
        }
    },{
        "name": "washing",
        "lines": [1],
        "process": ["sending", "receiving"],
        "form": {
            "sending": [
                {
                    "label": "Enter Washing Sent Quantity",
                    "field": "washingSentQuantity"
                }
            ],
            "receiving": [
                {
                    "label": "Enter Washing Received Quantity",
                    "field": "washingReceivedQuantity"
                }
            ]
        }
    },{
        "name": "packing",
        "lines": [1],
        "process": ["received from washing", "pre inspection"],
        "form": {
            "received from washing" : [{
                "label": "Enter Washing Received Quantity",
                "field": "washingReceivedQuantity"
            }],
            "pre inspection": [{
                "label": "Enter Packed Quantity",
                "field": "packedQuantity"
            }, {
                "label": "Enter Rejected Quantity",
                "field":"rejectedQuantity"
            }]
        }

    }]
}

const formatPurchaseOrder = (purchaseOrders) => {
  let formatedPurchaseOrders = []
  for (let purchaseOrder of purchaseOrders){
    const data = purchaseOrder?.data?.map( item => ({
      ...item,
      id: purchaseOrder.id
    }))
    formatedPurchaseOrders = formatedPurchaseOrders.concat(data)
  }
  return formatedPurchaseOrders
}

const formatLineItems = (purchaseOrders) => {
  let lineItems = []
  for(let purchaseOrder of purchaseOrders){
    const data = purchaseOrder?.lineItems?.map( item => ({
      ...item,
      purchaseOrderId: purchaseOrder.id,
    }))
    lineItems = lineItems.concat(data)
  }
  return lineItems
}

const taskReducer = (state = initialState, action) => {
    switch(action.type){
        case FETCH_DATA: {
            const {cutting, styleCodes, washing, sewing, kajjaandbuttoning, packing, isFetching, departments, name, form} = action.payload
            const {createPO, orderMaterials, dashboard, purchaseOrder, inwardMaterial} = state;
            return {
                ...state,
                ...action.payload,
                // departments,
                // cutting: [...cutting],
                // washing: [...washing],
                // styleCodes: [...styleCodes],
                // sewing: [...sewing],
                // kajjaandbuttoning: [...kajjaandbuttoning],
                // packing: [...packing],
                // isFetching,
                // name,
                suppliers: action.payload?.suppliersInfo || [],
                createPO: {
                    ...state.createPO, 
                    dataSource: (action.payload.purchaseMaterialsInfo || createPO?.dataSource || []).map( item => ({
                      ...item,
                      id: item.styleCode + item.materialId.trim() + item.materialDescription.trim()
                    }))
                },
                orderMaterials: {
                    ...state.orderMaterials,
                    dataSource: action?.payload?.bomsInfo || orderMaterials?.dataSource || []
                },
                dashboard: {
                    ...state.dashboard,
                    dataSource: action?.payload?.styleCodesInfo || dashboard?.dataSource || []
                 },
                 purchaseOrder: {
                   ...state.purchaseOrder,
                   dataSource: action?.payload?.purchaseOrdersInfo || purchaseOrder?.dataSource || []
                 },
                 inwardMaterial: {
                   ...state.inwardMaterial,
                   dataSource: action?.payload?.GRNInfo || inwardMaterial?.dataSource || []
                 },
                form: form  || state.form
            }
        }
        case UPDATE_DATA: {
          return {
            ...state,
            inwardMaterial: {
             ...state.inwardMaterial,
             dataSource: action?.payload?.GRNInfo??[]
            }
            // ...action.payload.data
          }
        }
        case UPDATE_AUTH: {
            const {user} = action.payload
            return {
                ...state,
                user
            }
        }
        case UPDATE_ROLE: {
            const {role, company} = action.payload
            const user = JSON.parse(JSON.stringify(state.user))
            user["role"] = role
            user["company"] = company
            user["rolesFetched"] = true;
            console.log("The user state is", user)
            return {
                ...state,
                user
            }
        }
        case UPDATE_STYLE_CODE_INFO: {
            const {styleCodeInfo} = action.payload;
            return {
                ...state,
                styleCodeInfo
            }
        }
        case FETCH_PURCHASE_MATERIALS_INFO: {
          const {data}= action.payload;
          let newState = JSON.parse(JSON.stringify(state))
          newState.createPO.dataSource = data.map( item => ({
            ...item,
            id: item.styleCode + item.materialId.trim() + item.materialDescription.trim()
          }))
          // newState.purchaseOrder = {
          //   ...state.purchaseOrder,
          //   dataSource: formatPurchaseOrder(data)
          // }
          return newState; 
        }
        case FETCH_PO: {
            const {data}= action.payload;
            let newState = JSON.parse(JSON.stringify(state))
            newState.createPO.dataSource = [...data]
            newState.purchaseOrder = {
              ...state.purchaseOrder,
              dataSource: formatPurchaseOrder(data)
            }
            return newState;
        }
        case UPDATE_CELL: {
            const {row, type, company} = action.payload;
            let newState = JSON.parse(JSON.stringify(state));
            const newData = newState[type]["dataSource"];
            const index = newData.findIndex((item) => row.key === item.id);
            const item = newData[index];
            const newItem = performCalculation({...item, ...row},type)
            newData.splice(index, 1, newItem);
            // saveCellToServer(newItem, type, company)
            return newState
        }
        case INSERT_ROW: {
          const {row, type} = action.payload;
          let newState = JSON.parse(JSON.stringify(state));
          const newData = newState[type]["dataSource"];
          newData.push(row)
          return newState
        }
        default:
            return state
    }
 }

 export default taskReducer