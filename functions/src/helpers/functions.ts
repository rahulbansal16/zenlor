import * as functions from "firebase-functions";
import * as Joi from "joi";
// import {METHOD} from "../types/general";
const {logger} = functions;

interface OnCallOptions<T> {
  name: string;
  handler: (data: T, context: functions.https.CallableContext) => any;
  schema?: Joi.Schema;
}

export const onCall = <T>(options: OnCallOptions<T>) =>
  functions.region("asia-northeast3").https.onCall(async (data: T, context) => {
    logger.log(`Running ${options.name}`);

    try {
      if (options.schema) {
        logger.info("Validating data...");
        const validationResult = options.schema.validate(data);
        if (validationResult.error) {
          logger.error("Validation Error", validationResult.error);
          throw validationResult.error;
        }
        logger.info("Validating data!");
      }

      return await options.handler(data, context);
    } catch (e) {
      logger.error(e.message);
      throw new functions.https.HttpsError(e.code ?? "internal", e.message);
    }
  });

// interface onRequestOptions {
//   name: string;
//   schema: any;
//   handler: any;
// }

// export const onRequest = (options: onRequestOptions) =>
//   functions.region("asia-northeast3").https.onRequest(
//       async (request, response) => {
//         logger.log(`Running onRequest ${options.name}`);
//         let method = METHOD.GET;
//         const methodVerb = request.method;
//         switch (request.method) {
//           case "POST":
//             method = METHOD.POST;
//             break;
//           case "GET":
//             method = METHOD.GET;
//             break;
//           case "PUT":
//             method = METHOD.POST;
//             break;
//           case "DELETE":
//             method = METHOD.DELETE;
//             break;
//         }
//         try {
//           if (options.schema[methodVerb]) {
//             logger.info("Validating data...");
//             const validationResult = options
//                 .schema[methodVerb]
//                 .validate(request.body);
//             if (validationResult.error) {
//               logger.error("Validation Error", validationResult.error);
//               throw validationResult.error;
//             }
//             logger.info("Validating data!");
//           }

//           return await options.handler[method](request, response);
//         } catch (e) {
//           logger.error(e.message);
//           throw new functions.https.HttpsError(e.code ?? "internal", e.message);
//         }
//       });
