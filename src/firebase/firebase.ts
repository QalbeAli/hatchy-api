import * as admin from "firebase-admin";
import serviceAccount from "./allauth-2395e-firebase-adminsdk-m69lz-05e8dae289.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});
admin.firestore().settings({ ignoreUndefinedProperties: true });

export { admin };