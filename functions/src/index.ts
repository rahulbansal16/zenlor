/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable guard-for-in */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as moment from "moment";
import * as Joi from "joi";
// import * as express from "express";
import {onCall} from "./helpers/functions";
import {BOMInfo, PurchaseMaterialsInfo, PurchaseOrder, PurchaseOrderLineItems, PurchaseOrdersInfo, StyleCodesInfo, BOM,
  BOMInfoDto,
  PurchaseMaterials, StyleCodes, InventoryItems, GRNInfo as GRN, GRNItems, InventoryInfo} from "./types/styleCodesInfo";
// import * as router from "./routes/router";
// const app = express();
/* tslint:disable */
admin.initializeApp();
admin.firestore().settings({
  ignoreUndefinedProperties: true,
});

export enum POStatus{
  ACTIVE="ACTIVE",
  COMPLETED="COMPLETED",
  CANCELLED="CANCELLED"
}

export enum MaterialStatus {
  ALL_IN="ALL_IN",
  NOT_ORDERED="NOT_ORDERED",
  PART_ORDERED="PARTIAL_ORDERED",
  FULLY_ORDERED="FULLY_ORDERED",
  UNKNOWN="UNKNOWN",
  ORDERING_REQUIRED = "ORDERING_REQUIRED"
}

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const DEFAULT_COMPANY = "test";
const DEFAULT_ROLE = [{
  name: "admin",
  department: "all",
}];

// const departments = [
//   {name: "cutting", lineNumber: "1"},
//   {name: "sewing", lineNumber: "1"},
//   {name: "sewing", lineNumber: "2"},
//   {name: "sewing", lineNumber: "3"},
//   {name: "packing", lineNumber: "1"},
//   {name: "washing", lineNumber: "1"},
//   {name: "kajjaandbuttoning", lineNumber: "1"},
// ];

// const values = {
//   "cutting": ["fabricIssued", "output"],
//   "sewing": ["loadingReceivedQuantity", "output"],
//   "kajjaandbuttoning": ["sewingReceivedQuantity", "output"],
//   "washing": ["washingReceivedQuantity", "washingSentQuantity"],
//   "packing": ["washingReceivedQuantity", "packedQuantity", "rejectedQuantity"],
// };

function generateUId(prefix: string, length: number) {
  let result = " ";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  result = prefix + result.trim();
  return result.trim().toLowerCase();
}

// const getCurrentTime = () => {
//   return moment().locale("en-in").format("MMM DD YY, h:mm:ss a")
// }

exports.addUser = functions.region("asia-northeast3").auth.user().onCreate(async (user: { uid: any; }) => {
  const userInfo = JSON.parse(JSON.stringify(user));
  userInfo["company"] = DEFAULT_COMPANY;
  userInfo["role"] = DEFAULT_ROLE;
  const phoneNumber = userInfo.phoneNumber;
  const metaRole = await admin.firestore().collection("meta").doc("user_roles").get();
  const data = metaRole.data();
  console.log("The metaRole is", data);
  if (data && data[phoneNumber]) {
    const {company, role} = data[phoneNumber];
    if (company && role) {
      if (!role?.company) {
        role["company"] = company;
      }
      console.log("Setting up the role and company as", role, company);
      userInfo["role"] = role;
      userInfo["company"] = company;
    } else {
      console.log("Setting up the default role and company", DEFAULT_ROLE, DEFAULT_COMPANY);
    }
  }
  return admin
      .firestore()
      .collection("users")
      .doc(user.uid)
      .set(userInfo);
});

// const issueInventory = (material: MaterialIssue):BOMInfo[] => {
//   const {styleCode, materialIssue} = material;
//   console.log(styleCode, materialIssue)
//   return [];
// }

exports.addData = functions
    .region("asia-northeast3")
    .https.onCall(async (body, context) => {
    // .https.onCall(async (body: { department: any; json: any; createdAt: any; modifiedAt: any; enteredAt: any; }, context: { auth: { uid: any; }; }) => {
      if (!context) {
        throw new Error("Cnot");
      }
      if (!context?.auth?.uid) {
        return {
          message: "Not permitted to update the Data",
        };
      }

      const uid = context.auth.uid;
      const user = await admin.firestore().collection("users").doc(uid).get();
      console.log("The data is ", user.data());
      const userData = user.data();
      if (!userData) {
        throw new Error("User Data is undefined");
      }
      const {company} = userData;
      const {department, json, createdAt, modifiedAt, enteredAt} = body;
      console.log("The body is", body);
      const id = generateUId("", 15);
      const entry = {...json, createdAt, modifiedAt, id, status: "active", enteredAt};
      const doc = await admin.firestore().collection("data").doc(company).get();
      console.log("The doc is", doc.data());
      const companyData = doc.data();
      if (!companyData) {
        throw new Error("Company not present in the DB" + company);
      }
      const oldDepartmentData = companyData[department];
      console.log("The oldDEparmentData is ", oldDepartmentData, companyData[department]);
      const departmentData = [entry, ...(oldDepartmentData??[])];
      // let obj ={
      //   [department]: departmentData
      // }
      const obj: any = {};
      /* tslint:disable-next-line */
      obj[department] = departmentData;
      await admin.firestore().collection("data").doc(company).set(obj, {merge: true});
      return departmentData;
    });


exports.generateCSV = functions
    .region("asia-northeast3")
    .https.onRequest(async (request: { body: { department: string; lineNumber: string; company: string; }; }, response: { attachment: (arg0: string) => void; type: (arg0: string) => void; send: (arg0: string) => void; }) => {
      let {department, lineNumber, company} = request.body;
      department = department || "all";
      lineNumber = lineNumber || "1";
      lineNumber = lineNumber.toString();
      company = company || "test";
      console.log("The company is", company);
      const doc = await admin.firestore().collection("data").doc(company).get();
      const data = doc.data();
      if (!data) {
        throw new Error("");
      }
      // console.log(departmentData)
      const departments = [];
      const values: any = {};
      for (const department of data["form"]) {
        const {id, lines, process, form} = department;
        /* tslint:disable-next-line */
        values[id] = [];
        for (const proces of process) {
          console.log("The process are", form[proces].map( ({field}:{field:string}) => field));
          values[id] = values[id].concat(form[proces].map(({field}:{field:string}) => field));
        }
        for (const line of lines) {
          departments.push({
            id,
            lineNumber: line,
          });
        }
      }
      // getDepartments(data["form"]);
      console.log("The departments are", departments);
      let file = "";
      if (department !== "all") {
        file = generateData(data[department], department, lineNumber, values);
      } else {
        file += departments.map(({id, lineNumber}) => generateData(data[id], id, lineNumber, values));
      }
      // console.log(file)
      response.attachment(`${department}:${lineNumber}.csv`);
      response.type("csv");
      response.send(file);
    // response.setHeader('Content-Type', 'application/vnd.openxmlformats');
    // response.setHeader("Content-Disposition", "attachment; filename=" + department + " : " + lineNumber);
    // response.end(file, 'binary');
    // response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    // response.send(file);
    });

