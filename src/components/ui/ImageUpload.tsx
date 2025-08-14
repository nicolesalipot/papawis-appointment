import { useState, useRef } from "react";
import { Upload, X, Image, Trash2 } from "lucide-react";

interface ImageUploadProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
  maxImages?: number;
  acceptedTypes?: string[];
  maxSizeBytes?: number;
}

export function ImageUpload({
  images,
  onImagesChange,
  maxImages = 5,
  acceptedTypes = ["image/jpeg", "image/png", "image/webp"],
  maxSizeBytes = 5 * 1024 * 1024, // 5MB
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `File type ${
        file.type
      } is not supported. Please use ${acceptedTypes.join(", ")}.`;
    }
    if (file.size > maxSizeBytes) {
      return `File size (${(file.size / 1024 / 1024).toFixed(
        1
      )}MB) exceeds the maximum allowed size (${(
        maxSizeBytes /
        1024 /
        1024
      ).toFixed(1)}MB).`;
    }
    return null;
  };

  const handleFiles = (fileList: FileList) => {
    setError(null);
    const files = Array.from(fileList);

    // Check if adding these files would exceed the limit
    if (images.length + files.length > maxImages) {
      setError(
        `Cannot upload more than ${maxImages} images. Current: ${images.length}, trying to add: ${files.length}`
      );
      return;
    }

    // Validate each file
    const validFiles: File[] = [];
    for (const file of files) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      validFiles.push(file);
    }

    // Add new files to existing images
    onImagesChange([...images, ...validFiles]);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  };

  const handleDragOut = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
    setError(null);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const getImagePreview = (file: File): string => {
    return URL.createObjectURL(file);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-slate-300 hover:border-slate-400"
        } ${
          images.length >= maxImages
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer"
        }`}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={images.length < maxImages ? openFileDialog : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(",")}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={images.length >= maxImages}
        />

        <div className="text-center">
          <Upload
            className={`mx-auto h-12 w-12 ${
              dragActive ? "text-blue-500" : "text-slate-400"
            }`}
          />
          <div className="mt-4">
            <p className="text-sm font-medium text-slate-900">
              {images.length >= maxImages
                ? `Maximum ${maxImages} images reached`
                : "Drop images here or click to browse"}
            </p>
            {images.length < maxImages && (
              <p className="text-xs text-slate-500 mt-1">
                Supports JPG, PNG, WebP up to{" "}
                {(maxSizeBytes / 1024 / 1024).toFixed(0)}MB each
              </p>
            )}
          </div>
        </div>

        {dragActive && (
          <div className="absolute inset-0 bg-blue-500 bg-opacity-10 rounded-lg flex items-center justify-center">
            <p className="text-blue-700 font-medium">Drop images here</p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-900">
            Uploaded Images ({images.length}/{maxImages})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-slate-100">
                  <img
                    src={getImagePreview(file)}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
                <div className="mt-2">
                  <p
                    className="text-xs text-slate-600 truncate"
                    title={file.name}
                  >
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {(file.size / 1024 / 1024).toFixed(1)}MB
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Instructions */}
      {images.length === 0 && (
        <div className="text-center py-4">
          <Image className="mx-auto h-8 w-8 text-slate-400" />
          <p className="text-sm text-slate-500 mt-2">
            No images uploaded yet. Add some images to showcase your facility.
          </p>
        </div>
      )}
    </div>
  );
}
