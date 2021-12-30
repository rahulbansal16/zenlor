// import { FETCH_COMPLETE_TASKS, FETCH_INCOMPLETE_TASKS, UPDATE_TASK_STATUS } from "../actionType";

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
              title: "Buyer",
              dataIndex: "buyer",
              key: "buyer",
              editable: true,
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
              title: "Category",
              dataIndex: "category",
              key: "category",
              editable: true
            },
            {
              title: "Style Code",
              dataIndex: "styleCode",
              key: "styleCode",
            },
            {
              title: "Order Number",
              dataIndex: "orderNo",
              key: "orderNo",
              editable: true
            },
            {
              title: "Order Conf",
              dataIndex: "orderConfirmation",
              key: "orderConfirmation",
              editable: true
            },
            {
              title: "Order Quantity",
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
            {
              title: "Status",
              dataIndex: "status",
              key: "status",
              editable: true
            },
            {
              title: "Last Action",
              dataIndex: "lastAction",
              key: "lastAction",
            },
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

const taskReducer = (state = initialState, action) => {
    switch(action.type){
        case FETCH_DATA: {
            const {cutting, styleCodes, washing, sewing, kajjaandbuttoning, packing, isFetching, departments, name, form} = action.payload
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
            return newState;
        }
        case UPDATE_CELL: {
            const {row, type} = action.payload;
            let newState = JSON.parse(JSON.stringify(state));
            const newData = newState[type]["dataSource"];
            const index = newData.findIndex((item) => row.key === item.id);
            const item = newData[index];
            newData.splice(index, 1, { ...item, ...row });
            if (type === "dashboard"){
                const updateStyleCodesInfo = functions.httpsCallable("updateStyleCodesInfo")
                updateStyleCodesInfo({
                    styleCodeInfo: item
                })
                // updateStyleCodesInfo
            }
            // newState[type]["dataSource"] = newData
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