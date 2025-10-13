import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { formatSize } from "../lib/utils";

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
  const [file, setFile] = React.useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0] || null;
      onFileSelect?.(file);
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (file) => {
      const selectedFile = file[0] || null;
      setFile(selectedFile);
      onFileSelect?.(selectedFile);
    },
    multiple: false,
    accept: { "application/pdf": [".pdf"] },
    maxSize: 1024 * 1024 * 20,
    disabled: !!file,
  });

  return (
    <div
      {...getRootProps()}
      className={`w-full gradient-border ${file ? "cursor-auto" : "cursor-pointer"}`}
    >
      <input {...getInputProps()} />

      {file ? (
        <div
          className="uploader-selected-file cursor-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <img src="/images/pdf.png" alt="pdf" className="w-10 h-10" />
          <div>
            <p className="font-semibold text-gray-500 text-md">{file.name}</p>
            <p className="text-gray-600 text-xs">
              Size: {formatSize(file.size)}
            </p>
          </div>
          <button>
            <img
              src="/icons/cross.svg"
              alt="remove"
              className="size-3 mr-2 cursor-pointer"
              onClick={() => {
                onFileSelect?.(null);
                setFile(null);
              }}
            />
          </button>
        </div>
      ) : (
        <div>
          <div className="space-y-4 cursor-pointer flex flex-col items-center justify-center">
            <img src="/icons/info.svg" alt="info" className="w-16 h-16" />
          </div>
          <p>
            <span className="font-semibold text-amber-500 text-lg">
              Click to upload
            </span>{" "}
            or drag and drop files
          </p>
          <p className="font-semibold text-gray-500 text-md">PDF (Max 20 MB)</p>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
