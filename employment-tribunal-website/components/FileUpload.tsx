'use client';

import { useState, useCallback } from 'react';
import { Upload, File, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { validateFile } from '@/lib/validators/file-validator';
import { formatFileSize } from '@/lib/utils';
import { FILE_UPLOAD_CONFIG } from '@/lib/constants';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  selectedFile: File | null;
  disabled?: boolean;
}

export function FileUpload({
  onFileSelect,
  onFileRemove,
  selectedFile,
  disabled = false,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleFile = useCallback(
    (file: File) => {
      setErrors([]);
      const validation = validateFile(file);

      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }

      if (validation.warnings.length > 0) {
        console.warn('File validation warnings:', validation.warnings);
      }

      onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled) return;

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile, disabled]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  return (
    <div className="space-y-4">
      {!selectedFile ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            upload-zone
            ${isDragging ? 'upload-zone-active' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept={FILE_UPLOAD_CONFIG.allowedTypes.join(',')}
            onChange={handleFileInput}
            disabled={disabled}
          />

          <label
            htmlFor="file-upload"
            className={`flex flex-col items-center ${
              disabled ? 'cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            <Upload className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">
              Drop your file here or click to browse
            </p>
            <p className="text-sm text-muted-foreground text-center">
              Supported formats: {FILE_UPLOAD_CONFIG.allowedTypes.join(', ')}
              <br />
              Maximum file size: {FILE_UPLOAD_CONFIG.maxSize / (1024 * 1024)}MB
            </p>
          </label>
        </div>
      ) : (
        <div className="border border-border rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded">
                <File className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onFileRemove}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove file</span>
            </Button>
          </div>
        </div>
      )}

      {errors.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-sm text-destructive mb-1">
                File validation errors:
              </p>
              <ul className="text-sm text-destructive space-y-1 list-disc list-inside">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
