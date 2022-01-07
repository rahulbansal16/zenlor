const departments = [
  {
    name: "cutting",
    lines: [1],
    process: ["Fabric Issued", "Output"],
    form: {
      "Fabric Issued": [
          {
              label: "Enter Fabric Issued Quantity",
              name: "fabricIssued"
          }
      ],
      Output: [
          {
              label: "Enter Cutting Done Quantity",
              name: "output"
          }
      ],
    },
  },
  {
    name: "sewing",
    lines: [1, 2, 3],
    process: ["Loading", "Output"],
    form: {
      Loading: [{
          label: "Enter Loading Received Quantity",
          name: "loadingReceivedQuantity"
      }],
      Output: [{
          label: "Enter Sewing Done Quantity",
          name: "output"
      }],
    },
  },
  {
    name: "kajjaandbuttoning",
    lines: [1],
    process: ["Received From Sewing", "Output"],
    form: {
      "Received From Sewing": [{
          label: "Enter Sewing Received Quantity",
          name: "sewingReceivedQuantity"
      }],
      Output: [{
          label: "Enter Kaja and Buttoning Done Quantity",
          name: "output"
      }],
    },
  },
  {
    name: "washing",
    lines: [1],
    process: ["Sending", "Receiving"],
    form: {
      Sending: [{
          label: "Enter Washing Sent Quantity",
          name: "washingSentQuantity"
      }],
      Receiving: [{
        label: "Enter Washing Received Quantity",
        name: "washingReceivedQuantity"
      }],
    },
  },
  {
    name: "packing",
    lines: [1],
    process: ["Received From Washing", "Pre Inspection"],
    form: {
        "Received From Washing":[{
            label: "Enter Washing Received Quantity",
            name: "washingReceivedQuantity"
        }],
        "Pre Inspection": [{
            label: "Enter Packed Quantity",
            name: "packedQuantity"
        }, {
            label: "Enter Rejected Quantity",
            name: "rejectedQuantity"
        }]
    }
  },
  {
      name: "dispatch",
      lines: [1],
      process: ["Shipping"],
      form: {
        "Shipping": [{
            label: "Enter the Shipping Qty",
            name: "shippingQty"
        }]
      }
  }
];

export default departments;
