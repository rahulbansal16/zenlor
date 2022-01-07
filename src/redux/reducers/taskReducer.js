// import { FETCH_COMPLETE_TASKS, FETCH_INCOMPLETE_TASKS, UPDATE_TASK_STATUS } from "../actionType";

import { Table, Tooltip } from "antd"
import ZenlorTags from "../../components/ZenlorTags"
import { functions } from "../../firebase"
import { FETCH_DATA, FETCH_PO, INSERT_ROW, UPDATE_AUTH, UPDATE_CELL, UPDATE_ROLE, UPDATE_STYLE_CODE_INFO } from "../actionType"

const initialState = {
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
            title: () => <Tooltip title="Style Code">Style Code</Tooltip> ,
            dataIndex: "styleCode",
            key: "styleCode",
            filter: "multiSelect",
            showSorterTooltip: false,
            width:150,
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
              width:100,
              editable: true
            },
            {
              title: () => <Tooltip title="Order Confirmation">Order Confirmation</Tooltip>,
              width:100,
              dataIndex: "orderConfirmation",
              showSorterTooltip: false,
              key: "orderConfirmation",
              editable: true
            },
            {
              title: () => <Tooltip title="Order Confirmation">Order Confirmation</Tooltip>,
              width:100,
              dataIndex: "orderConfirmation",
              showSorterTooltip: false,
              key: "orderConfirmation",
              editable: true
            },
            {
              title: () => <Tooltip title="Order Quantity">Order Quantity</Tooltip>,
              showSorterTooltip: false,
              width:100,
              dataIndex: "orderQuantity",
              key: "orderQuantity",
              editable: true
            },
            {
              title: "To Make Quantity",
              dataIndex: "toMakeQuantity",
              key: "toMakeQty",
              editable: true
            },
            {
              title: "Delivery Date",
              dataIndex: "deliveryDate",
              key: "deliveryDate",
              editable: true
            },
            Table.EXPAND_COLUMN,
            {
              title: "Material Status",
              children : [
               {
                title:"Purchase",
                dataIndex: "purchaseStatus",
                key: "purchaseStatus",
                editable: true,
                render: () => <ZenlorTags text="partial order"></ZenlorTags>
               },
               {
                title:"Inventory",
                dataIndex: "inventoryStatus",
                key: "inventoryStatus",
                editable: true
               }
              ]
            },
            {
              title: "Status",
              dataIndex: "status",
              key: "status",
              filter: "multiSelect",
              editable: true
            },
            {
              title: "Last Action",
              dataIndex: "lastAction",
              key: "lastAction",
            },
            Table.SELECTION_COLUMN,
          ],
        dataSource: []
    },
    orderMaterials: {
            columns: [{
                title: "No",
                dataIndex: "no",
                key: "no",
              },
              {
                title: "Style Code",
                dataIndex: "styleCode",
                filter: "multiSelect",
                key: "styleCode",
              },
              {
                title: "To Make Qty",
                dataIndex: "toMakeQty",
                key: "toMakeQty",
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
                title: "Material Id",
                dataIndex: "materialId",
                key: "materialId",
              },
              {
                title: "Description",
                dataIndex: "description",
                key: "description",
              },
              {
                title: "Consumption",
                dataIndex: "consumption",
                key: "consumption",
              }, 
              {
                title: "Unit",
                dataIndex: "unit",
                key: "unit",
              },
              {
                title: "rate",
                dataIndex: "rate",
                key: "rate",
              },
              {
                title: "Req Qty",
                dataIndex: "reqQty",
                key: "reqQty",
              },
              {
                title: "Rem Qty",
                dataIndex: "remQty",
                key: "remQty",
              },
              {
                title: "Supplier",
                dataIndex: "supplier",
                filter: "multiSelect",
                key: "supplier",
              },             
             {
                title: "PO Qty",
                dataIndex: "poQty",
                key: "poQty",
                editable: true,
              },              
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
    createPO: {
            columns: [{
                title: "ID",
                dataIndex: "id",
                key: "id",
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
                title: "Supplier",
                dataIndex: "supplier",
                key: "supplier",
                filter: "multiSelect",
                editable: true,
              }, 
              {
                title: "Amount",
                dataIndex: "amount",
                key: "amount",
                editable: true,
              },
              {
                title: "Status",
                dataIndex: "status",
                key: "status",
                editable: true,
              }, 
            ],
            dataSource: []
    },
    purchaseOrder: {
      columns: [{
        title: "S.No",
        dataIndex: "sno",
        key: "sno",
      },
      {
        title: "Reference Id",
        dataIndex: "referenceId",
        key: "referenceId",
      },
      {
        title: "Item Id",
        dataIndex: "itemId",
        key: "itemId",
        editable: true,
      },
      {
        title: "Item Description",
        dataIndex: "itemDesc",
        key: "itemDesc",
      }, 
      {
        title: "Qty",
        dataIndex: "quantity",
        key: "quantity",
        editable: true,
      },
      {
        title: "Unit",
        dataIndex: "unit",
        key: "unit",
        editable: true,
      },
      {
        title: "Rate",
        dataIndex: "rate",
        key: "rate",
        editable: true,
      },
      {
        title: "Tax",
        dataIndex: "tax",
        key: "tax",
        editable: true,
      }, 
      {
        title: "Amount",
        dataIndex: "amount",
        key: "amount",
        editable: true,
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

const taskReducer = (state = initialState, action) => {
    switch(action.type){
        case FETCH_DATA: {
            const {cutting, styleCodes, washing, sewing, kajjaandbuttoning, packing, isFetching, departments, name, form} = action.payload
            let purchaseOrders = action?.payload?.purchaseOrders
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
                    dataSource: action.payload.purchaseOrders
                },
                orderMaterials: {
                    ...state.orderMaterials,
                    dataSource: action?.payload?.billOfMaterials??[]
                },
                dashboard: {
                    ...state.dashboard,
                    dataSource: action?.payload?.styleCodesInfo??[]
                 },
                 purchaseOrder: {
                   ...state.purchaseOrder,
                   dataSource: formatPurchaseOrder(purchaseOrders)
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
            const {row, type} = action.payload;
            let newState = JSON.parse(JSON.stringify(state));
            const newData = newState[type]["dataSource"];
            const index = newData.findIndex((item) => row.key === item.id);
            const item = newData[index];
            newData.splice(index, 1, { ...item, ...row });
            return newState
        }
        case INSERT_ROW: {
          const {row, type} = action.payload;
          let newState = JSON.parse(JSON.stringify(state));
          const newData = newState[type]["dataSource"];
          newData.push(row)
          return newState
        }
        // case UPDATE_TASK_STATUS:{
        //     const {styleCodeId, taskId, status} = action.payload
        //     if (status === "incomplete"){
        //         return state
        //     }
        //     return {
        //         ...state,
        //         inCompleteTasks: state.inCompleteTasks.filter((task) => {
        //             if ( styleCodeId === task.styleCodeId && taskId === task.id) return false
        //             return true
        //         }),
        //     }
        // }
        // case FETCH_INCOMPLETE_TASKS:{
        //     const {tasks} = action.payload
        //     return {
        //         ...state,
        //         inCompleteTasks: tasks
        //     }
        // }
        // case FETCH_COMPLETE_TASKS: {
        //     const {tasks} = action.payload
        //     return {
        //         ...state,
        //         completeTasks: tasks
        //     }
        // }
        default:
            return state
    }
 }

 export default taskReducer