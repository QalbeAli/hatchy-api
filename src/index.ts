import { config } from "dotenv";
config();
import express, { json } from "express";
import cors from "cors";
import { devHandler, handler } from "./masters/updateMastersPFPImage";
const app = express();
app.use(json());
app.use(cors());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});

app.post("/masters/pfp/image/:tokenId", handler);
app.post("/dev/masters/pfp/image/:tokenId", devHandler);
