const admin = require("firebase-admin");

admin.initializeApp();
admin.firestore().settings({
  ignoreUndefinedProperties: true,
})

module.exports = admin