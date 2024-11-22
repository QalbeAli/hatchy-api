import * as admin from "firebase-admin";
import config from "../config";

admin.initializeApp({
  credential: admin.credential.cert(config.FIREBASE_API_KEY as admin.ServiceAccount),
});
admin.firestore().settings({ ignoreUndefinedProperties: true });

export { admin };