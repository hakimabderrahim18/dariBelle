import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/") || file.mimetype === "text/csv" || file.mimetype === "application/vnd.ms-excel") {
    cb(null, true);
  } else {
    cb(new Error("Format de fichier non pris en charge. (Images ou CSV uniquement)"), false);
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter,
});
