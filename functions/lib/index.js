"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterialStatus = exports.POStatus = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const moment = require("moment");
const Joi = require("joi");
const path = require("path");
const os = require("os");
const excelJS = require("exceljs");
const functions_1 = require("./helpers/functions");
const Constants_1 = require("./Constants");
const util_1 = require("./util");
const dirPath = path.join(__dirname, 'zenlor-firebase-adminsdk-97xt1-7ebaf317cd.json');
admin.initializeApp({
    credential: admin.credential.cert(dirPath),
});
admin.firestore().settings({
    ignoreUndefinedProperties: true,
});
var POStatus;
(function (POStatus) {
    POStatus["ACTIVE"] = "ACTIVE";
    POStatus["COMPLETED"] = "COMPLETED";
    POStatus["CANCELLED"] = "CANCELLED";
})(POStatus = exports.POStatus || (exports.POStatus = {}));
var MaterialStatus;
(function (MaterialStatus) {
    MaterialStatus["ALL_IN"] = "ALL_IN";
    MaterialStatus["NOT_ORDERED"] = "NOT_ORDERED";
    MaterialStatus["PART_ORDERED"] = "PARTIAL_ORDERED";
    MaterialStatus["FULLY_ORDERED"] = "FULLY_ORDERED";
    MaterialStatus["UNKNOWN"] = "UNKNOWN";
    MaterialStatus["ORDERING_REQUIRED"] = "ORDERING_REQUIRED";
    MaterialStatus["NO_BOM"] = "NO_BOM";
})(MaterialStatus = exports.MaterialStatus || (exports.MaterialStatus = {}));
const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const DEFAULT_COMPANY = "test";
const DEFAULT_ROLE = [{
        name: "admin",
        department: "all",
    }];
