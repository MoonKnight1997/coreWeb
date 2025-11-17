import { DOCUMENT_TYPES } from '@/lib/constants';

export type DocumentType = typeof DOCUMENT_TYPES[keyof typeof DOCUMENT_TYPES];

export interface Agent {
  id: string;
  name: string;
  description: string;
  icon: string;
  capabilities: string[];
}

export interface ProcessingStatus {
  stage: 'idle' | 'uploading' | 'validating' | 'processing' | 'complete' | 'error';
  progress: number;
  message: string;
  error?: string;
}

export interface DocumentProcessingResult {
  success: boolean;
  documentType: DocumentType;
  content: string;
  validationResults?: ValidationResult;
  suggestions?: string[];
  error?: string;
}

export interface ValidationResult {
  isValid: boolean;
  issues: ValidationIssue[];
  warnings: ValidationWarning[];
}

export interface ValidationIssue {
  severity: 'error' | 'warning' | 'info';
  message: string;
  location?: string;
}

export interface ValidationWarning {
  message: string;
  suggestion?: string;
}
