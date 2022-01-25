// import { FETCH_COMPLETE_TASKS, FETCH_INCOMPLETE_TASKS, UPDATE_TASK_STATUS } from "../actionType";

import { Table, Tooltip } from "antd"
import ZenlorTags from "../../components/ZenlorTags"
import { functions } from "../../firebase"
import { FETCH_DATA, FETCH_PO, FETCH_PURCHASE_MATERIALS_INFO, INSERT_ROW, UPDATE_AUTH, UPDATE_CELL, UPDATE_ROLE, UPDATE_STYLE_CODE_INFO } from "../actionType"

const performCalculation = (item, type) => {
  
  const calculationMap = {
    dashboard: {
  
    },
    orderMaterials: {
  
    },
    createPO: {
      preTaxAmount: `${item.purchaseQty||0}*${item.rate||0}*${((100-item.discount||0))/100}`,
      taxAmount: `${item.purchaseQty||0}*${item.rate||0}*${((100-item.discount||0))/100}*${(item.tax||0)/100}`,
      totalAmount: `${item.purchaseQty||0}*${item.rate||0}*${((100-item.discount||0))/100}+${item.purchaseQty||0}*${item.rate||1}*${((100-item.discount||0))/100}*${(item.tax||0)/100}`
    }
  }
  const map = calculationMap[type];
  let newItem = {}
  if(!map){
    return item;
  }
  for (const property in item){
    let value = item[property]
    if (map[property]){
     // eslint-disable-next-line no-eval
     value = eval(map[property]).toFixed(2)
    }
    newItem[property] = value;
  }
  return newItem
}

const saveCellToServer = (item, type, company) => {
  let methodName = "";
  let payload = { company}
  switch(type){
    case "dashboard": 
      methodName = "upsertStyleCodesInfo"
      payload = {
        ...payload,
        styleCodes: [item]
      }      
      break;
    case "createPO":
      methodName = "upsertPurchaseMaterialsInfo"
      payload = {
        ...payload,
        purchaseMaterials: [item]
      }
      break;
    case "orderMaterials":
      methodName = "upsertBOMInfo";
      payload = {
        ...payload,
        boms: [item]
      }
      break;
    case "inwardMaterial":
      methodName = "upsertGRN";
      payload = {
        ...payload,
        GRN: [item]
      }
      break;
    default:
      methodName = "";
  }
  const method = functions.httpsCallable(methodName)
  return method(payload);
}

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
            // width:150,
            fixed: true
          },
            {
              title: "Brand",
              dataIndex: "brand",
              key: "brand",
              width:100,
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
              width: 100,
              key: "product",
            },
            {
              title: "Order No",
              dataIndex: "orderNo",
              showSorterTooltip: false,
              key: "orderNo",
              width:150,
              editable: true
            },
            {
              title: "Order Confirmation",
              width:100,
              dataIndex: "orderConfirmationDate",
              showSorterTooltip: false,
              key: "orderConfirmationDate",
              editable: true
            },
            {
              title: "Order Quantity",
              showSorterTooltip: false,
              width:100,
              dataIndex: "orderQty",
              key: "orderQty",
              editable: true
            },
            {
              title: "To Make Quantity",
              dataIndex: "makeQty",
              width:100,
              key: "makeQty",
              editable: true
            },
            {
              title: "Delivery Date",
              dataIndex: "deliveryDate",
              key: "deliveryDate",
              editable: true
            },
            // {
              // children : [
               {
                title:"Material Status",
                dataIndex: "materialStatus",
                key: "materialStatus",
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
    orderMaterials: {
            columns: [{
                title: "Style Code",
                dataIndex: "styleCode",
                filter: "multiSelect",
                key: "styleCode",
              },{
                title: "MATERIAL",
                children:[
                  {
                    title: "S.No",
                    dataIndex: "no",
                    key: "no",
                  },
                  {
                    title: "Category",
                    dataIndex: "category",
                    key: "category",
                  },
                  {
                    title: "Type",
                    dataIndex: "type",
                    key: "type",
                  },
                  {
                    title: "Id",
                    dataIndex: "materialId",
                    key: "materialId",
                  },
                  {
                    title: "Description",
                    dataIndex: "description",
                    key: "materialDescription",
                  },
                  {
                    title: "Consumption",
                    dataIndex: "consumption",
                    key: "consumption",
                  }, 
                  {
                    title:"Wastage",
                    dataIndex: "wastage",
                    key: "wastage"
                  },
                  {
                    title: "Unit",
                    dataIndex: "unit",
                    key: "unit",
                  },
                  {
                    title: "Placement",
                    dataIndex: "placement",
                    key: "placement",
                  }
                ]
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
               {
                  title: "Pending",
                  dataIndex: "pendingQty",
                  key: "pendingQty",
                  editable: true,
                },              
              ]
              },
              // Table.SELECTION_COLUMN,
            ],
            actions:[

            ],
            dataSource: [{
                id: "WASH23-50",
                styleCode: "WSH23",
                toMakeQty: 50,
                category: 'shirts',
                type: 'casual',
                materialId: 'SFSDFLSD2323',
                description: 'Soft Fabric',
                unit: 12,
                rate: 232,
                consumption: 1.23,
                reqQty: 40,
                remQty: 10,
                supplier: "ABC Company",
                poQty: 20
            }, {
                id: "WNG989-40",
                styleCode: "WNG989",
                toMakeQty: 50,
                category: 'shirts',
                type: 'casual',
                materialId: 'SFSDFLSD2323',
                description: 'Soft Fabric',
                unit: 12,
                consumption: 1.23,
                reqQty: 40,
                remQty: 10,
                supplier: "Anusha",
                poQty: 20
            }]
    },
    inwardMaterial: {
      columns: [
        {
          title:"S.No",
          dataIndex:"",
          key:""
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
        {
          title: "Reference",
          dataIndex: "styleCode",
          key:"styleCode"
   
        },
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
          editable: true
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
                  dataIndex: "materialDecription",
                  key: "materialDecription",
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
        title: "Delivery Date",
        dataIndex: "deliveryDate",
        key: "deliveryDate"
      },
      {
        title: "Amount",
        dataIndex: "amount",
        key: "amount",
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
            let purchaseOrders = action?.payload?.purchaseOrders??[]
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
                createPO: {
                    ...state.createPO,
                    dataSource: (action.payload.purchaseMaterialsInfo||[]).map( item => ({
                      ...item,
                      id: item.styleCode + item.materialId.trim() + item.materialDescription.trim()
                    }))
                },
                orderMaterials: {
                    ...state.orderMaterials,
                    dataSource: action?.payload?.bomsInfo??[]
                },
                dashboard: {
                    ...state.dashboard,
                    dataSource: action?.payload?.styleCodesInfo??[]
                 },
                 purchaseOrder: {
                   ...state.purchaseOrder,
                   dataSource: action?.payload?.purchaseOrdersInfo??[]
                 },
                 inwardMaterial: {
                   ...state.inwardMaterial,
                   dataSource: formatLineItems(action?.payload?.purchaseOrdersInfo??[])
                 },
                form: form  || state.form
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
            saveCellToServer(newItem, type, company)
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