function generateUId(prefix, length) {
    let result = " ";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    result = prefix + result.trim();
    return result.trim().toLowerCase();
}
exports.addUser = functions.region("asia-northeast3").auth.user().onCreate(async (user) => {
    const userInfo = JSON.parse(JSON.stringify(user));
    userInfo["company"] = DEFAULT_COMPANY;
    userInfo["role"] = DEFAULT_ROLE;
    const phoneNumber = userInfo.phoneNumber;
    const metaRole = await admin.firestore().collection("meta").doc("user_roles").get();
    const data = metaRole.data();
    console.log("The metaRole is", data);
    if (data && data[phoneNumber]) {
        const { company, role } = data[phoneNumber];
        if (company && role) {
            if (!(role === null || role === void 0 ? void 0 : role.company)) {
                role["company"] = company;
            }
            console.log("Setting up the role and company as", role, company);
            userInfo["role"] = role;
            userInfo["company"] = company;
        }
        else {
            console.log("Setting up the default role and company", DEFAULT_ROLE, DEFAULT_COMPANY);
        }
    }
    return admin
        .firestore()
        .collection("users")
        .doc(user.uid)
        .set(userInfo);
});
const issueInventory = (material, bomsInfo) => {
    const { styleCode, materialIssue } = material;
    console.log(styleCode, materialIssue);
    const { materialId, materialDescription, issueAmount } = materialIssue[0];
    const bom = bomsInfo.find((item) => item.materialId == materialId && item.materialDescription === materialDescription && item.styleCode === styleCode);
    if (!bom) {
        throw Error("The material Does not exist for the stylecode cannot issue");
    }
    if (!bom.issueQty) {
        bom.issueQty = 0;
    }
    if (!bom.inventory) {
        bom.inventory = 0;
    }
    bom.issueQty += issueAmount;
    bom.inventory -= issueAmount;
    bom.pendingQty = calculatePendingQty(bom);
    return bomsInfo;
};
exports.addData = functions
    .region("asia-northeast3")
    .https.onCall(async (body, context) => {
    var _a;
    if (!context) {
        throw new Error("Cnot");
    }
    if (!((_a = context === null || context === void 0 ? void 0 : context.auth) === null || _a === void 0 ? void 0 : _a.uid)) {
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
    const { company } = userData;
    const { department, json, createdAt, modifiedAt, enteredAt, materialIssue } = body;
    console.log("The body is", body);
    const id = generateUId("", 15);
    const entry = Object.assign(Object.assign({}, json), { createdAt, modifiedAt, id, status: "active", enteredAt });
    const doc = await admin.firestore().collection("data").doc(company).get();
    const bomDoc = await admin.firestore().collection("boms").doc(company).get();
    console.log("The doc is", doc.data());
    const companyData = doc.data();
    if (!companyData) {
        throw new Error("Company not present in the DB" + company);
    }
    const bomData = bomDoc.data();
    if (!bomData) {
        throw Error("Company Bom does not exist");
    }
    const oldDepartmentData = companyData[department];
    console.log("The oldDEparmentData is ", oldDepartmentData, companyData[department]);
    const departmentData = [entry, ...(oldDepartmentData !== null && oldDepartmentData !== void 0 ? oldDepartmentData : [])];
    const obj = {};
    const bomObj = {};
    obj[department] = departmentData;
    if (materialIssue) {
        const boms = bomData.bomsInfo;
        if (!boms) {
            throw Error("Cannot issue without BOM entry");
        }
        bomObj["bomsInfo"] = issueInventory(materialIssue, boms);
    }
    await admin.firestore().collection("data").doc(company).set(obj, { merge: true });
    await admin.firestore().collection("boms").doc(company).set(bomObj, { merge: true });
    return departmentData;
});
exports.generateCSV = functions
    .region("asia-northeast3")
    .https.onRequest(async (request, response) => {
    let { department, lineNumber, company } = request.body;
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
    const departments = [];
    const values = {};
    for (const department of data["form"]) {
        const { id, lines, process, form } = department;
        values[id] = [];
        for (const proces of process) {
            console.log("The process are", form[proces].map(({ field }) => field));
            values[id] = values[id].concat(form[proces].map(({ field }) => field));
        }
        for (const line of lines) {
            departments.push({
                id,
                lineNumber: line,
            });
        }
    }
    console.log("The departments are", departments);
    let file = "";
    if (department !== "all") {
        file = generateData(data[department], department, lineNumber, values);
    }
    else {
        file += departments.map(({ id, lineNumber }) => generateData(data[id], id, lineNumber, values));
    }
    response.attachment(`${department}:${lineNumber}.csv`);
    response.type("csv");
    response.send(file);
});
const csvDate = (date) => {
    return moment(date, "DD MMM YY, h:mm:ss a").format(Constants_1.Constants.DATE_FORMAT);
};
const sum = (values1, values2) => {
    const result = {};
    for (const key in values1) {
        result[key] = values1[key];
    }
    for (const key in values2) {
        if (result[key]) {
            result[key] += values2[key];
        }
        else {
            result[key] = values2[key];
        }
    }
    return result;
};
const mergeStyleCode = (data) => {
    const hash = {};
    for (const d of data) {
        const { createdAt, styleCode, values } = d;
        const key = styleCode + csvDate(createdAt);
        if (!hash[key]) {
            hash[key] = {
                values,
                createdAt,
                styleCode,
            };
        }
        else {
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
const generateData = (departmentData, department, line, values) => {
    console.log("The values are", values);
    if (!departmentData) {
        return "";
    }
    let filteredDepartmentData = departmentData.filter(({ lineNumber, status }) => lineNumber === line.toString() && status === "active");
    filteredDepartmentData = mergeStyleCode(filteredDepartmentData);
    const keys = values[department];
    let fileData = "";
    fileData += filteredDepartmentData.map((row) => {
        const { createdAt, styleCode, values } = row;
        let header = `${csvDate(createdAt)},${styleCode},`;
        header += keys.map((key) => values[key] || 0);
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
    var _a;
    if (!((_a = context === null || context === void 0 ? void 0 : context.auth) === null || _a === void 0 ? void 0 : _a.uid)) {
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
    const { company } = userData;
    const { department, id, json, modifiedAt, status } = data;
    const entry = Object.assign(Object.assign({}, json), { modifiedAt, status: status || "active" });
    const doc = await admin.firestore().collection("data").doc(company || DEFAULT_COMPANY).get();
    const bomDoc = await admin.firestore().collection("boms").doc(company).get();
    const companyData = doc.data();
    if (!companyData) {
        throw new Error("Data Not Present For the company" + company);
    }
    let departmentData = companyData[department] || [];
    const bomData = bomDoc.data();
    if (!bomData) {
        throw new Error("Boms Data not present");
    }
    const obj = {};
    const bomObj = {};
    let amountDiff = 0;
    if (data && data.json) {
        const oldItem = departmentData.find((i) => i.id === data.id);
        const keys = Object.keys(oldItem.values);
        if (keys[0].startsWith(".")) {
            let [materialId, materialDescription] = keys[0].split(":");
            materialId = materialId.substring(1);
            let k = `.${materialId}:${materialDescription}`;
            amountDiff = (data.status === "deleted" ? 0 : data.json.values[k]) - oldItem.values[k];
            const boms = bomData.bomsInfo;
            bomObj["bomsInfo"] = issueInventory({
                styleCode: oldItem.styleCode,
                materialIssue: [{
                        materialId,
                        materialDescription,
                        issueAmount: amountDiff
                    }]
            }, boms);
        }
    }
    departmentData = departmentData.map((item) => {
        if (item.id !== id) {
            return item;
        }
        return Object.assign(Object.assign({}, item), entry);
    });
    obj[department] = departmentData;
    await admin.firestore().collection("data").doc(company || DEFAULT_COMPANY).set(obj, { merge: true });
    await admin.firestore().collection("boms").doc(company || DEFAULT_COMPANY).set(bomObj, { merge: true });
    return departmentData;
});
exports.insertStyleCode = functions
    .region("asia-northeast3")
    .https
    .onRequest(async (request, response) => {
    const { styleCodes, company } = request.body;
    console.log("The styleCodes and company are", styleCodes, company);
    const doc = await admin.firestore().collection("data").doc(company).get();
    console.log("The doc data", doc.data());
    const docData = doc.data();
    if (!docData) {
        throw new Error();
    }
    let existingStyleCodes = docData["styleCodes"] || [];
    existingStyleCodes = existingStyleCodes.concat(styleCodes.map((styleCode) => ({
        id: styleCode.toUpperCase(),
        name: styleCode.toUpperCase(),
    })));
    console.log("The styleCodes are", existingStyleCodes);
    existingStyleCodes = existingStyleCodes.reduce((acc, current) => {
        const x = acc.find((item) => item.id === current.id);
        if (!x) {
            return acc.concat([current]);
        }
        else {
            return acc;
        }
    }, []);
    await admin.firestore().collection("data").doc(company).set({
        styleCodes: existingStyleCodes,
    }, { merge: true });
    response.send({
        styleCodes: existingStyleCodes,
    });
});
exports.getUserRole = functions
    .region("asia-northeast3")
    .https
    .onCall(async (_data, context) => {
    var _a;
    if (!((_a = context === null || context === void 0 ? void 0 : context.auth) === null || _a === void 0 ? void 0 : _a.uid)) {
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
    const { role, company } = userData;
    return {
        uid,
        role,
        company,
    };
});
exports.backUpCompany = functions
    .region("asia-northeast3")
    .https
    .onRequest(async (request, response) => {
    const { company } = request.body;
    const doc = await admin.firestore().collection("data").doc(company).get();
    const docData = doc.data();
    if (!docData) {
        throw new Error("");
    }
    const boms = await admin.firestore().collection("boms").doc(company).get();
    const bomsData = boms.data();
    if (!bomsData) {
        throw new Error("");
    }
    const purchaseMaterials = await admin.firestore().collection("purchaseMaterials").doc(company).get();
    const purchaseMaterialsData = purchaseMaterials.data();
    if (!purchaseMaterialsData) {
        throw new Error("");
    }
    const suppliers = await admin.firestore().collection("suppliers").doc(company).get();
    const suppliersData = suppliers.data();
    if (!suppliersData) {
        throw new Error("");
    }
    let backupName = company + moment().format("-DD-MMM-YY,h:mm:ss:a");
    await admin.firestore().collection("backup_data").doc(backupName).set(docData);
    await admin.firestore().collection("backup_boms").doc(backupName).set(bomsData);
    await admin.firestore().collection("backup_purchaseMaterials").doc(backupName).set(purchaseMaterialsData);
    await admin.firestore().collection("backup_suppliers").doc(backupName).set(suppliersData);
    response.send({
        "data": docData,
        "boms": bomsData,
        "purchaseMaterials": purchaseMaterialsData,
        "suppliers": suppliersData
    });
});
exports.addDepartment = functions
    .region("asia-northeast3")
    .https
    .onCall(async (data, _context) => {
    const { departments } = data;
    await admin.firestore().collection("data").doc("anusha_8923").set({
        departments,
    }, { merge: true });
});
exports.addForm = functions
    .region("asia-northeast3")
    .https
    .onRequest(async (request, response) => {
    const { company, form } = request.body;
    console.log("Adding the form to the ", company, form);
    await admin.firestore().collection("data").doc(company).set({
        form,
    }, {
        merge: true,
    });
    response.send(form);
});
const getCompany = async function (_data, context) {
    const uid = context.auth.uid;
    const user = await admin.firestore().collection("users").doc(uid).get();
    console.log("The data is ", user.data());
    const userData = user.data();
    if (!userData) {
        throw new Error("User Data is Empty");
    }
    return userData;
};
const getDepartments = (form) => {
    return form.map((department) => ({ id: department.id, process: department.process, lines: department.lines }));
};
const getAggregate = async (company) => {
    console.log("The company is", company);
    const result = {};
    const dataDoc = await admin.firestore().collection("data").doc(company).get();
    const factoryData = dataDoc.data();
    if (!factoryData) {
        return {};
    }
    const departments = getDepartments(factoryData["form"]);
    console.log("The departments are", departments);
    for (const department of departments) {
        const { id: departmentId } = department;
        for (const update of (factoryData[departmentId] || [])) {
            if (update.status !== "active") {
                continue;
            }
            const { values, lineNumber, process, styleCode } = update;
            const processKey = process.toLowerCase();
            const key = `${styleCode.toLowerCase()}-${departmentId.toLowerCase()}-${lineNumber}-${processKey}`;
            if (!result[key]) {
                result[key] = Object.assign({}, values);
            }
            else {
                const total = {};
                for (const fieldKey in values) {
                    total[fieldKey] = values[fieldKey] + (result[key][fieldKey] || 0);
                }
                result[key] = Object.assign(Object.assign({}, result[key]), total);
                console.log("The total is", total);
            }
        }
    }
    console.log("The result is", result);
    return result;
};
exports.dataInsights = functions
    .region("asia-northeast3")
    .https
    .onCall(async (data, context) => {
    var _a;
    if (!((_a = context === null || context === void 0 ? void 0 : context.auth) === null || _a === void 0 ? void 0 : _a.uid)) {
        return {
            message: "Not allowed",
        };
    }
    const { company } = await getCompany(data, context);
    return getAggregate(company || "test");
});
const calculatePendingQty = (item) => {
    const { reqQty, inventory, activeOrdersQty, issueQty } = item;
    return parseFloat(((reqQty || 0) - (inventory || 0) - (activeOrdersQty || 0) - (issueQty || 0)).toFixed(2));
};
const getMaterialStatus = (styleCode, boms, category) => {
    let materials = boms.filter((bom) => bom.styleCode === styleCode);
    if (category) {
        materials = materials.filter((bom) => bom.category === category);
    }
    if (materials.length === 0) {
        return MaterialStatus.NO_BOM;
    }
    const allIn = materials.every((item) => { var _a, _b; return (((_a = item.inventory) !== null && _a !== void 0 ? _a : 0) + ((_b = item.issueQty) !== null && _b !== void 0 ? _b : 0)) >= item.reqQty; });
    if (allIn) {
        return MaterialStatus.ALL_IN;
    }
    const fullyOrdered = materials.filter((item) => calculatePendingQty(item) > 0).every((item) => { var _a; return (((_a = item.activeOrdersQty) !== null && _a !== void 0 ? _a : 0) > 0) && (((item.activeOrdersQty || 0) + (item.inventory || 0) + (item.issueQty || 0)) >= item.reqQty); });
    if (fullyOrdered) {
        return MaterialStatus.FULLY_ORDERED;
    }
    const partialOrdered = materials.some((item) => { var _a; return ((_a = item.activeOrdersQty) !== null && _a !== void 0 ? _a : 0) > 0; });
    if (partialOrdered) {
        return MaterialStatus.PART_ORDERED;
    }
    const noOrder = materials.every((item) => { var _a; return ((_a = item.activeOrdersQty) !== null && _a !== void 0 ? _a : 0) <= 0; });
    if (noOrder) {
        return MaterialStatus.NOT_ORDERED;
    }
    return MaterialStatus.UNKNOWN;
};
const addMaterialStatusToStyleCode = (styleCodesInfo, bomsInfo) => {
    let updatedStyleCodes = styleCodesInfo.map((styleCode) => (Object.assign(Object.assign({}, styleCode), { materialStatus: getMaterialStatus(styleCode.styleCode, bomsInfo), status: {
            FABRIC: getMaterialStatus(styleCode.styleCode, bomsInfo, "FABRIC"),
            TRIM: getMaterialStatus(styleCode.styleCode, bomsInfo, "TRIM"),
            LABEL: getMaterialStatus(styleCode.styleCode, bomsInfo, "LABEL"),
            PACKAGING: getMaterialStatus(styleCode.styleCode, bomsInfo, "PACKAGING"),
        } })));
    return updatedStyleCodes;
};
const mapGRNsToList = (grns) => {
    let grnList = [];
    for (let grn of grns) {
        if (grn.status === Constants_1.GRN_STATUS.CANCELED)
            continue;
        grnList = grnList.concat(grn.GRN.map(item => (Object.assign(Object.assign({}, item), { id: item.id.toUpperCase(), docUrl: grn.grnDocUrl, poId: grn.poId }))));
    }
    return grnList;
};
const mapGRNstoInwardMaterial = (grnsList) => {
    let grnItem = [];
    for (let grns of grnsList) {
        if (grns.status !== "active")
            continue;
        for (let grn of grns.GRN) {
            if (grn.status !== "active")
                continue;
            grnItem = grnItem.concat(grn.lineItems.map(item => (Object.assign(Object.assign({}, item), { grnId: grn.id }))));
        }
    }
    return grnItem;
};
exports.getData = functions
    .region("asia-northeast3")
    .https
    .onCall(async (data, context) => {
    var _a, _b, _c, _d, _e;
    if (!((_a = context === null || context === void 0 ? void 0 : context.auth) === null || _a === void 0 ? void 0 : _a.uid)) {
        return {
            message: "Not allowed",
        };
    }
    const { company } = await getCompany(data, context);
    console.log("The company is", company);
    const companyDoc = await admin.firestore().collection("data").doc(company).get();
    const suppliersDoc = await admin.firestore().collection("suppliers").doc(company).get();
    const purchaseMaterialsDoc = await admin.firestore().collection("purchaseMaterials").doc(company).get();
    const companyData = companyDoc.data();
    const suppliersData = suppliersDoc.data();
    console.log("The getData result is", companyData);
    if (!companyData) {
        throw Error("The company does not exist " + company);
    }
    const grnsInfo = (_b = companyData.GRNsInfo) !== null && _b !== void 0 ? _b : [];
    let styleCodesInfo = ((_c = companyData.styleCodesInfo) !== null && _c !== void 0 ? _c : []).sort((a, b) => moment(a.deliveryDate).valueOf() - moment(b.deliveryDate).valueOf());
    ;
    styleCodesInfo = styleCodesInfo;
    const bomsDoc = await admin.firestore().collection("boms").doc(company).get();
    const bomsData = bomsDoc.data();
    if (!bomsData) {
        throw Error("Boms Data not Present");
    }
    const bomsInfo = (_d = bomsData.bomsInfo) !== null && _d !== void 0 ? _d : [];
    const purchaseMaterialsData = purchaseMaterialsDoc.data();
    if (!purchaseMaterialsData) {
        throw Error("Purchase Material Data not Present");
    }
    const purchaseMaterialsInfo = (_e = purchaseMaterialsData.purchaseMaterialsInfo) !== null && _e !== void 0 ? _e : [];
    styleCodesInfo = addMaterialStatusToStyleCode(styleCodesInfo, bomsInfo);
    return Object.assign(Object.assign(Object.assign({}, companyData), suppliersData), { bomsInfo, styleCodesInfo: styleCodesInfo, purchaseMaterialsInfo, GRNsInfo: mapGRNsToList(grnsInfo), inwardMaterial: mapGRNstoInwardMaterial(grnsInfo) });
});
exports.addMetaRole = functions
    .region("asia-northeast3")
    .https
    .onRequest(async (request, response) => {
    const { company, roles } = request.body;
    console.log("The company and roles are ", company, roles);
    const obj = {};
    for (const role of roles) {
        const { phoneNumber, departments } = role;
        obj["+91" + phoneNumber] = {
            company,
            role: departments.map((department) => ({
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
exports.styleCodesInfo = functions
    .region("asia-northeast3")
    .https
    .onCall(async (data, context) => {
    const { company } = await getCompany(data, context);
    const dataDoc = await admin.firestore().collection("data").doc(company).get();
    const companyInfo = dataDoc.data();
    if (!companyInfo) {
        throw new Error("Company Info is undefined");
    }
    const { styleCodesInfo } = companyInfo;
    return styleCodesInfo || [];
});
const insertStyleCodeSchema = Joi.object({
    company: Joi.string().required(),
    styleCodes: Joi.array().items({
        id: Joi.string(),
        styleCode: Joi.string().required(),
        brand: Joi.string().required(),
        product: Joi.string().required(),
        orderNo: Joi.string().default(""),
        confirmDate: Joi.string().default((0, util_1.getCurrentDate)()),
        orderQty: Joi.number().required(),
        makeQty: Joi.number(),
        deliveryDate: Joi.string().default((0, util_1.getCurrentDate)()),
        styleCodeStatus: Joi.string().default("active"),
    }).options({ allowUnknown: true }).strict(false),
})
    .unknown(true);
exports.upsertStyleCodesInfo = (0, functions_1.onCall)({
    name: "upsertyStyleCodesInfo",
    schema: insertStyleCodeSchema,
    handler: async (data, context) => {
        const { company, styleCodes } = data;
        try {
            const dataRef = admin.firestore().collection("data").doc(company);
            const bomsRef = admin.firestore().collection("boms").doc(company);
            const purchaseMaterialsRef = admin.firestore().collection("purchaseMaterials").doc(company);
            return await admin.firestore().runTransaction(async (db) => {
                var _a, _b, _c, _d;
                const doc = await db.get(dataRef);
                const docData = doc.data();
                if (!docData) {
                    throw Error("The company does not exist" + company);
                }
                const styleCodesInfo = (_a = docData.styleCodesInfo) !== null && _a !== void 0 ? _a : [];
                const bomsDoc = await db.get(bomsRef);
                const bomData = bomsDoc.data();
                if (!bomData) {
                    throw Error("The Boms Data does not exist");
                }
                const purchaseMaterialsDoc = await db.get(purchaseMaterialsRef);
                const purchaseMaterialsData = purchaseMaterialsDoc.data();
                if (!purchaseMaterialsData) {
                    throw Error("Purchase Material data does not exist");
                }
                const bomsInfo = (_b = bomData.bomsInfo) !== null && _b !== void 0 ? _b : [];
                const inventoryInfo = (_c = docData.inventoryInfo) !== null && _c !== void 0 ? _c : [];
                const purchaseMaterialsInfo = (_d = purchaseMaterialsData.purchaseMaterialsInfo) !== null && _d !== void 0 ? _d : [];
                let output = upsertItemsInArray(styleCodesInfo, styleCodes, (oldItem, newItem) => oldItem.styleCode === newItem.styleCode, (oldItem, newItem) => (Object.assign(Object.assign(Object.assign({}, oldItem), newItem), { confirmDate: (0, util_1.getDateFormat)(newItem.confirmDate || oldItem.confirmDate), deliveryDate: (0, util_1.getDateFormat)(newItem.deliveryDate || oldItem.deliveryDate) })));
                output = output.map(item => (Object.assign(Object.assign({}, item), { confirmDate: (0, util_1.getDateFormat)(item.confirmDate), deliveryDate: (0, util_1.getDateFormat)(item.deliveryDate) })));
                const result = updateBomsInfoFromStyleCodes(output, bomsInfo, [...bomsInfo], inventoryInfo, purchaseMaterialsInfo);
                let newStyleCodesInfo = addMaterialStatusToStyleCode(output, result.bomsInfo);
                newStyleCodesInfo = newStyleCodesInfo.sort((a, b) => moment(a.deliveryDate).valueOf() - moment(b.deliveryDate).valueOf());
                ;
                const sortedBom = result.bomsInfo.sort((a, b) => {
                    if (a.styleCode === b.styleCode) {
                        if (a.category === b.category)
                            return a.type.localeCompare(b.type);
                        else {
                            return a.category.localeCompare(b.category);
                        }
                    }
                    else {
                        return a.styleCode.localeCompare(b.styleCode);
                    }
                });
                let promises = [];
                promises.push(db.set(dataRef, {
                    styleCodesInfo: newStyleCodesInfo,
                    inventoryInfo: result.inventoryInfo,
                }, {
                    merge: true,
                }));
                promises.push(db.set(bomsRef, {
                    bomsInfo: sortedBom
                }, {
                    merge: true
                }));
                promises.push(db.set(purchaseMaterialsRef, {
                    purchaseMaterialsInfo: result.purchaseMaterialsInfo
                }, {
                    merge: true
                }));
                await Promise.all(promises);
                return {
                    company,
                    styleCodesInfo: newStyleCodesInfo,
                    bomsInfo: sortedBom,
                    inventoryInfo: result.inventoryInfo,
                    purchaseMaterialsInfo: result.purchaseMaterialsInfo
                };
            });
        }
        catch (e) {
            console.log(e);
            throw Error("Failed To Run Transaction" + e);
        }
    },
});
const upsertBOMSchema = Joi.object({
    company: Joi.string().required(),
    boms: Joi.array().items({
        styleCode: Joi.string().required(),
        category: Joi.string().valid("FABRIC", "TRIM", "LABEL", "PACKAGING").required(),
        type: Joi.string().required(),
        materialId: Joi.string().required(),
        materialDescription: Joi.string().required(),
        consumption: Joi.number().required(),
        wastage: Joi.number().required(),
        unit: Joi.string().required(),
        placement: Joi.string().required(),
    }).options({ allowUnknown: true }),
})
    .strict(false)
    .unknown(true);
const join = (a, b, cmp) => {
    let output = [];
    output = a.map((item) => (Object.assign(Object.assign({}, item), b.find((bitem) => cmp(item, bitem)))));
    return output;
};
const updateBomsInfoFromStyleCodes = (styleCodes, oldboms, newboms, inventory, purchaseMaterials) => {
    const bomJoinedStyleCode = join(newboms, styleCodes, (a, b) => a.styleCode === b.styleCode);
    const mappedBOMDTO = bomJoinedStyleCode.map((bom) => {
        if (bom.makeQty === undefined)
            throw Error(`The StyleCode ${bom.styleCode} does not exist`);
        return {
            styleCode: bom.styleCode,
            category: bom.category,
            type: bom.type,
            materialId: bom.materialId,
            materialDescription: bom.materialDescription,
            consumption: bom.consumption,
            wastage: bom.wastage,
            unit: bom.unit,
            placement: bom.placement,
            id: generateUId("BOM", 8),
            reqQty: Math.ceil(bom.makeQty * bom.consumption * (1 + bom.wastage / 100)),
        };
    });
    const output = upsertItemsInArray(oldboms, mappedBOMDTO, (oldItem, newItem) => (oldItem.materialId + oldItem.materialDescription) === (newItem.materialId + newItem.materialDescription) &&
        oldItem.styleCode === newItem.styleCode, {
        issueQty: 0,
        inventory: 0,
        activeOrdersQty: 0,
    }, (a, b) => (Object.assign(Object.assign(Object.assign({}, a), b), { pendingQty: calculatePendingQty(b) })));
    const p = distributeInventory(styleCodes, output, inventory);
    const newPurchaseMaterials = populatePurhcaseMaterialsFromBOM(p.bomsInfo, purchaseMaterials);
    return {
        bomsInfo: p.bomsInfo,
        purchaseMaterialsInfo: newPurchaseMaterials,
        inventoryInfo: p.inventoryInfo
    };
};
exports.upsertBOMInfo = (0, functions_1.onCall)({
    name: "upsertBOMInfo",
    schema: upsertBOMSchema,
    handler: async (data, context) => {
        console.log("The data is", data);
        const { company, boms } = data;
        try {
            const dataRef = admin.firestore().collection("data").doc(company);
            const bomsRef = admin.firestore().collection("boms").doc(company);
            const purchaseMaterialsRef = admin.firestore().collection("purchaseMaterials").doc(company);
            return await admin.firestore().runTransaction(async (db) => {
                var _a, _b, _c;
                const doc = await db.get(dataRef);
                const docData = doc.data();
                if (!docData) {
                    throw Error("The company does not exist" + company);
                }
                const styleCodesInfo = docData.styleCodesInfo;
                if (!styleCodesInfo) {
                    throw Error("StyleCodes Not Present");
                }
                const bomsDoc = await db.get(bomsRef);
                const bomData = bomsDoc.data();
                if (!bomData) {
                    throw Error("Boms Data Not present");
                }
                const bomsInfo = (_a = bomData.bomsInfo) !== null && _a !== void 0 ? _a : [];
                const purchaseMaterialsDoc = await db.get(purchaseMaterialsRef);
                const purchaseMaterialsData = purchaseMaterialsDoc.data();
                if (!purchaseMaterialsData) {
                    throw Error("Purchase Material data does not exist");
                }
                const oldPurchaseMaterials = (_b = purchaseMaterialsData.purchaseMaterialsInfo) !== null && _b !== void 0 ? _b : [];
                const inventory = (_c = docData.inventoryInfo) !== null && _c !== void 0 ? _c : [];
                for (let bom of boms) {
                    if (!styleCodesInfo.find(item => item.styleCode === bom.styleCode)) {
                        throw Error(`The StyleCode ${bom.styleCode} does not exist`);
                    }
                }
                const result = updateBomsInfoFromStyleCodes(styleCodesInfo, bomsInfo, boms, inventory, oldPurchaseMaterials);
                const sortedBom = result.bomsInfo.sort((a, b) => {
                    if (a.styleCode === b.styleCode) {
                        if (a.category === b.category)
                            return a.type.localeCompare(b.type);
                        else {
                            return a.category.localeCompare(b.category);
                        }
                    }
                    else {
                        return a.styleCode.localeCompare(b.styleCode);
                    }
                });
                await db.set(dataRef, {
                    inventoryInfo: result.inventoryInfo,
                }, {
                    merge: true,
                });
                await db.set(bomsRef, {
                    bomsInfo: sortedBom
                }, {
                    merge: true
                });
                await db.set(purchaseMaterialsRef, {
                    purchaseMaterialsInfo: result.purchaseMaterialsInfo,
                }, {
                    merge: true
                });
                return {
                    company,
                    bomsInfo: sortedBom,
                    purchaseMaterialsInfo: result.bomsInfo,
                };
            });
        }
        catch (e) {
            console.log(e);
            throw Error("Failed To Run Transaction" + e);
        }
    },
});
const defaultPurchaseMaterials = {
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
    deliveryDate: (0, util_1.getCurrentDate)(),
};
const populatePurhcaseMaterialsFromBOM = (boms, purchaseMaterials) => {
    const mp = {};
    for (const bom of boms) {
        const key = bom.materialId + "|" + bom.materialDescription;
        if (mp[key]) {
            mp[key] = Object.assign(Object.assign(Object.assign({}, mp[key]), bom), { pendingQty: bom.pendingQty + parseFloat(mp[key].pendingQty) });
            mp[key].pendingQty = parseFloat(mp[key].pendingQty).toFixed(2);
        }
        else {
            mp[key] = Object.assign({}, bom);
        }
    }
    const mergedBoms = [];
    for (const key in mp) {
        mergedBoms.push(Object.assign({}, mp[key]));
    }
    const mapMergedBomsToPurchaseMaterial = mergedBoms.map((item) => ({
        id: generateUId("PM", 8),
        styleCode: item.styleCode,
        category: item.category,
        type: item.type,
        materialId: item.materialId,
        materialDescription: item.materialDescription,
        unit: item.unit,
        pendingQty: Math.ceil(item.pendingQty) || 0,
        purchaseQty: 0,
        rate: 0,
        discount: 0,
        preTaxAmount: 0,
        tax: 0,
        taxAmount: 0,
        totalAmount: 0,
        supplier: "",
        deliveryDate: (0, util_1.getCurrentDate)(),
    }));
    const purchaseMaterialsInfo = upsertItemsInArray(purchaseMaterials, mapMergedBomsToPurchaseMaterial, (a, b) => a.materialId === b.materialId && a.materialDescription === b.materialDescription, {
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
    });
    return purchaseMaterialsInfo;
};
const upsertPurchaseMaterialsSchema = Joi.object({
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
        supplier: Joi.string().optional().allow(''),
        deliveryDate: Joi.string(),
    }).options({ stripUnknown: true }).strict(false),
})
    .unknown(false);
exports.upsertPurchaseMaterialsInfo = (0, functions_1.onCall)({
    name: "upsertPurchaseMaterialsInfo",
    schema: upsertPurchaseMaterialsSchema,
    handler: async (data, context) => {
        var _a;
        console.log("The data is", data);
        const { company, purchaseMaterials } = data;
        const doc = await admin.firestore().collection("purchaseMaterials").doc(company).get();
        const docData = doc.data();
        if (!docData) {
            throw Error("The company does not exist" + company);
        }
        const purchaseMaterialsInfo = (_a = docData.purchaseMaterialsInfo) !== null && _a !== void 0 ? _a : [];
        const output = upsertItemsInArray(purchaseMaterialsInfo, purchaseMaterials, (oldItem, newItem) => (oldItem.materialId + oldItem.materialDescription) === (newItem.materialId + newItem.materialDescription) && oldItem.styleCode === newItem.styleCode, defaultPurchaseMaterials);
        await admin.firestore().collection("purchaseMaterials").doc(company).set({
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
const upsertPurchaseOrdersInfoSchema = Joi.object({
    company: Joi.string().required(),
    purchaseOrders: Joi.array().items({
        id: Joi.string().required(),
        lineItems: Joi.array().items({
            id: Joi.string().required(),
            category: Joi.string().required(),
            unit: Joi.string().required(),
            type: Joi.string().required(),
            materialId: Joi.string().required(),
            materialDescription: Joi.required().required(),
            purchaseQty: Joi.number().required(),
            rate: Joi.number().required(),
            discount: Joi.number().required(),
            preTaxAmount: Joi.number().required(),
            tax: Joi.number().required(),
            taxAmount: Joi.number().required(),
            totalAmount: Joi.number().required(),
            supplier: Joi.string().required(),
            deliveryDate: Joi.string().required(),
            referenceId: Joi.string().required(),
            status: Joi.string().required(),
            sno: Joi.number().required(),
        }).options({ allowUnknown: true }),
        fileUrl: Joi.string().required(),
        amount: Joi.number().required(),
        status: Joi.string().required(),
        supplier: Joi.string().required(),
        createdAt: Joi.string().required(),
        deliveryDate: Joi.string().required()
    }).options({ allowUnknown: true }),
})
    .unknown(true);
exports.upsertPurchaseOrdersInfo = (0, functions_1.onCall)({
    name: "upsertPurchaseOrdersInfo",
    schema: upsertPurchaseOrdersInfoSchema,
    handler: async (data, context) => {
        var _a;
        console.log("The data is", data);
        const { company, purchaseOrders } = data;
        const doc = await admin.firestore().collection("data").doc(company).get();
        const docData = doc.data();
        if (!docData) {
            throw Error("The company does not exist" + company);
        }
        const purchaseOrdersInfo = (_a = docData.purchaseOrdersInfo) !== null && _a !== void 0 ? _a : [];
        const output = upsertItemsInArray(purchaseOrdersInfo, purchaseOrders, (oldItem, newItem) => oldItem.purchaseOrderId === newItem.purchaseOrderId);
        return await admin.firestore().collection("data").doc(company).set({
            purchaseOrdersInfo: output,
        }, {
            merge: true,
        });
    },
});
;
const collectInventoryFromStyleCodes = (boms, inventories) => {
    var _a, _b, _c, _d;
    const mp = {};
    for (const bom of boms) {
        const key = bom.materialId + "|" + bom.materialDescription;
        if (mp[key]) {
            mp[key].inventory += (_a = bom.inventory) !== null && _a !== void 0 ? _a : 0;
            mp[key].activeOrdersQty += (_b = bom.activeOrdersQty) !== null && _b !== void 0 ? _b : 0;
        }
        else {
            mp[key] = {
                inventory: (_c = bom.inventory) !== null && _c !== void 0 ? _c : 0,
                activeOrdersQty: (_d = bom.activeOrdersQty) !== null && _d !== void 0 ? _d : 0,
            };
        }
        bom.inventory = 0;
        bom.activeOrdersQty = 0;
        bom.pendingQty = calculatePendingQty(bom);
    }
    for (const inventory of inventories) {
        const key = inventory.materialId + "|" + inventory.materialDescription;
        if (mp[key]) {
            inventory.inventory += mp[key].inventory;
            inventory.activeOrdersQty += mp[key].activeOrdersQty;
            inventory.inventory = parseFloat(inventory.inventory.toFixed(2));
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
        inventories.push(Object.assign(Object.assign({ materialId,
            materialDescription }, mp[key]), { issue: 0 }));
    }
    return {
        boms,
        inventory: inventories,
    };
};
const distributeInventory = (styleCodesInfo, allBoms, inventory) => {
    const activeStyleCodes = styleCodesInfo.filter((item) => item.styleCodeStatus === "active");
    activeStyleCodes.sort((a, b) => moment(a.deliveryDate).valueOf() - moment(b.deliveryDate).valueOf());
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
    assignInventoryToBOM(activeStyleCodes, allBoms, inventory);
    return {
        bomsInfo: allBoms,
        inventoryInfo: inventory,
    };
};
const assignInventoryToBOM = (activeStyleCodes, boms, inventory) => {
    for (const activeStyleCode of activeStyleCodes) {
        for (let bom of boms) {
            bom = bom;
            if (bom.styleCode !== activeStyleCode.styleCode) {
                continue;
            }
            assignInventoryToBOMItem(bom, inventory);
        }
    }
    return {
        boms,
        inventory
    };
};
const assignInventoryToBOMItem = (bom, inventory) => {
    var _a;
    const inventoryNeed = Math.max(bom.reqQty - ((_a = bom.issueQty) !== null && _a !== void 0 ? _a : 0), 0);
    const globalInventory = inventory.find((item) => item.materialId === bom.materialId && item.materialDescription === bom.materialDescription);
    if (!globalInventory) {
        bom.inventory = 0;
        bom.activeOrdersQty = 0;
        return;
    }
    bom.inventory = parseFloat(Math.min(inventoryNeed, globalInventory.inventory).toFixed(2));
    globalInventory.inventory -= bom.inventory;
    if (bom.inventory < inventoryNeed) {
        bom.activeOrdersQty = Math.min(globalInventory.activeOrdersQty, inventoryNeed - bom.inventory);
        globalInventory.activeOrdersQty -= bom.activeOrdersQty;
    }
    bom.pendingQty = calculatePendingQty(bom);
};
exports.actions = functions
    .region("asia-northeast3")
    .https
    .onCall(async (data, context) => {
    const { company } = await getCompany(data, context);
    const { type, item } = data;
    console.log("The company, type and item are", company, type, item);
    const dataDoc = await admin.firestore().collection("data").doc(company).get();
    const companyInfo = dataDoc.data();
    if (!companyInfo) {
        throw new Error("Company Info is undefined");
    }
    const output = {};
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
    await admin.firestore().collection("data").doc(company).set(output, { merge: true });
    console.log("The output is", output);
    return output;
});
const upsertItemsInArray = (items, newItems, cmp = (a, b) => a.id === b.id, obj, mergeObj) => {
    let output = [...items];
    for (const newItem of newItems) {
        output = upsertItemInArray(output, newItem, cmp, obj, mergeObj);
    }
    return output;
};
const upsertItemInArray = (items, newItem, cmp = (a, b) => a.id === b.id, defaultObj, mergeObj = (a, b) => (Object.assign(Object.assign({}, a), b))) => {
    let output = [];
    let inserted = false;
    for (const item of items) {
        if (cmp(item, newItem)) {
            inserted = true;
            output.push(mergeObj(item, newItem));
        }
        else {
            output.push(item);
        }
    }
    if (!inserted) {
        output = [Object.assign(Object.assign({ id: generateUId("", 8) }, defaultObj), newItem), ...output];
    }
    return output;
};
exports.updateStyleCodesInfo = functions
    .region("asia-northeast3")
    .https
    .onCall(async (data, context) => {
    var _a;
    const { company } = await getCompany(data, context);
    const { styleCodeInfo } = data;
    console.log("The company is", company);
    const dataDoc = await admin.firestore().collection("data").doc(company).get();
    const companyInfo = dataDoc.data();
    const styleCodesInfo = (_a = companyInfo === null || companyInfo === void 0 ? void 0 : companyInfo.styleCodesInfo) !== null && _a !== void 0 ? _a : [];
    const obj = [];
    for (const info of styleCodesInfo) {
        if (info.id === (styleCodeInfo === null || styleCodeInfo === void 0 ? void 0 : styleCodeInfo.id)) {
            obj.push(Object.assign(Object.assign({}, info), styleCodeInfo));
        }
        else {
            obj.push(info);
        }
    }
    console.log("The updatedStyleCodesInfo are", obj);
    await admin.firestore().collection("data").doc(company || DEFAULT_COMPANY).set({
        styleCodesInfo: obj,
    }, { merge: true });
    return obj;
});
const UpdatePurchaseOrderStatusSchema = Joi.object({
    ids: Joi.array().unique(),
    status: Joi.string().valid("active").required(),
    company: Joi.string()
});
exports.updatePOStatus = (0, functions_1.onCall)({
    name: "updatePOStatus",
    schema: UpdatePurchaseOrderStatusSchema,
    handler: async (data, context) => {
        const { company, ids, status } = data;
        const dataRef = admin.firestore().collection("data").doc(company);
        const bomRef = admin.firestore().collection("boms").doc(company);
        const purchaseMaterialsRef = admin.firestore().collection("purchaseMaterials").doc(company);
        return await admin.firestore().runTransaction(async (db) => {
            var _a, _b, _c;
            const doc = await db.get(dataRef);
            const docData = doc.data();
            if (!docData) {
                throw Error("The Company Info does not exist");
            }
            const inventoryInfo = docData === null || docData === void 0 ? void 0 : docData.inventoryInfo;
            const purchaseMaterialsDoc = await db.get(purchaseMaterialsRef);
            const purchaseMaterialsData = purchaseMaterialsDoc.data();
            if (!purchaseMaterialsData) {
                throw Error("Purchase Material data does not exist");
            }
            const bomDoc = await db.get(bomRef);
            const bomData = bomDoc.data();
            if (!bomData) {
                throw Error("Bom Does not exist");
            }
            const bomsInfo = (_a = bomData.bomsInfo) !== null && _a !== void 0 ? _a : [];
            const styleCodesInfo = (_b = docData.styleCodesInfo) !== null && _b !== void 0 ? _b : [];
            const purchaseMaterialsInfo = (_c = purchaseMaterialsData.purchaseMaterialsInfo) !== null && _c !== void 0 ? _c : [];
            const result = collectInventoryFromStyleCodes(bomsInfo, inventoryInfo);
            let collectedInventory = result === null || result === void 0 ? void 0 : result.inventory;
            if (!collectedInventory) {
                throw Error("Inventory Collection Failed");
            }
            const purchaseOrders = docData.purchaseOrdersInfo || [];
            const grnsInfo = (docData === null || docData === void 0 ? void 0 : docData.GRNsInfo) || [];
            for (let purchaseOrder of purchaseOrders) {
                if (ids.find(id => purchaseOrder.id === id)) {
                    if (purchaseOrder.status === Constants_1.PURCHASE_ORDER_STATUS.ACTIVE || purchaseOrder.status === Constants_1.PURCHASE_ORDER_STATUS.GRN_STARTED) {
                        throw Error("PO is already in Active state");
                    }
                    if (purchaseOrder.status === Constants_1.PURCHASE_ORDER_STATUS.CANCELED) {
                        throw Error("GRN can not be opened for a canceled PO");
                    }
                    if (purchaseOrder.status !== Constants_1.PURCHASE_ORDER_STATUS.GRN_DONE) {
                        throw Error("GRN can only be opened was it is done");
                    }
                    purchaseOrder.status = status.toLowerCase();
                    for (let grn of grnsInfo) {
                        if (ids.find(id => grn.poId === id)) {
                            grn.status = Constants_1.PURCHASE_ORDER_STATUS.GRN_STARTED;
                            let grnID = generateUId("GRN", 8);
                            let mpLineItemsToRemainingQty = {};
                            for (let x of grn.GRN) {
                                for (let item of x.lineItems) {
                                    const key = (0, util_1.generateKey)(item.materialId, item.materialDescription);
                                    mpLineItemsToRemainingQty[key] = item.receivedQty + (mpLineItemsToRemainingQty[key] || 0);
                                }
                            }
                            const inventory = purchaseOrder.lineItems.map((output) => ({
                                materialId: output.materialId,
                                materialDescription: output.materialDescription,
                                activeOrdersQty: Math.max(0, Math.ceil(output.purchaseQty - (mpLineItemsToRemainingQty[(0, util_1.generateKey)(output.materialId, output.materialDescription)] || 0))),
                            }));
                            collectedInventory = upsertItemsInArray(collectedInventory, inventory, (oldItem, newItem) => oldItem.materialId === newItem.materialId &&
                                oldItem.materialDescription === newItem.materialDescription, undefined, (oldItem, newItem) => (Object.assign(Object.assign(Object.assign({}, oldItem), newItem), { activeOrdersQty: oldItem.activeOrdersQty + newItem.activeOrdersQty })));
                            grn.GRN.splice(0, 0, {
                                id: grnID,
                                lineItems: purchaseOrder.lineItems.map((item) => ({
                                    id: generateUId("GRN-ITEM", 6),
                                    grnId: grnID,
                                    purchaseOrderId: purchaseOrder.id,
                                    category: item.category,
                                    type: item.type,
                                    materialId: item.materialId,
                                    materialDescription: item.materialDescription,
                                    unit: item.unit,
                                    purchaseQty: Math.max(0, Math.ceil(item.purchaseQty - (mpLineItemsToRemainingQty[(0, util_1.generateKey)(item.materialId, item.materialDescription)] || 0))),
                                    receivedQty: 0,
                                    status: Constants_1.GRN_STATUS.ACTIVE,
                                    receivedDate: (0, util_1.getCurrentDate)(),
                                    rejectedQty: 0,
                                    rejectedReason: "",
                                    acceptedQty: 0,
                                })),
                                updatedAt: (0, util_1.getCurrentDate)(),
                                createdAt: (0, util_1.getCurrentDate)(),
                                status: Constants_1.GRN_STATUS.ACTIVE,
                                supplier: purchaseOrder.supplier,
                                itemsCount: purchaseOrder.lineItems.length,
                                amount: purchaseOrder.amount,
                                lrNo: "",
                                dcNo: "",
                                invoiceNo: "",
                                trans: ""
                            });
                        }
                    }
                }
            }
            const p = distributeInventory(styleCodesInfo, result.boms, collectedInventory);
            const newPurchaseMaterialInfo = populatePurhcaseMaterialsFromBOM(p.bomsInfo, purchaseMaterialsInfo);
            await db.set(dataRef, {
                GRNsInfo: grnsInfo,
                purchaseOrdersInfo: purchaseOrders
            }, {
                merge: true
            });
            await db.set(bomRef, {
                bomsInfo: p.bomsInfo
            }, {
                merge: true
            });
            await db.set(purchaseMaterialsRef, {
                purchaseMaterialsInfo: newPurchaseMaterialInfo,
            }, {
                merge: true
            });
            return {
                GRNsInfo: mapGRNsToList(grnsInfo),
                purchaseOrdersInfo: purchaseOrders,
                purchaseMaterialsInfo: newPurchaseMaterialInfo,
                bomsInfo: p.bomsInfo
            };
        });
    }
});
const inventorySchema = Joi.object({
    company: Joi.string()
});
exports.inventoryAPI = (0, functions_1.onCall)({
    name: "inventoryAPI",
    schema: inventorySchema,
    handler: async (data, context) => {
        var _a, _b, _c;
        const { company } = data;
        const doc = await admin.firestore().collection("data").doc(company).get();
        const docData = doc.data();
        if (!docData) {
            throw Error("Document is not present for company");
        }
        const purchaseOrders = ((_a = docData.purchaseOrdersInfo) !== null && _a !== void 0 ? _a : []).filter((po) => po.status !== Constants_1.PURCHASE_ORDER_STATUS.CANCELED);
        const inventoryHash = {};
        for (let purchaseOrder of purchaseOrders) {
            for (let lineItem of purchaseOrder.lineItems) {
                let key = (0, util_1.generateKey)(lineItem.materialId, lineItem.materialDescription);
                if (!inventoryHash[key]) {
                    inventoryHash[key] = {
                        id: lineItem.materialId,
                        description: lineItem.materialDescription,
                        unit: lineItem.unit,
                        category: lineItem.category,
                        type: lineItem.type,
                        storeQty: 0,
                        reqQty: 0,
                        issuedQty: 0,
                        grnAcceptedQty: 0,
                        pos: [],
                        issues: []
                    };
                }
                inventoryHash[key].pos.push({
                    id: purchaseOrder.id,
                    orderQty: lineItem.purchaseQty,
                    supplier: purchaseOrder.supplier,
                    price: lineItem.totalAmount,
                    createdAt: purchaseOrder.createdAt,
                    grns: []
                });
            }
        }
        const grns = ((_b = docData.GRNsInfo) !== null && _b !== void 0 ? _b : []).filter((grn) => grn.status === Constants_1.GRN_STATUS.ACTIVE);
        for (let grn of grns) {
            const { poId } = grn;
            for (let individualGRN of grn.GRN) {
                for (let lineItem of individualGRN.lineItems) {
                    const { materialId, materialDescription } = lineItem;
                    const key = (0, util_1.generateKey)(materialId, materialDescription);
                    let inventoryResult = inventoryHash[key];
                    if (!inventoryResult) {
                        throw Error("Something Inward without PO");
                    }
                    inventoryResult.grnAcceptedQty += lineItem.acceptedQty;
                    let po = inventoryResult.pos.find(item => item.id === poId);
                    if (!po) {
                        throw Error("Inward Happended Without PO");
                    }
                    po.grns.push({
                        id: individualGRN.id,
                        status: individualGRN.status,
                        date: individualGRN.createdAt,
                        acceptedQty: lineItem.acceptedQty,
                        receivedQty: lineItem.receivedQty,
                        rejectedQty: lineItem.rejectedQty
                    });
                }
            }
        }
        const stores = docData.store || [];
        for (let store of stores) {
            const { values, createdAt } = store;
            let keys = Object.keys(values);
            for (let key of keys) {
                let { materialId, materialDescription } = (0, util_1.parseIdAndDescription)(key);
                let materialKey = (0, util_1.generateKey)(materialId, materialDescription);
                if (!inventoryHash[materialKey]) {
                    inventoryHash[materialKey] = {
                        id: materialId,
                        description: materialDescription,
                        unit: "",
                        category: "",
                        type: "",
                        storeQty: 0,
                        reqQty: 0,
                        issuedQty: 0,
                        grnAcceptedQty: 0,
                        pos: [],
                        issues: []
                    };
                }
                inventoryHash[materialKey].issuedQty += values[key];
                inventoryHash[materialKey].issues.push({
                    qty: values[key],
                    date: createdAt
                });
            }
        }
        const inventoryItems = docData.inventoryInfo || [];
        for (let inventoryItem of inventoryItems) {
            let key = (0, util_1.generateKey)(inventoryItem.materialId, inventoryItem.materialDescription);
            if (!inventoryHash[key]) {
                inventoryHash[key] = {
                    id: inventoryItem.materialId,
                    description: inventoryItem.materialDescription,
                    unit: "",
                    reqQty: 0,
                    category: "",
                    type: "",
                    storeQty: 0,
                    issuedQty: 0,
                    grnAcceptedQty: 0,
                    pos: [],
                    issues: []
                };
            }
            inventoryHash[key].storeQty = inventoryItem.inventory;
        }
        const bomsDoc = await admin.firestore().collection("boms").doc(company).get();
        const bomData = bomsDoc.data();
        const boms = ((_c = bomData === null || bomData === void 0 ? void 0 : bomData.bomsInfo) !== null && _c !== void 0 ? _c : []);
        for (const bom of boms) {
            const { materialId, materialDescription } = bom;
            const key = (0, util_1.generateKey)(materialId, materialDescription);
            if (!inventoryHash[key]) {
                inventoryHash[key] = {
                    id: materialId,
                    description: materialDescription,
                    unit: "",
                    reqQty: 0,
                    category: "",
                    type: "",
                    storeQty: 0,
                    issuedQty: 0,
                    grnAcceptedQty: 0,
                    pos: [],
                    issues: []
                };
            }
            inventoryHash[key].reqQty += bom.reqQty;
        }
        let result = [];
        const keys = Object.keys(inventoryHash);
        for (const key of keys) {
            result.push(inventoryHash[key]);
        }
        return result;
    }
});
exports.cancelPO = (0, functions_1.onCall)({
    name: "cancelPO",
    schema: upsertPurchaseOrdersInfoSchema,
    handler: async (data, context) => {
        const { company, purchaseOrders } = data;
        const dataRef = admin.firestore().collection("data").doc(company);
        const bomsRef = admin.firestore().collection("boms").doc(company);
        const purchaseMaterialsRef = admin.firestore().collection("purchaseMaterials").doc(company);
        return await admin.firestore().runTransaction(async (db) => {
            var _a, _b, _c, _d, _e, _f;
            const doc = await db.get(dataRef);
            const docData = doc.data();
            if (!docData) {
                throw Error("Document is not prsent for the company");
            }
            const purchaseOrdersInfo = (_a = docData.purchaseOrdersInfo) !== null && _a !== void 0 ? _a : [];
            const bomsDoc = await db.get(bomsRef);
            const bomData = bomsDoc.data();
            if (!bomData) {
                throw Error("The Boms Data does not exist");
            }
            const bomsInfo = (_b = bomData.bomsInfo) !== null && _b !== void 0 ? _b : [];
            const purchaseMaterialsDoc = await db.get(purchaseMaterialsRef);
            const purchaseMaterialsData = purchaseMaterialsDoc.data();
            if (!purchaseMaterialsData) {
                throw Error("Purchase Material data does not exist");
            }
            const purchaseMaterialsInfo = (_c = purchaseMaterialsData.purchaseMaterialsInfo) !== null && _c !== void 0 ? _c : [];
            const inventory = (_d = docData.inventoryInfo) !== null && _d !== void 0 ? _d : [];
            const styleCodes = (_e = docData.styleCodesInfo) !== null && _e !== void 0 ? _e : [];
            const grns = (_f = docData.GRNsInfo) !== null && _f !== void 0 ? _f : [];
            let deletedPO = {};
            const collectedInventory = collectInventoryFromStyleCodes(bomsInfo, inventory);
            for (let purchaseOrder of purchaseOrders) {
                for (let lineItem of purchaseOrder.lineItems) {
                    const item = collectedInventory.inventory.find(item => item.materialId === lineItem.materialId && item.materialDescription === lineItem.materialDescription);
                    if (!item) {
                        throw Error("One of the item in the purchaseOrder does not exist in the Inventory List");
                    }
                    item.activeOrdersQty -= lineItem.purchaseQty;
                }
                if (purchaseOrder.status === Constants_1.PURCHASE_ORDER_STATUS.CANCELED) {
                    throw Error("Purchase Order is already canceled");
                }
                if (purchaseOrder.status === Constants_1.PURCHASE_ORDER_STATUS.GRN_DONE) {
                    throw Error("Purchase Order can not be cancelled as GRN IS DONE");
                }
                if (purchaseOrder.status === Constants_1.PURCHASE_ORDER_STATUS.GRN_DONE) {
                    throw Error("Purchase Order can not be cancelled as GRN IS DONE once");
                }
                purchaseOrder.status = Constants_1.PURCHASE_ORDER_STATUS.CANCELED;
                deletedPO[purchaseOrder.id] = true;
                for (let grn of grns) {
                    if (grn.poId === purchaseOrder.id) {
                        grn.status = Constants_1.GRN_STATUS.CANCELED;
                    }
                }
            }
            const assignedInventory = assignInventoryToBOM(styleCodes, collectedInventory.boms, collectedInventory.inventory);
            const updatedPurchaseMaterialsInfo = populatePurhcaseMaterialsFromBOM(assignedInventory.boms, purchaseMaterialsInfo);
            const output = upsertItemsInArray(purchaseOrdersInfo, purchaseOrders, (oldItem, newItem) => oldItem.id === newItem.id);
            let newStyleCodesInfo = addMaterialStatusToStyleCode(styleCodes, collectedInventory.boms);
            let promises = [];
            promises.push(db.set(dataRef, {
                inventoryInfo: collectedInventory.inventory,
                purchaseOrdersInfo: output,
                GRNsInfo: grns
            }, {
                merge: true,
            }));
            promises.push(db.set(bomsRef, {
                bomsInfo: collectedInventory.boms
            }, {
                merge: true
            }));
            await db.set(purchaseMaterialsRef, {
                purchaseMaterialsInfo: updatedPurchaseMaterialsInfo,
            }, {
                merge: true
            });
            await Promise.all(promises);
            return {
                styleCodesInfo: newStyleCodesInfo,
                bomsInfo: collectedInventory.boms,
                purchaseOrdersInfo: output,
                purchaseMaterialsInfo: updatedPurchaseMaterialsInfo,
                GRNsInfo: mapGRNsToList(grns)
            };
        });
    }
});
const upsertCreatePOSchema = Joi.object({
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
    }).options({ allowUnknown: true }),
})
    .unknown(false);
const getEndDeliveryDateFromPO = (purchaseOrderLineItems) => {
    let endDate = moment();
    purchaseOrderLineItems.forEach(lineItem => {
        if (!endDate) {
            endDate = moment(lineItem.deliveryDate);
        }
        else {
            endDate = moment(lineItem.deliveryDate).isAfter(endDate) ? moment(lineItem.deliveryDate) : endDate;
        }
    });
    return endDate.format(Constants_1.Constants.DATE_FORMAT);
};
exports.upsertCreatePO = (0, functions_1.onCall)({
    name: "upsertCreatePO",
    schema: upsertCreatePOSchema,
    handler: async (data, context) => {
        const supplierMap = {};
        const total = {};
        const { company, purchaseMaterials, createdAt } = data;
        try {
            const dataRef = admin.firestore().collection("data").doc(company);
            const suppliersRef = admin.firestore().collection("suppliers").doc(company);
            const bomRef = admin.firestore().collection("boms").doc(company);
            const purchaseMaterialsRef = admin.firestore().collection("purchaseMaterials").doc(company);
            return await admin.firestore().runTransaction(async (db) => {
                var _a, _b, _c, _d, _e, _f, _g;
                const doc = await db.get(dataRef);
                const docData = doc.data();
                if (!docData) {
                    throw Error("Document is not prsent for the company");
                }
                const purchaseOrdersInfo = (_a = docData.purchaseOrdersInfo) !== null && _a !== void 0 ? _a : [];
                const bomDoc = await db.get(bomRef);
                const bomData = bomDoc.data();
                if (!bomData) {
                    throw Error("Bom Does not exist");
                }
                const purchaseMaterialsDoc = await db.get(purchaseMaterialsRef);
                const purchaseMaterialsData = purchaseMaterialsDoc.data();
                if (!purchaseMaterialsData) {
                    throw Error("Purchase Material data does not exist");
                }
                const bomsInfo = (_b = bomData.bomsInfo) !== null && _b !== void 0 ? _b : [];
                const purchaseMaterialsInfo = (_c = purchaseMaterialsData.purchaseMaterialsInfo) !== null && _c !== void 0 ? _c : [];
                const inventory = (_d = docData.inventoryInfo) !== null && _d !== void 0 ? _d : [];
                const styleCodes = (_e = docData.styleCodesInfo) !== null && _e !== void 0 ? _e : [];
                const grnsInfo = (_f = docData.GRNsInfo) !== null && _f !== void 0 ? _f : [];
                const suppliersDoc = await db.get(suppliersRef);
                const suppliersDocData = suppliersDoc.data();
                if (!suppliersDocData) {
                    throw Error("Suppliers are not present in the doc");
                }
                const suppliersInfo = (_g = suppliersDocData.suppliersInfo) !== null && _g !== void 0 ? _g : [];
                for (let item of purchaseMaterials) {
                    item = item;
                    if (!item.supplier) {
                        throw Error("Supplier is not present");
                    }
                    const supplier = item.supplier.trim().toLowerCase();
                    const inventoryItem = inventory.find((inventoryItem) => item.materialId === inventoryItem.materialId && inventoryItem.materialDescription === item.materialDescription);
                    if (!inventoryItem) {
                        throw Error("The material Entry is not present in the gloabl inventory");
                    }
                    if (item.purchaseQty <= 0) {
                        throw Error("The purchaseQty can not be zero");
                    }
                    inventoryItem.activeOrdersQty += item.purchaseQty;
                    const { styleCode, totalAmount } = item;
                    if (!supplierMap[supplier]) {
                        supplierMap[supplier] = [];
                        total[supplier] = 0;
                    }
                    supplierMap[supplier].push(Object.assign({ sno: supplierMap[supplier].length + 1, referenceId: styleCode }, item));
                    total[supplier] += totalAmount;
                }
                console.log("The supplier map is", supplierMap);
                const purchaseOrders = [];
                for (const key in supplierMap) {
                    purchaseOrders.push({
                        id: generateUId("PO-", 10).toUpperCase(),
                        supplier: key.toLocaleUpperCase(),
                        createdAt,
                        purchaseOrderId: "",
                        deliveryDate: getEndDeliveryDateFromPO(supplierMap[key]),
                        amount: total[key],
                        status: POStatus.ACTIVE.toString(),
                        lineItems: supplierMap[key],
                    });
                }
                const distributedInventory = distributeInventory(styleCodes, bomsInfo, inventory);
                let result = populatePurhcaseMaterialsFromBOM(distributedInventory.bomsInfo, purchaseMaterialsInfo);
                result = result.filter((item) => item.pendingQty > 0);
                let urls = [];
                for (let purchaseOrder of purchaseOrders) {
                    const poUrl = await createPOFormatFile(company, purchaseOrder, suppliersInfo);
                    purchaseOrder.fileUrl = poUrl;
                    urls.push(poUrl);
                }
                let newStyleCodesInfo = addMaterialStatusToStyleCode(styleCodes, distributedInventory.bomsInfo);
                const grns = mapPOToGRN1(purchaseOrders);
                await db.set(dataRef, {
                    inventoryInfo: distributedInventory.inventoryInfo,
                    purchaseOrdersInfo: [...purchaseOrders, ...purchaseOrdersInfo],
                    GRNsInfo: [...grns, ...grnsInfo]
                }, {
                    merge: true,
                });
                await db.set(bomRef, {
                    bomsInfo: distributedInventory.bomsInfo
                }, {
                    merge: true
                });
                await db.set(purchaseMaterialsRef, {
                    purchaseMaterialsInfo: result,
                }, {
                    merge: true
                });
                return {
                    styleCodesInfo: newStyleCodesInfo,
                    bomsInfo,
                    purchaseOrderFiles: urls,
                    purchaseOrdersInfo: [...purchaseOrders, ...purchaseOrdersInfo],
                    purchaseMaterialsInfo: result,
                    GRNsInfo: mapGRNsToList([...grns, ...grnsInfo])
                };
            });
        }
        catch (e) {
            console.log(e);
            throw Error("Failed To Run Transaction" + e);
        }
    }
});
const upsertGRNSchema = Joi.object({
    company: Joi.string().required(),
    GRN: Joi.array().items({
        id: Joi.string().required(),
        lrNo: Joi.string().allow(""),
        trans: Joi.string().allow(""),
        dcNo: Joi.string().allow(""),
        invoiceNo: Joi.string().allow("")
    }).options({ allowUnknown: true })
})
    .unknown(false);
exports.upsertGRNRow = (0, functions_1.onCall)({
    name: "upsertGRNRow",
    schema: upsertGRNSchema,
    handler: async (data, context) => {
        const { company, GRN } = data;
        const dataRef = admin.firestore().collection("data").doc(company);
        return await admin.firestore().runTransaction(async (db) => {
            var _a;
            const doc = await db.get(dataRef);
            const docData = doc.data();
            if (!docData) {
                throw Error("The company does not exist" + company);
            }
            const grnsInfo = (_a = docData.GRNsInfo) !== null && _a !== void 0 ? _a : [];
            for (let grnInfo of grnsInfo) {
                for (let i = 0; i < grnInfo.GRN.length; i++) {
                    let dbgrn = grnInfo.GRN[i];
                    const idx = GRN.findIndex(item => item.id === dbgrn.id);
                    if (idx === -1) {
                        continue;
                    }
                    grnInfo.GRN.splice(i, 1, Object.assign(Object.assign(Object.assign({}, dbgrn), { updatedAt: (0, util_1.getCurrentDate)() }), GRN[idx]));
                }
            }
            await db.set(dataRef, {
                GRNsInfo: grnsInfo
            }, {
                merge: true
            });
            return {
                GRNsInfo: mapGRNsToList(grnsInfo)
            };
        });
    }
});
const upsertCreateGRNSchema = Joi.object({
    company: Joi.string().required(),
    createdAt: Joi.string(),
    GRN: Joi.array().items({
        id: Joi.string().required(),
        purchaseOrderId: Joi.string().required(),
        grnId: Joi.string().required(),
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
        rejectedReason: Joi.string().allow(""),
        acceptedQty: Joi.number().required(),
    }).options({ allowUnknown: true }),
})
    .unknown(false);
exports.upsertGRNItem = (0, functions_1.onCall)({
    name: "upsertGRNItem",
    schema: upsertCreateGRNSchema,
    handler: async (data, context) => {
        console.log("The data is", data);
        const { company, GRN } = data;
        const doc = await admin.firestore().collection("data").doc(company).get();
        const docData = doc.data();
        let grnId = GRN[0].grnId;
        let isGRNIdDifferent = GRN.some(grn => grn.grnId !== grnId);
        if (isGRNIdDifferent) {
            throw Error("Can not do more than 1 GRN simulataneously");
        }
        if (!docData) {
            throw Error("The company does not exist" + company);
        }
        const grnsInfo = docData.GRNsInfo;
        if (!grnsInfo) {
            throw Error("The GRN info does not exist");
        }
        let grnItemsRef = [];
        for (let grnInfo of grnsInfo) {
            for (let grn of grnInfo.GRN) {
                if (grn.id === grnId) {
                    grnItemsRef = grn.lineItems;
                    if (grn.status !== Constants_1.GRN_STATUS.ACTIVE) {
                        throw Error("The GRN Should be in active status");
                    }
                }
            }
        }
        const grnInfoOutput = upsertItemsInArray(grnItemsRef, GRN, (oldItem, newItem) => oldItem.purchaseOrderId === newItem.purchaseOrderId &&
            oldItem.materialId === newItem.materialId &&
            oldItem.materialDescription === newItem.materialDescription);
        for (let grnInfo of grnsInfo) {
            for (let grn of grnInfo.GRN) {
                if (grn.id === grnId) {
                    grn.lineItems = grnInfoOutput;
                    grn.updatedAt = (0, util_1.getCurrentDate)();
                }
            }
        }
        await admin.firestore().collection("data").doc(company).set({
            GRNsInfo: grnsInfo,
        }, {
            merge: true,
        });
        return {
            GRNsInfo: mapGRNsToList(grnsInfo),
        };
    },
});
exports.upsertGRN = (0, functions_1.onCall)({
    name: "upsertGRN",
    schema: upsertCreateGRNSchema,
    handler: async (data, context) => {
        const { company, GRN } = data;
        if (GRN.length === 0) {
            throw Error("There is no Item to do GRN");
        }
        let grnId = GRN[0].grnId;
        let isGRNIdDifferent = GRN.some(grn => grn.grnId !== grnId);
        if (isGRNIdDifferent) {
            throw Error("Can not do more than 1 GRN simulataneously");
        }
        try {
            const dataRef = admin.firestore().collection("data").doc(company);
            const bomRef = admin.firestore().collection("boms").doc(company);
            const purchaseMaterialsRef = admin.firestore().collection("purchaseMaterials").doc(company);
            const suppliersRef = admin.firestore().collection("suppliers").doc(company);
            return await admin.firestore().runTransaction(async (db) => {
                var _a, _b, _c, _d, _e, _f, _g;
                const doc = await db.get(dataRef);
                const docData = doc.data();
                if (!docData) {
                    throw Error("The company does not exist" + company);
                }
                const grnsInfo = (_a = docData.GRNsInfo) !== null && _a !== void 0 ? _a : [];
                let grnItemsRef = [];
                for (let grnInfo of grnsInfo) {
                    for (let grn of grnInfo.GRN) {
                        if (grn.id === grnId) {
                            grnItemsRef = grn.lineItems;
                            if (grn.status !== Constants_1.GRN_STATUS.ACTIVE) {
                                throw Error("The GRN Should be in active status");
                            }
                        }
                    }
                }
                const purchaseMaterialsDoc = await db.get(purchaseMaterialsRef);
                const purchaseMaterialsData = purchaseMaterialsDoc.data();
                if (!purchaseMaterialsData) {
                    throw Error("Purchase Material data does not exist");
                }
                const inventory = GRN.map((output) => ({
                    materialId: output.materialId,
                    materialDescription: output.materialDescription,
                    inventory: output.acceptedQty,
                    purchaseQty: output.purchaseQty,
                }));
                const inventoryInfo = (_b = docData.inventoryInfo) !== null && _b !== void 0 ? _b : [];
                const bomDoc = await db.get(bomRef);
                const bomData = bomDoc.data();
                if (!bomData) {
                    throw Error("Bom Does not exist");
                }
                const bomsInfo = (_c = bomData.bomsInfo) !== null && _c !== void 0 ? _c : [];
                const styleCodesInfo = (_d = docData.styleCodesInfo) !== null && _d !== void 0 ? _d : [];
                const purchaseMaterialsInfo = (_e = purchaseMaterialsData.purchaseMaterialsInfo) !== null && _e !== void 0 ? _e : [];
                const purchaseOrdersInfo = (_f = docData.purchaseOrdersInfo) !== null && _f !== void 0 ? _f : [];
                const result = collectInventoryFromStyleCodes(bomsInfo, inventoryInfo);
                const collectedInventory = result === null || result === void 0 ? void 0 : result.inventory;
                if (!collectedInventory) {
                    throw Error("Inventory Collection Failed");
                }
                const output = upsertItemsInArray(collectedInventory, inventory, (oldItem, newItem) => oldItem.materialId === newItem.materialId &&
                    oldItem.materialDescription === newItem.materialDescription, undefined, (oldItem, newItem) => (Object.assign(Object.assign({}, oldItem), { inventory: oldItem.inventory + newItem.inventory, activeOrdersQty: Math.max(oldItem.activeOrdersQty - newItem.purchaseQty, 0) })));
                const p = distributeInventory(styleCodesInfo, result.boms, output);
                const GRNDone = GRN.map((item) => (Object.assign(Object.assign({}, item), { status: "DONE" })));
                const grnInfoOutput = upsertItemsInArray(grnItemsRef, GRNDone, (oldItem, newItem) => oldItem.purchaseOrderId === newItem.purchaseOrderId &&
                    oldItem.materialId === newItem.materialId &&
                    oldItem.materialDescription === newItem.materialDescription);
                const newPurchaseMaterialInfo = populatePurhcaseMaterialsFromBOM(p.bomsInfo, purchaseMaterialsInfo);
                let poID = "";
                let grnForPO;
                let parentGRN;
                for (let grnInfo of grnsInfo) {
                    for (let grn of grnInfo.GRN) {
                        if (grn.id === grnId) {
                            grn.lineItems = grnInfoOutput;
                            parentGRN = grnInfo;
                            grn.status = "DONE";
                            poID = grnInfo.poId;
                            grnForPO = grn;
                            grn.updatedAt = (0, util_1.getCurrentDate)();
                        }
                    }
                }
                const suppliersDoc = await db.get(suppliersRef);
                const suppliersDocData = suppliersDoc.data();
                if (!suppliersDocData) {
                    throw Error("Suppliers are not present in the doc");
                }
                if (!grnForPO) {
                    throw Error("GRN doc does not exist");
                }
                if (!parentGRN) {
                    throw Error("GRN doc does not exist");
                }
                const suppliersInfo = (_g = suppliersDocData.suppliersInfo) !== null && _g !== void 0 ? _g : [];
                for (let purchaseorder of purchaseOrdersInfo) {
                    if (purchaseorder.id === poID) {
                        purchaseorder.status = "GRN DONE";
                        const result = await createGRNFormatFile(company, grnForPO, purchaseorder, suppliersInfo, parentGRN.grnDocUrl ? `grns/${company}/GRN-${parentGRN.poId}.xlsx` : undefined);
                        parentGRN.grnDocUrl = result;
                        break;
                    }
                }
                console.log(Constants_1.Constants.NAMES);
                await db.set(dataRef, {
                    GRNsInfo: grnsInfo,
                    inventoryInfo: p.inventoryInfo,
                    purchaseOrdersInfo: purchaseOrdersInfo
                }, {
                    merge: true,
                });
                await db.set(bomRef, {
                    bomsInfo: p.bomsInfo
                }, {
                    merge: true
                });
                await db.set(purchaseMaterialsRef, {
                    purchaseMaterialsInfo: newPurchaseMaterialInfo,
                }, {
                    merge: true
                });
                return {
                    company,
                    GRNsInfo: mapGRNsToList(grnsInfo),
                    inventoryInfo: p.inventoryInfo,
                    bomsInfo: p.bomsInfo,
                    purchaseMaterialsInfo: newPurchaseMaterialInfo,
                    purchaseOrdersInfo: purchaseOrdersInfo
                };
            });
        }
        catch (e) {
            console.log(e);
            throw Error("Failed To Run Transaction" + e);
        }
    },
});
const upsertCreateInventorySchema = Joi.object({
    company: Joi.string().required(),
    createdAt: Joi.string(),
    inventory: Joi.array().items({
        materialId: Joi.string().required(),
        materialDescription: Joi.string().required(),
        issue: Joi.number().required(),
        activeOrdersQty: Joi.string().required(),
        inventory: Joi.number().required(),
    }).options({ allowUnknown: true }),
})
    .unknown(false);
exports.distributeInventory = functions
    .region("asia-northeast3")
    .https
    .onCall(async (data, context) => {
    var _a, _b, _c;
    const { company } = data;
    const doc = await admin.firestore().collection("data").doc(company).get();
    const bomDoc = await admin.firestore().collection("data").doc(company).get();
    const docData = doc.data();
    if (!docData) {
        throw Error("The company does not exist" + company);
    }
    const bomData = bomDoc.data();
    if (!bomData) {
        throw Error("The bom Data does not exist");
    }
    const inventoryInfo = (_a = docData.inventoryInfo) !== null && _a !== void 0 ? _a : [];
    const bomsInfo = (_b = bomData.bomsInfo) !== null && _b !== void 0 ? _b : [];
    const styleCodesInfo = (_c = docData.styleCodesInfo) !== null && _c !== void 0 ? _c : [];
    const p = distributeInventory(styleCodesInfo, bomsInfo, inventoryInfo);
    await admin.firestore().collection("data").doc(company).set({
        inventoryInfo: p.inventoryInfo,
    }, {
        merge: true,
    });
    await admin.firestore().collection("boms").doc(company).set({
        bomsInfo: p.bomsInfo
    }, {
        merge: true
    });
    return {
        company,
        inventoryInfo: p.inventoryInfo,
        bomsInfo: p.bomsInfo,
    };
});
const deleteDataSchema = Joi.object({
    company: Joi.string().required(),
    collectionName: Joi.string().required(),
    objectName: Joi.string().required()
});
exports.deleteData = (0, functions_1.onCall)({
    name: "DeleteData",
    schema: deleteDataSchema,
    handler: async (data, context) => {
        const { company, collectionName, objectName } = data;
        return admin.firestore().collection(collectionName).doc(company).set({ [objectName]: [] }, {
            merge: true
        });
    }
});
const upsertMigrateDataSchema = Joi.object({
    company: Joi.string().required(),
    source: Joi.string().required(),
    destination: Joi.string().required(),
    sourceName: Joi.string().required(),
    destinationName: Joi.string().required()
}).options({ allowUnknown: true });
exports.migrateData = (0, functions_1.onCall)({
    name: "migrateData",
    schema: upsertMigrateDataSchema,
    handler: async (data, context) => {
        const { company, source, sourceName, destination, destinationName } = data;
        const sourceRef = admin.firestore().collection(source || "data").doc(company);
        const destRef = admin.firestore().collection(destination).doc(company);
        return await admin.firestore().runTransaction(async (db) => {
            var _a;
            const sourceDoc = await db.get(sourceRef);
            const sourceData = sourceDoc.data();
            if (!sourceData)
                throw new Error("Source Data does not exist");
            const source = (_a = sourceData[sourceName]) !== null && _a !== void 0 ? _a : [];
            await db.set(destRef, {
                [destinationName]: source
            }, {
                merge: true
            });
            return {
                [destinationName]: source
            };
        });
    }
});
exports.upsertInventory = (0, functions_1.onCall)({
    name: "upsertInventory",
    schema: upsertCreateInventorySchema,
    handler: async (data, context) => {
        console.log("The data is", data);
        const { company, inventory } = data;
        const dataRef = admin.firestore().collection("data").doc(company);
        const bomsRef = admin.firestore().collection("boms").doc(company);
        return await admin.firestore().runTransaction(async (db) => {
            var _a, _b, _c;
            const doc = await db.get(dataRef);
            const docData = doc.data();
            if (!docData) {
                throw Error("Document is not prsent for the company");
            }
            const inventoryInfo = (_a = docData.inventoryInfo) !== null && _a !== void 0 ? _a : [];
            const bomsDoc = await db.get(bomsRef);
            const bomsData = bomsDoc.data();
            if (!bomsData) {
                throw Error("Boms Data not Present");
            }
            const bomsInfo = (_b = bomsData.bomsInfo) !== null && _b !== void 0 ? _b : [];
            const styleCodesInfo = (_c = docData.styleCodesInfo) !== null && _c !== void 0 ? _c : [];
            const result = collectInventoryFromStyleCodes(inventoryInfo, bomsInfo);
            const collectedInventory = result === null || result === void 0 ? void 0 : result.inventory;
            if (!collectedInventory) {
                throw Error("Inventory Collection Failed");
            }
            const output = upsertItemsInArray(collectedInventory, inventory, (oldItem, newItem) => oldItem.materialId === newItem.materialId &&
                oldItem.materialDescription === newItem.materialDescription);
            const p = distributeInventory(styleCodesInfo, result.boms, output);
            var promises = [];
            promises.push(db.set(dataRef, {
                inventoryInfo: p.inventoryInfo,
            }, {
                merge: true,
            }));
            promises.push(db.set(bomsRef, {
                bomsInfo: p.bomsInfo,
            }, {
                merge: true
            }));
            await Promise.all(promises);
            return {
                company,
                inventoryInfo: p.inventoryInfo,
                bomsInfo: p.bomsInfo,
            };
        });
    },
});
exports.createPO = functions
    .region("asia-northeast3")
    .https
    .onCall(async (data, context) => {
    const { company } = await getCompany(data, context);
    const { bom, createdAt } = data;
    console.log("The bom is createdAt company", bom, createdAt, company);
    const supplierMap = {};
    const totalAmount = {};
    for (const item of bom) {
        const { supplier, styleCode, description, id, poQty, unit, rate, consumption } = item;
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
            quantity: parseFloat((poQty * consumption).toFixed(2)),
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
            deliveryDate: (0, util_1.getCurrentDate)(),
            amount: totalAmount[key],
            status: "ACTIVE",
            data: supplierMap[key],
        });
    }
    const doc = await admin.firestore().collection("data").doc(company).get();
    const companyData = doc.data();
    if (!companyData) {
        throw new Error("The company does not exist");
    }
    const { purchaseOrders: pastOrders } = companyData;
    await admin.firestore().collection("data").doc(company).set({
        purchaseOrders: [...purchaseOrders, ...(pastOrders || [])],
    }, {
        merge: true,
    });
    return [...purchaseOrders, ...(pastOrders || [])];
});
const mapPOToGRN1 = (purchaseOrders) => {
    let grns = [];
    for (const purchaseOrder of purchaseOrders) {
        let grnID = generateUId("GRN", 8);
        let grn = {
            poId: purchaseOrder.id,
            status: Constants_1.GRN_STATUS.ACTIVE,
            grnDocUrl: '',
            GRN: [{
                    id: grnID,
                    createdAt: (0, util_1.getCurrentDate)(),
                    status: Constants_1.GRN_STATUS.ACTIVE,
                    supplier: purchaseOrder.supplier,
                    itemsCount: purchaseOrder.lineItems.length,
                    amount: purchaseOrder.amount,
                    updatedAt: (0, util_1.getCurrentDate)(),
                    lrNo: "",
                    dcNo: "",
                    invoiceNo: "",
                    trans: "",
                    lineItems: purchaseOrder.lineItems.map((item) => ({
                        id: generateUId("GRN-ITEM", 6),
                        grnId: grnID,
                        purchaseOrderId: purchaseOrder.id,
                        category: item.category,
                        type: item.type,
                        materialId: item.materialId,
                        materialDescription: item.materialDescription,
                        unit: item.unit,
                        purchaseQty: item.purchaseQty,
                        receivedQty: 0,
                        status: Constants_1.GRN_STATUS.ACTIVE,
                        receivedDate: (0, util_1.getCurrentDate)(),
                        rejectedQty: 0,
                        rejectedReason: "",
                        acceptedQty: 0,
                    })),
                }]
        };
        grns.push(grn);
    }
    return grns;
};
const createGRNFormatFile = async (company, grn, purchaseOrder, suppliers, filePath) => {
    const workbook = new excelJS.Workbook();
    const formateTemplateStream = readExcelTemplate(company, Constants_1.Constants.GRN_TEMPLATE_FILE, filePath);
    await workbook.xlsx.read(formateTemplateStream);
    const worksheet = workbook.getWorksheet('Sheet1');
    const supplier = suppliers.find(item => item.name.toLowerCase() === purchaseOrder.supplier.toLowerCase());
    if (!supplier)
        throw Error("Supplier does not exist in DB");
    fillGRNWorksheet(worksheet, grn, purchaseOrder, supplier);
    const outputFile = path.join(os.tmpdir(), `${grn.id}.xlsx`);
    await workbook.xlsx.writeFile(outputFile);
    const fileUrl = await uploadFileToStorage(outputFile, `grns/${company}/GRN-${purchaseOrder.id}.xlsx`);
    return fileUrl;
};
const fillGRNWorksheet = (worksheet, grn, purchaseOrder, supplier) => {
    var _a, _b, _c, _d;
    worksheet.getCell("B15").value = "C/O " + supplier.person;
    worksheet.getCell("B16").value = (purchaseOrder.supplier || "").toUpperCase();
    worksheet.getCell("B17").value = supplier.address1;
    worksheet.getCell("B18").value = supplier.address2;
    worksheet.getCell("B19").value = supplier.city + " - " + supplier.pin + ", INDIA";
    worksheet.getCell("B20").value = "GSTIN " + ((_a = supplier.gst) !== null && _a !== void 0 ? _a : "") + ", PAN " + ((_b = supplier.pan) !== null && _b !== void 0 ? _b : "");
    worksheet.getCell("B21").value = (_c = "Contact No " + supplier.phoneNumber) !== null && _c !== void 0 ? _c : "";
    worksheet.getCell("B22").value = (_d = "Email Id " + supplier.email) !== null && _d !== void 0 ? _d : "";
    worksheet.getCell("G14").value = "GRN DONE";
    worksheet.getCell("G17").value = "Order Date " + (0, util_1.getDateFormat)(purchaseOrder.createdAt);
    worksheet.insertRow(28, ["", "GRN NO.", "", "ORDER NO.", "", "INVOICE NO.", "", "DC NO.", "", "Transporter", "", "LR No.", ""]);
    try {
    }
    catch (e) { }
    worksheet.insertRow(29, "");
    worksheet.getCell("B29").value = grn.id.toUpperCase();
    worksheet.getCell("D29").value = purchaseOrder.id.toUpperCase();
    worksheet.getCell("F29").value = grn.invoiceNo;
    worksheet.getCell("H29").value = grn.dcNo;
    worksheet.getCell("J29").value = "";
    worksheet.getCell("L29").value = grn.lrNo;
    worksheet.getCell("J29").value = grn.trans;
    worksheet.insertRow(30, "");
    worksheet.insertRow(30, ["", "ITEM LIST"]);
    try {
    }
    catch (e) { }
    let items = 0;
    worksheet.insertRow(31, ["", "S. No.", "ITEM Id", "ITEM Desc", "Unit", "Ordered Qty", "Received Qty", "Rejected Qty", "Rejected Reason", "Accepted Qty", "Received On", "Amt. Payable"]);
    let sn = grn.lineItems.length;
    let total = 0;
    let totalMap = {};
    for (let item of grn.lineItems) {
        const poLineItem = purchaseOrder.lineItems.find(po => po.materialId === item.materialId && po.materialDescription === item.materialDescription);
        if (!poLineItem) {
            throw Error("Item does not exist in purchase order");
        }
        totalMap["orderedQty"] = (totalMap["orderedQty"] || 0) + item.purchaseQty;
        totalMap["receivedQty"] = (totalMap["receivedQty"] || 0) + item.receivedQty;
        totalMap["rejectedQty"] = (totalMap["rejectedQty"] || 0) + item.rejectedQty;
        totalMap["acceptedQty"] = (totalMap["acceptedQty"] || 0) + item.acceptedQty;
        if (item.acceptedQty !== 0) {
            items += 1;
        }
        worksheet.insertRow(32, ['', sn, item.materialId, item.materialDescription, poLineItem.unit, item.purchaseQty, item.receivedQty, item.rejectedQty, item.rejectedReason, item.acceptedQty, item.receivedDate, Math.ceil((poLineItem.totalAmount / poLineItem.purchaseQty) * (item.acceptedQty))]);
        total += Math.ceil((poLineItem.totalAmount / poLineItem.purchaseQty) * (item.acceptedQty));
        sn -= 1;
    }
    worksheet.insertRow(32 + grn.lineItems.length, ['', "Total", "", "", "", totalMap["orderedQty"], totalMap["receivedQty"], totalMap["rejectedQty"], "", totalMap["acceptedQty"], "", total]);
    grn.amount = total;
    let currentTotal = worksheet.getCell("G20").value;
    if (!currentTotal) {
        currentTotal = 0;
    }
    currentTotal = currentTotal;
    let currentItemCount = worksheet.getCell("G23").value;
    if (!currentItemCount) {
        currentItemCount = 0;
    }
    currentItemCount = currentItemCount;
    worksheet.getCell("G23").value = currentItemCount + totalMap["acceptedQty"];
    worksheet.getCell("G20").value = currentTotal + total;
    grn.itemsCount = items;
    worksheet.insertRow(28, "");
    return worksheet;
};
exports.formatPO = functions
    .region("asia-northeast3")
    .https
    .onCall(async () => {
    return await createPOFormatFile("test", {
        supplier: "abc",
        purchaseOrderId: "PO-123",
        createdAt: "1st JAn",
        lineItems: [{
                id: 1,
                category: "cloth",
                unit: "pc",
                type: "shirt",
                materialId: "lala",
                materialDescription: "mota-12",
                purchaseQty: 2212
            }]
    }, []);
});
const createPOFormatFile = async (company, purchaseOrder, suppliers) => {
    const workbook = new excelJS.Workbook();
    const formateTemplateStream = readExcelTemplate(company, Constants_1.Constants.PO_TEMPLATE_FILE);
    await workbook.xlsx.read(formateTemplateStream);
    const worksheet = workbook.getWorksheet('Sheet1');
    const supplier = suppliers.find(item => item.name.toLowerCase() === purchaseOrder.supplier.toLowerCase());
    if (!supplier)
        throw Error("Supplier does not exist in DB");
    fillPurchaseOrderWorksheet(worksheet, purchaseOrder, supplier);
    const outputFile = path.join(os.tmpdir(), "output.xlsx");
    await workbook.xlsx.writeFile(outputFile);
    const fileUrl = await uploadFileToStorage(outputFile, `purchaseOrders/${company}/${purchaseOrder.id}.xlsx`);
    return fileUrl;
};
const readExcelTemplate = (company, templateFile, filePath) => {
    let file_path = filePath;
    if (!file_path)
        file_path = `format/${company}/${templateFile}`;
    try {
        const file = admin.storage().bucket("gs://zenlor.appspot.com").file(file_path);
        return file.createReadStream();
    }
    catch (e) {
        throw Error("Unable to read PurchaseOrder Format" + e);
    }
};
const fillPurchaseOrderWorksheet = (worksheet, purchaseOrder, supplier) => {
    var _a, _b, _c, _d;
    worksheet.getCell("B15").value = "C/O " + supplier.person;
    worksheet.getCell("B16").value = (purchaseOrder.supplier || "").toUpperCase();
    worksheet.getCell("B17").value = supplier.address1;
    worksheet.getCell("B18").value = supplier.address2;
    worksheet.getCell("B19").value = supplier.city + " - " + supplier.pin + ", INDIA";
    worksheet.getCell("B20").value = "GSTIN " + ((_a = supplier.gst) !== null && _a !== void 0 ? _a : "") + ", PAN " + ((_b = supplier.pan) !== null && _b !== void 0 ? _b : "");
    worksheet.getCell("B21").value = (_c = "Contact No " + supplier.phoneNumber) !== null && _c !== void 0 ? _c : "";
    worksheet.getCell("B22").value = (_d = "Email Id " + supplier.email) !== null && _d !== void 0 ? _d : "";
    worksheet.getCell("G15").value = "Order No. " + purchaseOrder.id;
    worksheet.getCell("G19").value = "Order Date " + (0, util_1.getDateFormat)(purchaseOrder.createdAt);
    worksheet.getCell("G22").value = purchaseOrder.deliveryDate;
    let total = {
        preTaxAmount: 0,
        tax: 0,
        qty: 0,
        taxAmount: 0,
        totalAmount: 0
    };
    for (let i = 0; i < purchaseOrder.lineItems.length; i++) {
        const lineItem = purchaseOrder.lineItems[i];
        total.preTaxAmount += lineItem.preTaxAmount;
        total.tax += lineItem.tax;
        total.qty += lineItem.purchaseQty;
        total.taxAmount += lineItem.taxAmount;
        total.totalAmount += lineItem.totalAmount;
        worksheet.insertRow(26 + i, ['', i + 1, lineItem.materialId, lineItem.materialDescription, lineItem.unit, lineItem.purchaseQty, lineItem.rate, lineItem.discount, lineItem.preTaxAmount, lineItem.tax, lineItem.taxAmount, lineItem.totalAmount, lineItem.deliveryDate]);
    }
    worksheet.insertRow(26 + purchaseOrder.lineItems.length, ['', 'Total', '', '', '', total.qty, '', '', total.preTaxAmount, '', total.taxAmount, total.totalAmount, '']);
    return worksheet;
};
const uploadFileToStorage = async (filePath, path) => {
    const [file] = await admin.storage().bucket("gs://zenlor.appspot.com").upload(filePath, {
        destination: path,
    });
    const [downloadUrl] = await file.getSignedUrl({
        action: 'read',
        expires: 1744949418000
    });
    return downloadUrl;
};
const SupplierSchema = Joi.object({
    company: Joi.string().required(),
    createdAt: Joi.string(),
    suppliers: Joi.array().items({
        name: Joi.string().required(),
        address1: Joi.string().required(),
        address2: Joi.string().allow(""),
        city: Joi.string().required(),
        state: Joi.string().required(),
        pin: Joi.number().required(),
        gst: Joi.string().required(),
        pan: Joi.string().required(),
        person: Joi.string().required(),
        phoneNumber: Joi.number().required(),
        email: Joi.string().email(),
    }).options({ allowUnknown: true }).strict(false),
})
    .unknown(true);
exports.upsertSuppliersInfo = (0, functions_1.onCall)({
    name: "upsertSuppliers",
    schema: SupplierSchema,
    handler: async (data, context) => {
        const { company, suppliers } = data;
        try {
            const dataRef = admin.firestore().collection("suppliers").doc(company);
            return await admin.firestore().runTransaction(async (db) => {
                var _a;
                const doc = await db.get(dataRef);
                const docData = doc.data();
                if (!docData) {
                    throw Error("The company does not exist" + company);
                }
                const suppliersInfo = (_a = docData === null || docData === void 0 ? void 0 : docData.suppliersInfo) !== null && _a !== void 0 ? _a : [];
                let output = upsertItemsInArray(suppliersInfo, suppliers, (oldItem, newItem) => oldItem.gst === newItem.gst && oldItem.name === newItem.name);
                output = output.sort((a, b) => a.name.localeCompare(b.name));
                await db.set(dataRef, {
                    suppliersInfo: output
                }, {
                    merge: true,
                });
                return {
                    company,
                    suppliersInfo: output
                };
            });
        }
        catch (e) {
            console.log(e);
            throw Error("Failed To Run Transaction" + e);
        }
    }
});
exports.makeItNan = functions
    .region("asia-northeast3")
    .https.onCall(async (body, context) => {
    const doc = await admin.firestore().collection("data").doc("test").get();
    const data = doc.data();
    if (!data) {
        return;
    }
    data.inventoryInfo[0].inventory = NaN;
    await admin.firestore().collection("data").doc("test").set(data, {
        merge: true
    });
});
//# sourceMappingURL=index.js.map