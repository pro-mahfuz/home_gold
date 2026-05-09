import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Example: dynamically decide folder from route or field name
    const baseFolder = "uploads";

    // Example folder logic: by field name
    const subFolder = file.fieldname === "profilePicture"
      ? "profiles"
      : file.fieldname === "gallery"
      ? "galleries"
      : file.fieldname === "businessLogo"
      ? "logo"
      : file.fieldname === "businessLicenseCopy"
      ? "license"
      : "misc";

    const fullPath = path.join(baseFolder, subFolder);

    // Ensure folder exists
    fs.mkdirSync(fullPath, { recursive: true });

    cb(null, fullPath);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    cb(null, `${base}-${Date.now()}${ext}`);
  },
});

export const upload = multer({ storage });

// Use in route for uploading a single file
//upload.single("profilePicture");
// Use in route for uploading multiple files
// upload.fields([
//     { name: "profilePicture", maxCount: 1 },
//     { name: "gallery", maxCount: 5 },
// ])