const csvDate = (date: any) => {
  return moment(date, "MMM DD YY, h:mm:ss a").format("DD MMM YYYY");
};

const sum = (values1: { [x: string]: any; }, values2: { [x: string]: any; }) => {
  const result: any = {};
  for (const key in values1) {
    result[key] = values1[key];
  }
  for (const key in values2) {
    if (result[key]) {
      result[key] += values2[key];
    } else {
      result[key] = values2[key];
    }
  }
  return result;
};

const mergeStyleCode = (data: any) => {
  const hash: any = {};
  for (const d of data) {
    const {createdAt, styleCode, values} = d;
    const key = styleCode + csvDate(createdAt);
    if (!hash[key]) {
      hash[key] = {
        values,
        createdAt,
        styleCode,
      };
    } else {
      hash[key] = {
        styleCode,
        values: sum(values, hash[key].values),
        createdAt,
      };
    }
  }
  const result = [];
  console.log(hash);
  for (const v in hash) {
    result.push(hash[v]);
  }
  return result;
};

const generateData = (departmentData: any[], department: string | number, line: { toString: () => any; }, values: { [x: string]: any; }) => {
  console.log("The values are", values);
  if (!departmentData) {
    return "";
  }
  let filteredDepartmentData = departmentData.filter(({lineNumber, status}) => lineNumber === line.toString() && status === "active");
  filteredDepartmentData = mergeStyleCode(filteredDepartmentData);
  const keys = values[department];
  let fileData = "";
  fileData += filteredDepartmentData.map((row: { createdAt: any; styleCode: any; values: any; }) => {
    const {createdAt, styleCode, values} = row;
    let header = `${csvDate(createdAt)},${styleCode},`;
    header += keys.map((key: string | number) => values[key] || 0);
    header += "\n";
    return header;
  });
  fileData = "," + fileData;
  fileData = `\n${department} and lineNumber ${line}\n` + fileData;
  return fileData;
};


exports.updateData = functions
    .region("asia-northeast3")
    .https
    .onCall(async (data, context) => {
      if (!context?.auth?.uid) {
        return {
          message: "Not permitted to update the Data",
        };
      }

      const uid = context.auth.uid;
      const user = await admin.firestore().collection("users").doc(uid).get();
      console.log("The data is ", user.data());
      const userData = user.data();
      if (!userData) {
        return {};
      }
      const {company} = userData;
      const {department, id, json, modifiedAt, status} = data;
      const entry = {...json, modifiedAt, status: status || "active"};
      const doc = await admin.firestore().collection("data").doc(company || DEFAULT_COMPANY).get();
      const companyData = doc.data();
      if (!companyData) {
        throw new Error("Data Not Present For the company" + company);
      }
      let departmentData = companyData[department] || [];
      departmentData = departmentData.map((item: { id: any; }) => {
        if (item.id !== id) {
          return item;
        }
        return {
          ...item,
          ...entry,
        };
      });
      const obj: any = {};
      obj[department] = departmentData;
      await admin.firestore().collection("data").doc(company || DEFAULT_COMPANY).set(obj, {merge: true});
      return departmentData;
    });

