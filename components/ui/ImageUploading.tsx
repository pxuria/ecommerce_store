"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { IoCloseCircle } from "react-icons/io5";
import { FileWithPreview } from "@/types";

interface ImageUploadingProps {
  setValue: (value: FileWithPreview[]) => void;
  disabled: boolean;
}

const ImageUploading = ({ setValue, disabled }: ImageUploadingProps) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    multiple: true,
    disabled,
    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      );
      setFiles((prevFiles) => {
        const updatedFiles = [...prevFiles, ...newFiles];
        setValue(updatedFiles);
        return updatedFiles;
      });
    },
  });

  // Remove image from preview
  const removeFile = (fileName: string) => {
    if (disabled) return;

    setFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((file) => file.name !== fileName);
      setValue(updatedFiles); // Update the form when removing an image
      return updatedFiles;
    });
  };

  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <div className="w-full mt-8">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-6 text-center transition-all ${
          disabled
            ? "border-gray-200 bg-gray-100 cursor-not-allowed"
            : "border-gray-300 cursor-pointer hover:border-gray-500"
        }`}
      >
        <input {...getInputProps()} />
        <p className={`${disabled ? "text-gray-400" : "text-gray-600"}`}>
          {disabled
            ? "Upload disabled..."
            : "Drag & drop some images here, or click to select"}
        </p>
      </div>

      {/* Preview Thumbnails */}
      <aside className="flex flex-wrap mt-4">
        {files.map((file) => (
          <div
            key={file.name}
            className="relative m-2 w-24 h-24 border rounded-md overflow-hidden"
          >
            <Image
              src={file.preview}
              alt="preview"
              layout="fill"
              objectFit="cover"
              className="rounded-md"
              onLoad={() => URL.revokeObjectURL(file.preview)}
            />

            {!disabled && (
              <IoCloseCircle
                onClick={() => removeFile(file.name)}
                className="text-red-600 bg-white p-0 rounded-full w-6 h-6 absolute top-0 right-0 hover:text-red-700 transition cursor-pointer"
              />
            )}
          </div>
        ))}
      </aside>
    </div>
  );
};

export default ImageUploading;
