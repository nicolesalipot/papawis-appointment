import { useState, useRef } from "react";
import { Upload, X, Image, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

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
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 transition-colors",
          dragActive
            ? "border-primary bg-primary/10"
            : "border-border hover:border-primary/50",
          images.length >= maxImages
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer"
        )}
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
            className={cn(
              "mx-auto h-12 w-12",
              dragActive ? "text-primary" : "text-muted-foreground"
            )}
          />
          <div className="mt-4">
            <p className="text-sm font-medium text-foreground">
              {images.length >= maxImages
                ? `Maximum ${maxImages} images reached`
                : "Drop images here or click to browse"}
            </p>
            {images.length < maxImages && (
              <p className="text-xs text-muted-foreground mt-1">
                Supports JPG, PNG, WebP up to{" "}
                {(maxSizeBytes / 1024 / 1024).toFixed(0)}MB each
              </p>
            )}
          </div>
        </div>

        {dragActive && (
          <div className="absolute inset-0 bg-primary/10 rounded-lg flex items-center justify-center">
            <p className="text-primary font-medium">Drop images here</p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">
            Uploaded Images ({images.length}/{maxImages})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                  <img
                    src={getImagePreview(file)}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </Button>
                <div className="mt-2">
                  <p
                    className="text-xs text-foreground truncate"
                    title={file.name}
                  >
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
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
          <Image className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mt-2">
            No images uploaded yet. Add some images to showcase your facility.
          </p>
        </div>
      )}
    </div>
  );
}