exports.insertStyleCode = functions
    .region("asia-northeast3")
    .https
    .onRequest(async (request, response) => {
      const {styleCodes, company} = request.body;
      console.log("The styleCodes and company are", styleCodes, company);
      const doc = await admin.firestore().collection("data").doc(company).get();
      console.log("The doc data", doc.data());
      const docData = doc.data();
      if (!docData) {
        throw new Error();
      }
      let existingStyleCodes = docData["styleCodes"] || [];
      existingStyleCodes = existingStyleCodes.concat(styleCodes.map((styleCode: string) => ({
        id: styleCode.toUpperCase(),
        name: styleCode.toUpperCase(),
      })));

      console.log("The styleCodes are", existingStyleCodes);
      existingStyleCodes = existingStyleCodes.reduce((acc: any[], current: { id: any; }) => {
        const x = acc.find((item: { id: any; }) => item.id === current.id);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);

      await admin.firestore().collection("data").doc(company).set({
        styleCodes: existingStyleCodes,
      }, {merge: true});

      response.send({
        styleCodes: existingStyleCodes,
      });
    });

exports.getUserRole = functions
    .region("asia-northeast3")
    .https
    .onCall(async (_data, context) => {
      if (!context?.auth?.uid) {
        return {
          uid: null,
          role: [],
        };
      }

      const uid = context.auth.uid;
      const user = await admin.firestore().collection("users").doc(uid).get();
      console.log("The data is ", user.data());
      const userData = user.data();
      if (!userData) {
        return {};
      }
      const {role, company} = userData;
      return {
        uid,
        role,
        company,
      };
    });

exports.backUpCompany = functions
    .region("asia-northeast3")
    .https
    .onRequest(async (request: { body: { company: any; }; }, response: { send: (arg0: any) => void; }) => {
      const {company} = request.body;
      const doc = await admin.firestore().collection("data").doc(company).get();
      const docData = doc.data();
      if (!docData) {
        throw new Error("");
      }
      await admin.firestore().collection("backup").doc(company + moment().valueOf()).set(docData);
      response.send(doc.data());
    });

exports.addDepartment = functions
    .region("asia-northeast3")
    .https
    .onCall(async (data: { departments: any; }, _context: any) => {
      const {departments} = data;
      await admin.firestore().collection("data").doc("anusha_8923").set({
        departments,
      }, {merge: true});
    });

exports.addForm = functions
    .region("asia-northeast3")
    .https
    .onRequest(async (request: { body: { company: any; form: any; }; }, response: { send: (arg0: any) => void; }) => {
      const {company, form} = request.body;
      console.log("Adding the form to the ", company, form);
      await admin.firestore().collection("data").doc(company).set({
        form,
      }, {
        merge: true,
      });
      response.send(form);
    });

const getCompany = async function(_data: any, context: any): Promise<{ company: string }> {
  const uid = context.auth.uid;
  const user = await admin.firestore().collection("users").doc(uid).get();
  console.log("The data is ", user.data());
  const userData = user.data();
  if (!userData) {
    throw new Error("User Data is Empty");
  }
  return userData as {company: string};
};

const getDepartments = (form: any[]) => {
  return form.map((department: { id: any; process: any; lines: any; }) => ({id: department.id, process: department.process, lines: department.lines}));
};


const getAggregate = async (company: any) => {
  console.log("The company is", company);
  const result: any = {};
  const dataDoc = await admin.firestore().collection("data").doc(company).get();
  const factoryData = dataDoc.data();
  if (!factoryData) {
    return {};
  }
  const departments = getDepartments(factoryData["form"]);
  console.log("The departments are", departments);

  for (const department of departments) {
    const {id: departmentId} = department;
    for (const update of (factoryData[departmentId] || [])) {
      if (update.status !== "active") {
        continue;
      }

      const {values, lineNumber, process, styleCode} = update;
      const processKey = process.toLowerCase();
      const key = `${styleCode.toLowerCase()}-${departmentId.toLowerCase()}-${lineNumber}-${processKey}`;
      if (!result[key]) {
        result[key] = {...values};
      } else {
        const total: any = {};
        for (const fieldKey in values) {
          total[fieldKey] = values[fieldKey] + (result[key][fieldKey] || 0);
        }
        result[key] = {
          ...result[key],
          ...total,
        };
        console.log("The total is", total);
      }
    }
  }
  console.log("The result is", result);
  return result;
};
/**
 *
 *  {
 *
 *  stylecode-department-line-process: { fabricIssued:212}
 * }
 *
 */
exports.dataInsights = functions
    .region("asia-northeast3")
    .https
    .onCall(async (data, context) => {
      if (!context?.auth?.uid) {
        return {
          message: "Not allowed",
        };
      }
      const {company} = await getCompany(data, context);
      return getAggregate(company || "test");
    });


const calculatePendingQty = (item:BOM): number => {
  const {reqQty, inventory, activeOrdersQty, issueQty} = item;
  return parseFloat(((reqQty||0) - (inventory||0) - (activeOrdersQty||0) - (issueQty||0)).toFixed(2));
};
const getMaterialStatus = (styleCode: string, boms: BOM[]) : MaterialStatus => {
  const materials = boms.filter( (bom) => bom.styleCode === styleCode);
  const allIn = materials.every( (item) => (item.inventory??0) >= item.reqQty );
  if (allIn) {
    return MaterialStatus.ALL_IN;
  }
  // const orderingRequired = materials.some( (item) => item.pendingQty??0 > 0);
  // if (!orderingRequired) {
  //   return MaterialStatus.ORDERING_REQUIRED;
  // }
  const fullyOrdered = materials.filter((item) => calculatePendingQty(item) > 0).every( (item) => ((item.activeOrdersQty??0) > 0 ) && ((item.activeOrdersQty??0) >= item.reqQty));
  if (fullyOrdered) {
    return MaterialStatus.FULLY_ORDERED;
  }

  const partialOrdered = materials.some((item) => (item.activeOrdersQty??0) > 0);
  if (partialOrdered) {
    return MaterialStatus.PART_ORDERED;
  }

  const noOrder = materials.every( (item) => (item.activeOrdersQty??0) <= 0);
  if (noOrder) {
    return MaterialStatus.NOT_ORDERED;
  }

  return MaterialStatus.UNKNOWN;
};

exports.getData = functions
    .region("asia-northeast3")
    .https
    .onCall(async (data, context) => {
      if (!context?.auth?.uid) {
        return {
          message: "Not allowed",
        };
      }
      const {company} = await getCompany(data, context);
      console.log("The company is", company);
      const companyDoc = await admin.firestore().collection("data").doc(company).get();
      const companyData = companyDoc.data();
      // companyData["aggregate"] = {...await getAggregate(company)}
      console.log("The getData result is", companyData);
      if (!companyData) {
        throw Error("The company does not exist " + company);
      }
      let styleCodesInfo = companyData.styleCodesInfo??[];
      const GRNInfo = companyData.GRNInfo??[];
      styleCodesInfo = styleCodesInfo as StyleCodes[];
      const bomsInfo = companyData.bomsInfo??[];
      styleCodesInfo = styleCodesInfo.map( (styleCode: StyleCodes)=> ({
        ...styleCode,
        materialStatus: getMaterialStatus(styleCode.styleCode, bomsInfo),
      }));
      return {
        ...companyData,
        styleCodesInfo: styleCodesInfo,
        GRNInfo: GRNInfo.filter((item:GRNItems) => item.status === "active"),
      };
    });

/**
 * { company, roles:[ { phoneNumber, department } ]}
 */
exports.addMetaRole = functions
    .region("asia-northeast3")
    .https
    .onRequest(async (request: { body: { company: any; roles: any; }; }, response: { send: (arg0: any) => void; }) => {
      const {company, roles} = request.body;
      console.log("The company and roles are ", company, roles);
      const obj: any = {};
      for (const role of roles) {
        const {phoneNumber, departments} = role;
        obj["+91" + phoneNumber] = {
          company,
          role: departments.map((department: string) => ({
            department,
            name: department === "all" ? "admin" : "manager",
          })),
        };
      }
      await admin.firestore().collection("meta").doc("user_roles").set(obj, {
        merge: true,
      });
      response.send(obj);
    });

// API for getting out the styleCodesInfo for the Pre Prod App
exports.styleCodesInfo = functions
    .region("asia-northeast3")
    .https
    .onCall(async (data: any, context: any) => {
      const {company} = await getCompany(data, context);
      const dataDoc = await admin.firestore().collection("data").doc(company).get();
      const companyInfo = dataDoc.data();
      if (!companyInfo) {
        throw new Error("Company Info is undefined");
      }
      const {styleCodesInfo} = companyInfo;
      return styleCodesInfo || [];
    });

/**
 * {
 *  styleCodeId,
 * }
 * Write a method that can be used for updating the record and the user will be able to change the system
 */
// API Endpoint for inserting the styleCodeInfo
const insertStyleCodeSchema = Joi.object<StyleCodesInfo, true>({
  company: Joi.string().required(),
  styleCodes: Joi.array().items({
    id: Joi.string(),
    styleCode: Joi.string().required(),
    brand: Joi.string().required(),
    product: Joi.string().required(),
    orderNo: Joi.string().required(),
    confirmDate: Joi.string(),
    orderQty: Joi.number().required(),
    makeQty: Joi.number(),
    deliveryDate: Joi.string(),
    status: Joi.string().default("active"),
  }).options({allowUnknown: true}),
})
    // .strict(true)
    .unknown(false);

exports.upsertStyleCodesInfo = onCall<StyleCodesInfo>({
  name: "upsertyStyleCodesInfo",
  schema: insertStyleCodeSchema,
  handler: async (data, context) => {
    console.log("The data is", data);
    const {company, styleCodes} = data;
    const doc = await admin.firestore().collection("data").doc(company).get();
    const docData = doc.data();
    if (!docData) {
      throw Error("The company does not exist" + company);
    }
    const styleCodesInfo = docData.styleCodesInfo??[];
    const output = upsertItemsInArray(styleCodesInfo, styleCodes, (oldItem, newItem) => oldItem.styleCode === newItem.styleCode);
    await admin.firestore().collection("data").doc(company).set( {
      styleCodesInfo: output,
    }, {
      merge: true,
    });
    return {
      company,
      styleCodes: output,
    };
  },
});

const upsertBOMSchema = Joi.object<BOMInfoDto, true>({
  company: Joi.string().required(),
  boms: Joi.array().items({
    styleCode: Joi.string().required(),
    category: Joi.string().required(),
    type: Joi.string().required(),
    materialId: Joi.string().required(),
    materialDescription: Joi.string().required(),
    consumption: Joi.number().required(),
    wastage: Joi.number().required(),
    unit: Joi.string().required(),
    placement: Joi.string().required(),
  }).options({allowUnknown: false}),
})
    .strict(true)
    .unknown(false);

const join = <T, P>(a:T[], b:P[], cmp:(e:T, f:P)=> boolean): (T&P) [] => {
  let output: any = [];
  output = a.map((item) => ({
    ...item,
    ...b.find((bitem) => cmp(item, bitem)),
  }));
  return output;
};

exports.upsertBOMInfo = onCall<BOMInfo>({
  name: "upsertBOMInfo",
  schema: upsertBOMSchema,
  handler: async (data, context) => {
    console.log("The data is", data);
    const {company, boms} = data;
    const doc = await admin.firestore().collection("data").doc(company).get();
    const docData = doc.data();
    if (!docData) {
      throw Error("The company does not exist" + company);
    }
    const styleCodesInfo:StyleCodes[] = docData.styleCodesInfo;
    if (!styleCodesInfo) {
      throw Error("StyleCodes Not Present");
    }
    const bomsInfo: BOM[] = docData.bomsInfo??[];
    const oldPurchaseMaterials = docData.purchaseMaterialsInfo??[];
    const inventory = docData.inventoryInfo??[];
    // This will use stylecode plus materialId
    const bomJoinedStyleCode = join(boms, styleCodesInfo, (a, b)=>a.styleCode === b.styleCode);
    const mappedBOMDTO: any = bomJoinedStyleCode.map( (bom) => ({
      styleCode: bom.styleCode,
      category: bom.category,
      type: bom.type,
      materialId: bom.materialId,
      materialDescription: bom.materialDescription,
      consumption: bom.consumption,
      wastage: bom.wastage,
      unit: bom.unit,
      placement: bom.placement,
      // issueQty: 0,
      // no: 1,
      // id: generateUId("BOM", 8),
      reqQty: parseFloat((bom.makeQty*bom.consumption*(1+bom.wastage/100)).toFixed(2)),
      // inventory: 0,
      // activeOrdersQty: 0,
      // pendingQty: 0,
    }));
    const output = upsertItemsInArray(bomsInfo,
        mappedBOMDTO,
        (oldItem, newItem) => (oldItem.materialId + oldItem.materialDescription) === (newItem.materialId + newItem.materialDescription) &&
        oldItem.styleCode === newItem.styleCode,
        {
          issueQty: 0,
          id: generateUId("BOM", 8),
          inventory: 0,
          activeOrdersQty: 0,
        },
        (a, b) => ({...a, ...b, pendingQty: calculatePendingQty(b)})
    );
    // const inventories: InventoryItems[] = [];
    // const p = collectInventoryFromStyleCodes(output, inventories);
    const p = distributeInventory(styleCodesInfo, output, inventory);
    const purchaseMaterialsInfo = populatePurhcaseMaterialsFromBOM(p.bomsInfo, oldPurchaseMaterials);
    await admin.firestore().collection("data").doc(company).set( {
      bomsInfo: p.bomsInfo,
      purchaseMaterialsInfo,
      inventoryInfo: p.inventoryInfo,
    }, {
      merge: true,
    });
    return {
      company,
      bomsInfo: output,
      purchaseMaterialsInfo,
    };
  },
});

const defaultPurchaseMaterials: any = {
  unit: "pc",
  pendingQty: 0,
  purchaseQty: 0,
  rate: 0,
  discount: 0,
  preTaxAmount: 0,
  tax: 0,
  taxAmount: 0,
  totalAmount: 0,
  supplier: "",
  deliveryDate: "",
};

const populatePurhcaseMaterialsFromBOM = (boms: BOM[], purchaseMaterials:PurchaseMaterials[]) => {
  const mp:any = {};
  for (const bom of boms) {
    const key = bom.materialId + "|" + bom.materialDescription;
    if (mp[key]) {
      mp[key] = {
        ...mp[key],
        ...bom,
        pendingQty: bom.pendingQty + mp[key].pendingQty,
      };
    } else {
      mp[key] = {
        ...bom,
      };
    }
  }

  const mergedBoms = [];
  for (const key in mp) {
    mergedBoms.push({
      ...mp[key],
    });
  }
  const mapMergedBomsToPurchaseMaterial:PurchaseMaterials[] = mergedBoms.map((item:BOM) => ({
    id: generateUId("PM", 8),
    styleCode: item.styleCode,
    category: item.category,
    type: item.type,
    materialId: item.materialId,
    materialDescription: item.materialDescription,
    unit: item.unit,
    pendingQty: item.pendingQty || 0,
    purchaseQty: 0,
    rate: 0,
    discount: 0,
    preTaxAmount: 0,
    tax: 0,
    taxAmount: 0,
    totalAmount: 0,
    supplier: "",
    deliveryDate: "",
  }));
  const purchaseMaterialsInfo = upsertItemsInArray(purchaseMaterials,
      mapMergedBomsToPurchaseMaterial,
      (a: PurchaseMaterials, b: PurchaseMaterials)=> a.materialId === b.materialId && a.materialDescription === b.materialDescription,
      {
        purchaseQty: 0,
        rate: 0,
        discount: 0,
        preTaxAmount: 0,
        tax: 0,
        taxAmount: 0,
        totalAmount: 0,
        supplier: "",
        deliveryDate: "",
        status: "active",
        id: generateUId("PM", 8),
      }
  );
  return purchaseMaterialsInfo;
};

const upsertPurchaseMaterialsSchema = Joi.object<PurchaseMaterialsInfo, true>({
  company: Joi.string().required(),
  createdAt: Joi.string(),
  purchaseMaterials: Joi.array().items({
    styleCode: Joi.string().required(),
    category: Joi.string().required(),
    type: Joi.string().required(),
    materialId: Joi.string().required(),
    materialDescription: Joi.string().required(),
    unit: Joi.string().default("pc"),
    pendingQty: Joi.number(),
    purchaseQty: Joi.number(),
    rate: Joi.number(),
    discount: Joi.number(),
    preTaxAmount: Joi.number(),
    tax: Joi.number(),
    taxAmount: Joi.number(),
    totalAmount: Joi.number(),
    supplier: Joi.string(),
    deliveryDate: Joi.string(),
  }).options({allowUnknown: true}),
})
    // .strict(true)
    .unknown(false);

exports.upsertPurchaseMaterialsInfo = onCall<PurchaseMaterialsInfo>({
  name: "upsertPurchaseMaterialsInfo",
  schema: upsertPurchaseMaterialsSchema,
  handler: async (data, context) => {
    console.log("The data is", data);
    const {company, purchaseMaterials} = data;
    const doc = await admin.firestore().collection("data").doc(company).get();
    const docData = doc.data();
    if (!docData) {
      throw Error("The company does not exist" + company);
    }
    const purchaseMaterialsInfo = docData.purchaseMaterialsInfo??[];
    // This will use stylecode plus materialId
    const output = upsertItemsInArray(purchaseMaterialsInfo, purchaseMaterials,
        (oldItem, newItem) => (oldItem.materialId + oldItem.materialDescription) === (newItem.materialId + newItem.materialDescription) && oldItem.styleCode === newItem.styleCode,
        defaultPurchaseMaterials);
    await admin.firestore().collection("data").doc(company).set( {
      purchaseMaterialsInfo: output,
    }, {
      merge: true,
    });
    return {
      company,
      purchaseMaterialsInfo: output,
    };
  },
});

const upsertPurchaseOrdersInfoSchema = Joi.object<PurchaseOrdersInfo, true>({
  company: Joi.string().required(),
  purchaseOrders: Joi.array().items({
    id: Joi.string().required(),
    name: Joi.string().required(),
    category: Joi.string().required(),
  }),
})
    .strict(true)
    .unknown(false);

// The individual Line Items in the purchaseOrder can not be appended
// New Line Items will replace the old one
exports.upsertPurchaseOrdersInfo = onCall<PurchaseOrdersInfo>({
  name: "upsertPurchaseOrdersInfo",
  schema: upsertPurchaseOrdersInfoSchema,
  handler: async (data, context) => {
    console.log("The data is", data);
    const {company, purchaseOrders} = data;
    const doc = await admin.firestore().collection("data").doc(company).get();
    const docData = doc.data();
    if (!docData) {
      throw Error("The company does not exist" + company);
    }
    const purchaseOrdersInfo = docData.purchaseOrdersInfo??[];
    // This will use stylecode plus materialId
    const output = upsertItemsInArray(purchaseOrdersInfo, purchaseOrders, (oldItem, newItem) => oldItem.purchaseOrderId === newItem.purchaseOrderId);
    return await admin.firestore().collection("data").doc(company).set( {
      purchaseOrdersInfo: output,
    }, {
      merge: true,
    });
  },
});

// exports.styleCodesInfo = onRequest({
//   name:"styleCodesInfo",
//   schema: {
//     "GET": insertStyleCodeSchema,
//   },
//   handler: {

//   }
// })


// exports.insertStyleCodesInfo = functions
//     .region("asia-northeast3")
//     .https
//     .onCall(async (data: { company: any; styleCodeInfo: any; }, _context: any) => {
//       const {company, styleCodeInfo} = data;
//       styleCodeInfo["id"] = generateUId("", 8);
//       console.log("The insertStyleCodesIndo", company);
//       if (!styleCodeInfo) {
//         return {

//         };
//       }
//       const dataDoc = await admin.firestore().collection("data").doc(company).get();
//       const companyInfo = dataDoc.data();
//       const styleCodesInfo = companyInfo?.styleCodesInfo ?? [];
//       await admin.firestore().collection("data").doc(company).set({
//         styleCodesInfo: [styleCodeInfo, ...styleCodesInfo],
//       }, {
//         merge: true,
//       }
//       );
//       return data;
//     });
const collectInventoryFromStyleCodes = (boms: BOM[], inventories: InventoryItems[]) => {
  const mp:any = {};
  for (const bom of boms) {
    const key = bom.materialId + "|" + bom.materialDescription;
    if (mp[key]) {
      mp[key].inventory += bom.inventory??0;
      mp[key].activeOrdersQty += bom.activeOrdersQty??0;
    } else {
      mp[key] = {
        inventory: bom.inventory??0,
        activeOrdersQty: bom.activeOrdersQty??0,
      };
    }
    bom.inventory = 0;
    bom.activeOrdersQty = 0;
    bom.pendingQty = calculatePendingQty(bom);
  }
  for (const inventory of inventories) {
    const key = inventory.materialId +"|"+ inventory.materialDescription;
    if (mp[key]) {
      inventory.inventory += mp[key].inventory;
      inventory.activeOrdersQty += mp[key].activeOrdersQty;
      delete mp[key];
    }
  }
  if (Object.keys(mp).length === 0) {
    return {
      boms,
      inventory: inventories,
    };
  }
  for (const key in mp) {
    const [materialId, materialDescription] = key.split("|");
    inventories.push({
      materialId,
      materialDescription,
      ...mp[key],
      issue: 0,
    });
  }
  return {
    boms,
    inventory: inventories,
  };
};

// How will you distribute the activeOrders
const distributeInventory = (
    styleCodesInfo:StyleCodes[],
    allBoms:BOM[],
    inventory:InventoryItems[]
) : {bomsInfo:BOM[], inventoryInfo:InventoryItems[]}=> {
  const activeStyleCodes:StyleCodes[] = styleCodesInfo.filter((item: StyleCodes) => item.status === "active");
  activeStyleCodes.sort((a: StyleCodes, b: StyleCodes) => moment(a.deliveryDate).valueOf() - moment(b.deliveryDate).valueOf());

  if (!inventory) {
    throw new Error("No Global Inventory");
  }

  if (!allBoms) {
    return {
      bomsInfo: allBoms,
      inventoryInfo: inventory,
    };
  }
  collectInventoryFromStyleCodes(allBoms, inventory);
  for (const activeStyleCode of activeStyleCodes) {
    // const boms = allBoms.filter((item: BOM) => item.styleCode === activeStyleCode.styleCode)
    for (let bom of allBoms) {
      bom = bom as BOM;
      if (bom.styleCode !== activeStyleCode.styleCode) {
        continue;
      }
      assignInventoryToBOMItem(bom, inventory);
    }
  }
  return {
    bomsInfo: allBoms,
    inventoryInfo: inventory,
  };
  // await admin.firestore().collection("data").doc(company).set({
  //   bomsInfo: allBoms,
  //   inventoryInfo: inventory
  // }
  //   ,{ merge: true})
};

const assignInventoryToBOMItem = (bom: BOM, inventory: InventoryItems[]) => {
  const inventoryNeed = Math.max(bom.reqQty - (bom.issueQty??0), 0);
  const globalInventory = inventory.find(
      (item:InventoryItems) => item.materialId === bom.materialId && item.materialDescription === bom.materialDescription
  );
  if (!globalInventory) {
    bom.inventory = 0;
    bom.activeOrdersQty = 0;
    return;
  }
  bom.inventory = Math.min(inventoryNeed, globalInventory.inventory);
  globalInventory.inventory -= bom.inventory;
  if (bom.inventory < inventoryNeed) {
    bom.activeOrdersQty = Math.min(globalInventory.activeOrdersQty, inventoryNeed-bom.inventory);
    globalInventory.activeOrdersQty -= bom.activeOrdersQty;
  }
  bom.pendingQty = calculatePendingQty(bom);
};

exports.actions = functions
    .region("asia-northeast3")
    .https
    .onCall(async (data: { type: any; item: any; }, context: any) => {
      const {company} = await getCompany(data, context);
      const {type, item} = data;
      console.log("The company, type and item are", company, type, item);
      const dataDoc = await admin.firestore().collection("data").doc(company).get();
      const companyInfo = dataDoc.data();
      if (!companyInfo) {
        throw new Error("Company Info is undefined");
      }
      const output: any = {};
      switch (type) {
        case "dashboard":
          output["styleCodesInfo"] = upsertItemInArray(companyInfo["styleCodesInfo"], item);
          break;
        case "orderMaterials":
          output["billOfMaterials"] = upsertItemInArray(companyInfo["billOfMaterials"], item);
          break;
        case "purchaseOrders":
          output["purchaseOrders"] = upsertItemInArray(companyInfo["purchaseOrders"], item);
          break;
        default:
      }
      await admin.firestore().collection("data").doc(company).set(output, {merge: true});
      console.log("The output is", output);
      return output;
    });

const upsertItemsInArray = <T>(items: T[],
  newItems: T[],
  cmp = (a:any, b:any) => a.id === b.id, obj?:any,
  mergeObj?:(a:T, b:T)=>T) => {
  let output: any[] = [...items];
  for (const newItem of newItems) {
    output = upsertItemInArray<T>(output, newItem, cmp, obj, mergeObj );
  }
  return output;
};

const upsertItemInArray = <T>(items: T[],
  newItem: T,
  cmp = (a: any, b: any) => a.id === b.id,
  defaultObj?:any,
  mergeObj:( a:T, b:T)=> T= (a:T, b:T) => ({...a, ...b})) => {
  let output = [];
  let inserted = false;
  // Add some code to remove the spaces around the value
  for (const item of items) {
    if (cmp(item, newItem)) {
      inserted = true;
      output.push(mergeObj(item, newItem));
    } else {
      output.push(item);
    }
  }
  if (!inserted) {
    output = [{
      id: generateUId("", 8),
      ...defaultObj,
      ...newItem,
    }, ...output];
  }
  return output;
};

exports.updateStyleCodesInfo = functions
    .region("asia-northeast3")
    .https
    .onCall(async (data: { styleCodeInfo: any; }, context: any) => {
      const {company} = await getCompany(data, context);
      const {styleCodeInfo} = data;
      console.log("The company is", company);
      const dataDoc = await admin.firestore().collection("data").doc(company).get();
      const companyInfo = dataDoc.data();
      const styleCodesInfo = companyInfo?.styleCodesInfo ?? [];
      const obj = [];
      for (const info of styleCodesInfo) {
        if (info.id === styleCodeInfo?.id) {
          obj.push({
            ...info,
            ...styleCodeInfo,
          });
        } else {
          obj.push(info);
        }
      }
      console.log("The updatedStyleCodesInfo are", obj);
      await admin.firestore().collection("data").doc(company || DEFAULT_COMPANY).set({
        styleCodesInfo: obj,
      }, {merge: true});
      return obj;
    });


const upsertCreatePOSchema = Joi.object<PurchaseMaterialsInfo, true>({
  company: Joi.string().required(),
  createdAt: Joi.string(),
  purchaseMaterials: Joi.array().items({
    styleCode: Joi.string().required(),
    category: Joi.string().required(),
    type: Joi.string().required(),
    materialId: Joi.string().required(),
    materialDescription: Joi.string().required(),
    unit: Joi.string().required(),
    pendingQty: Joi.number().required(),
    purchaseQty: Joi.number().required(),
    rate: Joi.number().required(),
    discount: Joi.number().required(),
    preTaxAmount: Joi.number().required(),
    tax: Joi.number().required(),
    taxAmount: Joi.number().required(),
    totalAmount: Joi.number().required(),
    supplier: Joi.string().required(),
    deliveryDate: Joi.string().required(),
  }).options({allowUnknown: true}),
})
// .strict(true)
    .unknown(false);

exports.upsertCreatePO= onCall<PurchaseMaterialsInfo>({
  name: "upsertCreatePO",
  schema: upsertCreatePOSchema,
  handler: async (data, context) => {
    const supplierMap: any = {};
    const total : any= {};
    const {company, purchaseMaterials, createdAt} = data;
    const doc = await admin.firestore().collection("data").doc(company).get();
    const docData = doc.data();
    if (!docData) {
      throw Error("Document is not prsent for the company");
    }
    const purchaseOrdersInfo = docData.purchaseOrdersInfo??[];
    const bomsInfo = docData.bomsInfo??[];
    const purchaseMaterialsInfo = docData.purchaseMaterialsInfo??[];
    const inventory: InventoryItems[] = docData.inventoryInfo??[];
    const styleCodes: StyleCodes[] = docData.styleCodesInfo??[];
    const grnInfo: GRNItems[] = docData.GRNInfo??[];
    let deliveryDate="";

    for (let item of purchaseMaterials) {
      item = item as PurchaseMaterials;
      const supplier = item.supplier.trim().toLowerCase();
      const inventoryItem: InventoryItems|undefined = inventory.find((inventoryItem : InventoryItems) => item.materialId === inventoryItem.materialId && inventoryItem.materialDescription === item.materialDescription);
      if (!inventoryItem) {
        throw Error("The material Entry is not present in the gloabl inventory");
      }
      if (item.purchaseQty <= 0) {
        throw Error("The purchaseQty can not be zero");
      }
      deliveryDate = item.deliveryDate;
      inventoryItem.activeOrdersQty += item.purchaseQty;
      // console.log("The bom Items are activeOrdersQty pendingQty", bom.activeOrdersQty, bom.pendingQty);
      const {styleCode, totalAmount} = item;
      if (!supplierMap[supplier]) {
        supplierMap[supplier] = [];
        total[supplier] = 0;
      }
      supplierMap[supplier].push({
        sno: supplierMap[supplier].length + 1,
        referenceId: styleCode,
        ...item,
        // itemId: id,
        // itemDesc: description,
        // quantity: poQty * consumption,
        // unit: unit,
        // rate: rate,
        // tax: "",
        // amount: amount,
      });
      total[supplier] += totalAmount;
    }
    console.log("The supplier map is", supplierMap);
    const purchaseOrders : PurchaseOrder[] = [];
    for (const key in supplierMap) {
      purchaseOrders.push({
        id: generateUId("PO-", 10).toUpperCase(),
        supplier: key,
        createdAt,
        purchaseOrderId: "",
        deliveryDate,
        amount: total[key],
        status: POStatus.ACTIVE.toString(),
        lineItems: supplierMap[key],
      });
    }
    const distributedInventory = distributeInventory(styleCodes, bomsInfo, inventory);
    let result = populatePurhcaseMaterialsFromBOM(distributedInventory.bomsInfo, purchaseMaterialsInfo);
    // Update the filter to deleted for those items which are removed because the pendingQty is less than equal to zero
    result = result.filter( (item:PurchaseMaterials) => item.pendingQty > 0);
    // const new = purchaseMaterialsInfo.filter(()=>());
    // const result = purchaseMaterialsInfo.filter((x :PurchaseMaterials) => purchaseMaterials.every((x2) => (x2.styleCode+x2.materialId+x2.materialDescription) !== (x.styleCode+x.materialId+x.materialDescription)));
    const grn: GRNItems[] = mapPOToGRN(purchaseOrders);
    await admin.firestore().collection("data").doc(company).set(
        {
          bomsInfo: distributedInventory.bomsInfo,
          inventoryInfo: distributedInventory.inventoryInfo,
          purchaseOrdersInfo: [...purchaseOrders, ...purchaseOrdersInfo],
          purchaseMaterialsInfo: result,
          GRNInfo: [...grn, ...grnInfo],
        }
        , {
          merge: true,
        });
    return {
      bomsInfo,
      purchaseOrdersInfo: [...purchaseOrders],
      purchaseMaterialsInfo: result,
    };
  },
});

const upsertCreateGRNSchema = Joi.object<GRN, true>({
  company: Joi.string().required(),
  createdAt: Joi.string(),
  GRN: Joi.array().items({
    id: Joi.string().required(),
    purchaseOrderId: Joi.string().required(),
    category: Joi.string().required(),
    type: Joi.string().required(),
    styleCode: Joi.string(),
    materialId: Joi.string().required(),
    materialDescription: Joi.string().required(),
    unit: Joi.string().required(),
    purchaseQty: Joi.number().required(),
    receivedQty: Joi.number().required(),
    receivedDate: Joi.string().required(),
    rejectedQty: Joi.number().required(),
    rejectedReason: Joi.string().required(),
    acceptedQty: Joi.number().required(),
  }).options({allowUnknown: true}),
})
// .strict(true)
    .unknown(false);

//  Use it to udpate the items.
// It does not lead to firing up of the values

exports.upsertGRNItem = onCall<GRN>({
  name: "upsertGRNItem",
  schema: upsertCreateGRNSchema,
  handler: async (data, context) => {
    console.log("The data is", data);
    const {company, GRN} = data;
    const doc = await admin.firestore().collection("data").doc(company).get();
    const docData = doc.data();
    if (!docData) {
      throw Error("The company does not exist" + company);
    }
    const grnInfo = docData.GRNInfo;
    if (!grnInfo) {
      throw Error("The GRN info does not exist");
    }

    const grnInfoOutput = upsertItemsInArray(grnInfo, GRN, (oldItem: GRNItems, newItem:GRNItems) => oldItem.purchaseOrderId === newItem.purchaseOrderId &&
    oldItem.materialId === newItem.materialId &&
    oldItem.materialDescription === newItem.materialDescription);

    await admin.firestore().collection("data").doc(company).set( {
      GRNInfo: grnInfoOutput,
    }, {
      merge: true,
    });
  },
});

exports.upsertGRN = onCall<GRN>({
  name: "upsertGRN",
  schema: upsertCreateGRNSchema,
  handler: async (data, context) => {
    console.log("The data is", data);
    const {company, GRN} = data;
    const doc = await admin.firestore().collection("data").doc(company).get();
    const docData = doc.data();
    if (!docData) {
      throw Error("The company does not exist" + company);
    }
    const grnInfo = docData.GRNInfo??[];
    const activeGRNInfo = grnInfo.filter((item: GRNItems) => item.status === "active");
    let grnInfoOutput = upsertItemsInArray(activeGRNInfo, GRN, (oldItem: GRNItems, newItem:GRNItems) => oldItem.purchaseOrderId === newItem.purchaseOrderId &&
    oldItem.materialId === newItem.materialId &&
    oldItem.materialDescription === newItem.materialDescription);

    const inventory = grnInfoOutput.map( (output: GRNItems) => ({
      materialId: output.materialId,
      materialDescription: output.materialDescription,
      inventory: output.acceptedQty,
      purchaseQty: output.purchaseQty,
    }));
    const inventoryInfo = docData.inventoryInfo??[];
    const bomsInfo = docData.bomsInfo??[];
    const styleCodesInfo = docData.styleCodesInfo??[];
    const result = collectInventoryFromStyleCodes(bomsInfo, inventoryInfo);
    const collectedInventory = result?.inventory;
    if (!collectedInventory) {
      throw Error("Inventory Collection Failed");
    }
    const output = upsertItemsInArray(collectedInventory, inventory as any, (oldItem: InventoryItems, newItem: InventoryItems) => oldItem.materialId === newItem.materialId &&
    oldItem.materialDescription === newItem.materialDescription,
    undefined,
    (oldItem: InventoryItems, newItem: any)=> ({
      ...oldItem,
      inventory: oldItem.inventory + newItem.inventory,
      activeOrdersQty: oldItem.activeOrdersQty - newItem.purchaseQty,
    }));

    const p = distributeInventory(styleCodesInfo, result.boms, output);
    // let grnAfterRemovingItem = grnInfoOutput.filter( item => )
    const GRNDone = GRN.map( (item: GRNItems)=> ({
      ...item,
      status: "done",
    }));
    grnInfoOutput = upsertItemsInArray(grnInfo, GRNDone, (oldItem: GRNItems, newItem:GRNItems) => oldItem.purchaseOrderId === newItem.purchaseOrderId &&
    oldItem.materialId === newItem.materialId &&
    oldItem.materialDescription === newItem.materialDescription);

    await admin.firestore().collection("data").doc(company).set( {
      GRNInfo: grnInfoOutput,
      inventoryInfo: p.inventoryInfo,
      bomsInfo: p.bomsInfo,
    }, {
      merge: true,
    });
    return {
      company,
      GRNInfo: grnInfoOutput.filter( (item) => item.status === "active"),
      inventoryInfo: p.inventoryInfo,
      bomsInfo: p.bomsInfo,
    };
  },
});

const upsertCreateInventorySchema = Joi.object<InventoryInfo, true>({
  company: Joi.string().required(),
  createdAt: Joi.string(),
  inventory: Joi.array().items({
    materialId: Joi.string().required(),
    materialDescription: Joi.string().required(),
    issue: Joi.number().required(),
    activeOrdersQty: Joi.string().required(),
    inventory: Joi.number().required(),
  }).options({allowUnknown: true}),
})
// .strict(true)
    .unknown(false);

exports.upsertInventory = onCall<InventoryInfo>({
  name: "upsertInventory",
  schema: upsertCreateInventorySchema,
  handler: async (data, context) => {
    console.log("The data is", data);
    const {company, inventory} = data;
    const doc = await admin.firestore().collection("data").doc(company).get();
    const docData = doc.data();
    if (!docData) {
      throw Error("The company does not exist" + company);
    }
    const inventoryInfo = docData.inventoryInfo??[];
    const bomsInfo = docData.bomsInfo??[];
    const styleCodesInfo = docData.styleCodesInfo??[];
    const result = collectInventoryFromStyleCodes(inventoryInfo, bomsInfo);
    const collectedInventory = result?.inventory;
    if (!collectedInventory) {
      throw Error("Inventory Collection Failed");
    }
    const output = upsertItemsInArray(collectedInventory, inventory, (oldItem: InventoryItems, newItem: InventoryItems) => oldItem.materialId === newItem.materialId &&
    oldItem.materialDescription === newItem.materialDescription);

    const p = distributeInventory(styleCodesInfo, result.boms, output);

    await admin.firestore().collection("data").doc(company).set( {
      inventoryInfo: p.inventoryInfo,
      bomsInfo: p.bomsInfo,
    }, {
      merge: true,
    });
    return {
      company,
      inventoryInfo: p.inventoryInfo,
      bomsInfo: p.bomsInfo,
    };
  },
});

exports.createPO = functions
    .region("asia-northeast3")
    .https
    .onCall(async (data: { bom: any; createdAt: any; }, context: any) => {
      const {company} = await getCompany(data, context);
      const {bom, createdAt} = data;
      console.log("The bom is createdAt company", bom, createdAt, company);
      const supplierMap: any = {};
      const totalAmount:any = {};

      for (const item of bom) {
        const {supplier, styleCode, description, id, poQty, unit, rate, consumption} = item;
        console.log("The item information is", item);

        if (!supplierMap[supplier]) {
          supplierMap[supplier] = [];
          totalAmount[supplier] = 0;
        }
        const amount = (poQty || 0) * (rate || 0) * (consumption || 0);
        supplierMap[supplier].push({
          sno: supplierMap[supplier].length + 1,
          referenceId: styleCode,
          itemId: id,
          itemDesc: description,
          quantity: poQty * consumption,
          unit: unit,
          rate: rate,
          tax: "",
          amount: amount,
        });
        totalAmount[supplier] += amount;
      }
      console.log("The supplier map is", supplierMap);
      const purchaseOrders = [];
      for (const key in supplierMap) {
        purchaseOrders.push({
          id: generateUId("", 10).toUpperCase(),
          supplier: key,
          createdAt,
          deliveryDate: "",
          amount: totalAmount[key],
          status: "active",
          data: supplierMap[key],
        });
      }

      const doc = await admin.firestore().collection("data").doc(company).get();
      const companyData = doc.data();
      if (!companyData) {
        throw new Error("The company does not exist");
      }
      const {purchaseOrders: pastOrders} = companyData;
      await admin.firestore().collection("data").doc(company).set({
        purchaseOrders: [...purchaseOrders, ...(pastOrders || [])],
      }, {
        merge: true,
      });

      return [...purchaseOrders, ...(pastOrders || [])];
    });

const mapPOToGRN = (purchaseOrders : PurchaseOrder []) : GRNItems[] => {
  let grnItems: GRNItems[]= [];

  for (const purchaseOrder of purchaseOrders) {
    const data: GRNItems[] = purchaseOrder.lineItems.map( (item: PurchaseOrderLineItems) => ({
      id: generateUId("GRN", 10),
      purchaseOrderId: purchaseOrder.id,
      category: item.category,
      type: item.type,
      materialId: item.materialId,
      materialDescription: item.materialDescription,
      unit: item.unit,
      purchaseQty: item.purchaseQty,
      receivedQty: 0,
      status: "active",
      receivedDate: "",
      rejectedQty: 0,
      rejectedReason: "",
      acceptedQty: 0,
    }));
    grnItems = grnItems.concat(data);
  }
  return grnItems;
};
// Will pick it up when making the RestFul APIs
// const router = express.Router();
// const defaultRoutes = [
//   {
//     path: '/styleCode',
//     route:
//   }
// ];

// defaultRoutes.forEach((route) => {
//   router.use(route.path, route.route);
// });

// app.use("/", router);
// exports.api = functions.region("asia-northeast3").https.onRequest(app)
