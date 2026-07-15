import path from "node:path";
import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";

export class TextExtractionError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "TextExtractionError";
  }
}

function isPdf(buffer) {
  return buffer.subarray(0, 1024).indexOf(Buffer.from("%PDF-")) !== -1;
}

function isZip(buffer) {
  return (
    buffer.length >= 4 &&
    buffer[0] === 0x50 &&
    buffer[1] === 0x4b &&
    [0x03, 0x05, 0x07].includes(buffer[2]) &&
    [0x04, 0x06, 0x08].includes(buffer[3])
  );
}

async function extractPdfText(buffer) {
  if (!isPdf(buffer)) {
    throw new TextExtractionError("The PDF is corrupted or has an invalid file structure");
  }

  const parser = new PDFParse({ data: buffer });

  try {
    const result = await parser.getText();
    return result.text;
  } catch (error) {
    throw new TextExtractionError(
      "Text could not be extracted from this PDF; the file may be corrupted",
      { cause: error },
    );
  } finally {
    await parser.destroy().catch(() => undefined);
  }
}

async function extractDocxText(buffer) {
  if (!isZip(buffer)) {
    throw new TextExtractionError("The DOCX file is corrupted or has an invalid file structure");
  }

  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    throw new TextExtractionError(
      "Text could not be extracted from this DOCX file; the file may be corrupted",
      { cause: error },
    );
  }
}

export async function extractTextFromFile(file) {
  const extension = path.extname(file.originalname).toLowerCase();
  let extractedText;

  if (extension === ".pdf") {
    extractedText = await extractPdfText(file.buffer);
  } else if (extension === ".docx") {
    extractedText = await extractDocxText(file.buffer);
  } else {
    throw new TextExtractionError("Only PDF and DOCX files are supported");
  }

  const normalizedText = extractedText.trim();

  if (!normalizedText) {
    throw new TextExtractionError(
      "No selectable text was found. Scanned documents require OCR, which is not enabled yet",
    );
  }

  return normalizedText;
}
