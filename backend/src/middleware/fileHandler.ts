import multer from "multer";
import path from "path";
import fs from "fs";
import { Request, Response } from "express";


const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}


const storage = multer.diskStorage({
  destination: function (_, __, cb) {
    cb(null, uploadDir);
  },
  filename: function (_, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});

export const upload = multer({ storage });

export const handleFileUpload = (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  res.json({
    message: "File uploaded successfully",
    filename: req.file.filename,
    path: req.file.path,
    caption: req.body.caption,
  });
};
