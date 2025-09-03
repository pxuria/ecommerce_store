"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { IoCloseCircle } from "react-icons/io5";
import { FileWithPreview } from "@/types";

interface ImageUploadingProps {
  setValue: (value: FileWithPreview[] | FileWithPreview | string[] | string | null) => void;
  setFiles: (file: FileWithPreview[] | FileWithPreview | null) => void;
  files: FileWithPreview[] | FileWithPreview | null;
  existingImageUrls?: string[] | string | null;
  setExistingImageUrls?: (val: string[] | string | null) => void;
  className?: string;
  disabled: boolean;
  multiple?: boolean;
}

const ImageUploading = ({
  setValue,
  disabled,
  files,
  setFiles,
  existingImageUrls,
  setExistingImageUrls,
  className = '',
  multiple = false
}: ImageUploadingProps) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    multiple,
    disabled,
    onDrop: (acceptedFiles) => {
      const mapped = acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      ) as FileWithPreview[];

      if (multiple) {
        const prevFiles = Array.isArray(files) ? files : files ? [files] : [];
        const updated = [...prevFiles, ...mapped];
        setFiles(updated);
        setValue(updated);
      } else {
        const file = mapped[0];
        setFiles(file);
        setValue(file);
      }
    },
    // onDrop: (acceptedFiles) => {
    //   const selected = acceptedFiles[0];
    //   if (selected) {
    //     const fileWithPreview = Object.assign(selected, {
    //       preview: URL.createObjectURL(selected),
    //     });
    //     setFile(fileWithPreview);
    //     setValue(fileWithPreview);
    //   }
    // },
  });

  // Remove image from preview
  const removeFile = (index?: number) => {
    if (disabled) return;

    if (multiple) {
      const arr = Array.isArray(files) ? files : [];
      if (index !== undefined && arr[index]) {
        URL.revokeObjectURL(arr[index].preview);
        const updated = arr.filter((_, i) => i !== index);
        setFiles(updated.length ? updated : null);
        setValue(updated.length ? updated : null);

        if (setExistingImageUrls && Array.isArray(existingImageUrls)) {
          const updatedUrls = existingImageUrls.filter((_, i) => i !== index);
          setExistingImageUrls(updatedUrls.length ? updatedUrls : null);
        }
      }
    } else {
      if (files && !Array.isArray(files)) {
        URL.revokeObjectURL(files.preview);
      }
      setFiles(null);
      setValue(null);
      if (setExistingImageUrls) setExistingImageUrls(null);
    }

    // if (file) URL.revokeObjectURL(file.preview);
    // setFile(null);
    // setValue("");
    // if (setExistingImageUrl) setExistingImageUrl(null);
  };

  useEffect(() => {
    return () => {
      if (multiple && Array.isArray(files)) {
        files.forEach((f) => URL.revokeObjectURL(f.preview));
      } else if (files && !Array.isArray(files)) {
        URL.revokeObjectURL(files.preview);
      }
    };
  }, [files, multiple]);

  const previews = multiple
    ? [
      ...(Array.isArray(files) ? files : []),
      ...(Array.isArray(existingImageUrls) ? existingImageUrls : []),
    ]
    : [
      ...(files && !Array.isArray(files) ? [files] : []),
      ...(existingImageUrls && !Array.isArray(existingImageUrls)
        ? [existingImageUrls]
        : []),
    ];

  return (
    <div className={`mt-2 ${className}`}>
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
            : multiple
              ? "Drag & drop images here, or click to select multiple"
              : "Drag & drop an image here, or click to select"}
        </p>
      </div>

      {/* Preview */}
      <aside className="flex flex-wrap mt-4">
        {previews.map((img, index) => (
          <div
            key={index}
            className="relative m-4 w-24 h-24 border rounded-md overflow-hidden"
          >
            <Image
              src={typeof img === "string" ? img : img.preview}
              alt={`preview-${index}`}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-md"
            />

            {!disabled && (
              <IoCloseCircle
                onClick={() => removeFile(index)}
                className="text-red-600 bg-white rounded-full w-6 h-6 absolute top-0 right-0 hover:text-red-700 transition cursor-pointer"
              />
            )}
          </div>
        ))}
        {/* {(files || existingImageUrls) && (
          <div className="relative m-4 w-24 h-24 border rounded-md overflow-hidden">
            <Image
              src={files ? file.preview : (existingImageUrls as string)}
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
        )} */}
      </aside>
    </div>
  );
};

export default ImageUploading;
