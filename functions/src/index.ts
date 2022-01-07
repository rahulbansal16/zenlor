/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable guard-for-in */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as moment from "moment";
/* tslint:disable */
admin.initializeApp();
admin.firestore().settings({
  ignoreUndefinedProperties: true,
});

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
          console.log("The process are", form[proces].map((field: string) => field));
          values[id] = values[id].concat(form[proces].map((field: string) => field));
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
      return companyData;
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
exports.insertStyleCodesInfo = functions
    .region("asia-northeast3")
    .https
    .onCall(async (data: { company: any; styleCodeInfo: any; }, _context: any) => {
      const {company, styleCodeInfo} = data;
      styleCodeInfo["id"] = generateUId("", 8);
      console.log("The insertStyleCodesIndo", company);
      if (!styleCodeInfo) {
        return {

        };
      }
      const dataDoc = await admin.firestore().collection("data").doc(company).get();
      const companyInfo = dataDoc.data();
      const styleCodesInfo = companyInfo?.styleCodesInfo ?? [];
      await admin.firestore().collection("data").doc(company).set({
        styleCodesInfo: [styleCodeInfo, ...styleCodesInfo],
      }, {
        merge: true,
      }
      );
      return data;
    });

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
          output["styleCodesInfo"] = updateItemInArray(companyInfo["styleCodesInfo"], item);
          break;
        case "orderMaterials":
          output["billOfMaterials"] = updateItemInArray(companyInfo["billOfMaterials"], item);
          break;
        case "purchaseOrders":
          output["purchaseOrders"] = updateItemInArray(companyInfo["purchaseOrders"], item);
          break;
        default:
      }
      await admin.firestore().collection("data").doc(company).set(output, {merge: true});
      console.log("The output is", output);
      return output;
    });


const updateItemInArray = (items: any, newItem: any, cmp = (a: { id: any; }, b: { id: any; }) => a.id === b.id) => {
  const output = [];
  let inserted = false;
  // Add some code to remove the spaces around the value
  for (const item of items) {
    if (cmp(item, newItem)) {
      inserted = true;
      output.push({
        ...item,
        ...newItem,
      });
    } else {
      output.push(item);
    }
  }
  if (!inserted) {
    output.push({
      id: generateUId("", 8),
      ...newItem,
    });
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

exports.createPO = functions
    .region("asia-northeast3")
    .https
    .onCall(async (data: { bom: any; createdAt: any; }, context: any) => {
      const {company} = await getCompany(data, context);
      const {bom, createdAt} = data;
      console.log("The bom is createdAt company", bom, createdAt, company);
      const supplierMap: any = {};
      let totalAmount = 0;

      for (const item of bom) {
        const {supplier, styleCode, description, id, poQty, unit, rate, consumption} = item;
        console.log("The item information is", item);

        if (!supplierMap[supplier]) {
          supplierMap[supplier] = [];
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
        totalAmount += amount;
      }
      console.log("The supplier map is", supplierMap);
      const purchaseOrders = [];
      for (const key in supplierMap) {
        purchaseOrders.push({
          id: generateUId("", 10).toUpperCase(),
          supplier: key,
          createdAt,
          deliveryDate: "",
          amount: totalAmount,
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
