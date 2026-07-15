import path from "node:path";
import multer from "multer";

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

const MIME_TYPES_BY_EXTENSION = {
  ".pdf": new Set(["application/pdf", "application/octet-stream"]),
  ".docx": new Set([
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/octet-stream",
    "application/zip",
  ]),
};

export class UnsupportedFileTypeError extends Error {
  constructor() {
    super("Only PDF and DOCX files are supported");
    this.name = "UnsupportedFileTypeError";
  }
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_UPLOAD_BYTES,
    files: 1,
    fields: 0,
    parts: 2,
  },
  fileFilter: (_request, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const allowedMimeTypes = MIME_TYPES_BY_EXTENSION[extension];

    if (!allowedMimeTypes?.has(file.mimetype.toLowerCase())) {
      callback(new UnsupportedFileTypeError());
      return;
    }

    callback(null, true);
  },
});

const parseSingleDocument = upload.single("file");

export function receiveDocumentUpload(request, response, next) {
  parseSingleDocument(request, response, (error) => {
    if (!error) {
      if (!request.file) {
        response.status(400).json({
          error: "Attach a PDF or DOCX file in the 'file' form field",
          code: "FILE_REQUIRED",
        });
        return;
      }

      next();
      return;
    }

    if (error instanceof UnsupportedFileTypeError) {
      response.status(415).json({
        error: error.message,
        code: "UNSUPPORTED_FILE_TYPE",
      });
      return;
    }

    if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
      response.status(413).json({
        error: "File exceeds the 10 MB upload limit",
        code: "FILE_TOO_LARGE",
      });
      return;
    }

    if (error instanceof multer.MulterError) {
      response.status(400).json({
        error: "Invalid multipart upload",
        code: error.code,
      });
      return;
    }

    next(error);
  });
}
