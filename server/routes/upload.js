import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  // Accept images and PDFs only
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    return cb(null, true);
  } else {
    cb(
      new Error("Only images (JPEG, PNG, GIF, WebP) and PDF files are allowed!")
    );
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

// Upload single file
router.post("/single", upload.single("document"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      message: "File uploaded successfully",
      fileUrl: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload multiple files
router.post("/multiple", upload.array("documents", 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const fileUrls = req.files.map((file) => ({
      fileUrl: `/uploads/${file.filename}`,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
    }));

    res.json({
      message: "Files uploaded successfully",
      files: fileUrls,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload menu item image
router.post("/menu-image", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({
      message: "Image uploaded successfully",
      imageUrl: imageUrl,
      filename: req.file.filename,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete file
router.delete("/:filename", (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(uploadsDir, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: "File deleted successfully" });
    } else {
      res.status(404).json({ message: "File not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
