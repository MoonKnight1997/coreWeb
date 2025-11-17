import { FILE_UPLOAD_CONFIG } from '../constants';

export interface FileValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateFile(file: File): FileValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check file size
  if (file.size > FILE_UPLOAD_CONFIG.maxSize) {
    errors.push(`File size exceeds maximum of ${FILE_UPLOAD_CONFIG.maxSize / (1024 * 1024)}MB`);
  }

  if (file.size === 0) {
    errors.push('File is empty');
  }

  // Check file type by extension
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!FILE_UPLOAD_CONFIG.allowedTypes.includes(fileExtension)) {
    errors.push(`File type ${fileExtension} not allowed. Allowed types: ${FILE_UPLOAD_CONFIG.allowedTypes.join(', ')}`);
  }

  // Check MIME type
  if (!FILE_UPLOAD_CONFIG.allowedMimeTypes.includes(file.type)) {
    warnings.push('File MIME type may not be supported');
  }

  // Check for potentially dangerous file names
  if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
    errors.push('Invalid file name');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-z0-9._-]/gi, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 255);
}

export function getFileExtension(fileName: string): string {
  return fileName.slice(((fileName.lastIndexOf('.') - 1) >>> 0) + 2);
}

export function isAllowedFileType(fileName: string, mimeType: string): boolean {
  const extension = '.' + getFileExtension(fileName).toLowerCase();
  return FILE_UPLOAD_CONFIG.allowedTypes.includes(extension) &&
         FILE_UPLOAD_CONFIG.allowedMimeTypes.includes(mimeType);
}
