import { config } from "dotenv";
config();
import { handler, devHandler } from "./src/masters/updateMastersPFPImage.js";
import express, { json } from "express";

const app = express();
app.use(json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});

app.post("/masters/pfp/image/:tokenId", handler);
app.post("/dev/masters/pfp/image/:tokenId", devHandler);
