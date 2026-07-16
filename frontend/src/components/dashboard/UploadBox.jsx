import { useEffect, useId, useState } from "react";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

function UploadIcon() {
  return (
    <svg aria-hidden="true" className="h-7 w-7" fill="none" viewBox="0 0 24 24">
      <path d="M7 3.5h7l4 4v13H7z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.6" />
      <path d="M14 3.5V8h4M12.5 17v-6m0 0-2.3 2.3m2.3-2.3 2.3 2.3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
    </svg>
  );
}

function getFileError(file) {
  if (!file) {
    return "Choose a PDF or DOCX file first.";
  }

  if (!/\.(pdf|docx)$/i.test(file.name)) {
    return "Choose a PDF or DOCX file.";
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return "The selected file exceeds the 10 MB limit.";
  }

  return "";
}

export default function UploadBox({ error, isUploading, onUpload, resetKey }) {
  const inputId = useId();
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    setFile(null);
    setLocalError("");
  }, [resetKey]);

  function chooseFile(nextFile) {
    const validationError = getFileError(nextFile);
    setLocalError(validationError);
    setFile(validationError ? null : nextFile);
  }

  async function submit(event) {
    event.preventDefault();
    const validationError = getFileError(file);

    if (validationError) {
      setLocalError(validationError);
      return;
    }

    const uploaded = await onUpload(file);
    if (uploaded) {
      setFile(null);
    }
  }

  return (
    <form className="w-full" onSubmit={submit}>
      <div
        className={`rounded-[1.7rem] border bg-white p-3 shadow-[0_24px_70px_rgba(72,52,96,0.12)] transition sm:p-4 ${
          isDragging
            ? "border-[#8967d4] ring-4 ring-[#8967d4]/10"
            : "border-[#ddd7e3]"
        }`}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsDragging(false);
          }
        }}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          chooseFile(event.dataTransfer.files?.[0] ?? null);
        }}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label
            className="flex min-w-0 flex-1 cursor-pointer items-center gap-4 rounded-2xl px-3 py-3 transition hover:bg-[#faf8fd] sm:px-4"
            htmlFor={inputId}
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#eee8ff] text-[#6740bf]">
              <UploadIcon />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold text-[#2f2935] sm:text-base">
                {file ? file.name : "Drop your contract here or click to upload"}
              </span>
              <span className="mt-1 block text-xs leading-5 text-[#8b8492] sm:text-sm">
                {file
                  ? `${(file.size / 1024).toFixed(1)} KB selected`
                  : "PDF or DOCX, up to 10 MB"}
              </span>
            </span>
            <input
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="sr-only"
              disabled={isUploading}
              id={inputId}
              onChange={(event) => chooseFile(event.target.files?.[0] ?? null)}
              type="file"
            />
          </label>

          <button
            className="shrink-0 rounded-2xl bg-[#211a2b] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#382b47] disabled:cursor-not-allowed disabled:opacity-45"
            disabled={!file || isUploading}
            type="submit"
          >
            {isUploading ? "Uploading…" : "Review contract"}
          </button>
        </div>
      </div>

      {(localError || error) && (
        <p className="mt-3 rounded-xl border border-[#efc9ce] bg-[#fff5f6] px-4 py-3 text-sm text-[#a64451]" role="alert">
          {localError || error}
        </p>
      )}
    </form>
  );
}
