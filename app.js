import express from "express";
import { uploadPdf, chat } from "./controllers/pdf.controller.js";
import upload from "./utils/multer.js";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ name: "kapil" });
});

app.post("/pdf/upload", upload.single("pdf"), uploadPdf);
app.post("/pdf/chat", chat);

export default app;
