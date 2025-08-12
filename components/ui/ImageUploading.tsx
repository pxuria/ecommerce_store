"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { IoCloseCircle } from "react-icons/io5";
import { FileWithPreview } from "@/types";

interface ImageUploadingProps {
  setValue: (value: FileWithPreview | string) => void;
  setFile: (file: FileWithPreview | null) => void;
  file: FileWithPreview | null;
  existingImageUrl?: string | null;
  setExistingImageUrl?: (val: null | string) => void;
  disabled: boolean;
}

const ImageUploading = ({
  setValue,
  disabled,
  file,
  setFile,
  existingImageUrl,
  setExistingImageUrl
}: ImageUploadingProps) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    disabled,
    onDrop: (acceptedFiles) => {
      const selected = acceptedFiles[0];
      if (selected) {
        const fileWithPreview = Object.assign(selected, {
          preview: URL.createObjectURL(selected),
        });
        setFile(fileWithPreview);
        setValue(fileWithPreview);
      }
    },
  });

  // Remove image from preview
  const removeFile = () => {
    if (disabled) return;
    if (file) URL.revokeObjectURL(file.preview);
    setFile(null);
    setValue("");
    if (setExistingImageUrl) setExistingImageUrl(null);
  };

  useEffect(() => {
    return () => {
      if (file) URL.revokeObjectURL(file.preview);
    };
  }, [file]);

  return (
    <div className="mt-2">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-6 text-center transition-all ${disabled
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
        {(file || existingImageUrl) && (
          <div className="relative m-4 w-24 h-24 border rounded-md overflow-hidden">
            <Image
              src={file ? file.preview : (existingImageUrl as string)}
              alt="preview"
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />

            {!disabled && (
              <IoCloseCircle
                onClick={removeFile}
                className="text-red-600 bg-white p-0 rounded-full w-6 h-6 absolute top-0 right-0 hover:text-red-700 transition cursor-pointer"
              />
            )}
          </div>
        )}
      </aside>
    </div>
  );
};

export default ImageUploading;
