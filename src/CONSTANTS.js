const CONSTANTS = {
    companyId: 'anusha_8923',
    days_75: 75*24*60*60*1000
}

const PROCESS_NAME = {
    CUTTING : {         
        FABRIC_ISSUED: "Fabric Issued",
        OUTPUT: "Output"
    },
    SEWING: {
        LOADING: "Loading",
        OUTPUT: "Output"
    },
    KAJJAANDBUTTONING: {
       RECEIVED_FROM_SEWING :"Received From Sewing",
       OUTPUT: "Output"
    },
    WASHING: {
        SENDING: "Sending",
        RECEIVING: "Receiving"
    },
    PACKING: {
        RECEIVED_FROM_WASHING :"Received From Washing",
        PRE_INSPECTION :"Pre Inspection"
    }
}

const PROCESS_VALUE = {
    CUTTING : {         
        FABRIC_ISSUED: "Fabric Issued",
        OUTPUT: "output"
    },
    SEWING: {
        LOADING: "Loading",
        OUTPUT: "output"
    },
    KAJJAANDBUTTONING: {
       RECEIVED_FROM_SEWING :"Received From Sewing",
       OUTPUT: "output"
    },
    WASHING: {
        SENDING: "Sending",
        RECEIVING: "Receiving"
    },
    PACKING: {
        RECEIVED_FROM_WASHING :"Received From Washing",
        PRE_INSPECTION :"Pre Inspection"
    }
}

export default CONSTANTS
export {PROCESS_NAME, PROCESS_VALUE};