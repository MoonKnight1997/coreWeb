import { DocumentType } from './agent';

export interface UploadResponse {
  success: boolean;
  fileId: string;
  fileName: string;
  fileSize: number;
  detectedDocumentType?: DocumentType;
  error?: string;
}

export interface ProcessRequest {
  fileId: string;
  documentType: DocumentType;
  caseDetails?: string;
  options?: ProcessingOptions;
}

export interface ProcessingOptions {
  includeValidation?: boolean;
  includeSuggestions?: boolean;
  outputFormat?: 'text' | 'markdown' | 'html';
}

export interface ProcessResponse {
  success: boolean;
  documentType: DocumentType;
  content: string;
  validationResults?: {
    isValid: boolean;
    issues: Array<{
      severity: 'error' | 'warning' | 'info';
      message: string;
      location?: string;
    }>;
  };
  suggestions?: string[];
  downloadUrl?: string;
  error?: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}
