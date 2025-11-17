import { DocumentType } from '@/types/agent';

export interface ContentValidationResult {
  isValid: boolean;
  documentType?: DocumentType;
  confidence: number;
  issues: string[];
}

export function detectDocumentType(content: string): ContentValidationResult {
  const issues: string[] = [];
  let detectedType: DocumentType | undefined;
  let confidence = 0;

  const lowercaseContent = content.toLowerCase();

  // ET1 Detection
  if (
    lowercaseContent.includes('et1') ||
    lowercaseContent.includes('claim form') ||
    lowercaseContent.includes('employment tribunal') ||
    (lowercaseContent.includes('claimant') && lowercaseContent.includes('respondent'))
  ) {
    detectedType = 'et1';
    confidence = 0.8;
  }

  // Witness Statement Detection
  if (
    lowercaseContent.includes('witness statement') ||
    lowercaseContent.includes('statement of truth') ||
    (lowercaseContent.includes('i,') && lowercaseContent.includes('state'))
  ) {
    detectedType = 'witness_statement';
    confidence = 0.85;
  }

  // Chronology Detection
  if (
    lowercaseContent.includes('chronology') ||
    lowercaseContent.includes('timeline') ||
    /\d{1,2}\/\d{1,2}\/\d{4}/.test(content)
  ) {
    if (!detectedType) {
      detectedType = 'chronology';
      confidence = 0.7;
    }
  }

  // Schedule of Loss Detection
  if (
    lowercaseContent.includes('schedule of loss') ||
    lowercaseContent.includes('financial loss') ||
    (lowercaseContent.includes('loss') && /£[\d,]+/.test(content))
  ) {
    detectedType = 'schedule_of_loss';
    confidence = 0.75;
  }

  // List of Issues Detection
  if (
    lowercaseContent.includes('list of issues') ||
    lowercaseContent.includes('issues for determination') ||
    lowercaseContent.includes('tribunal to determine')
  ) {
    detectedType = 'list_of_issues';
    confidence = 0.8;
  }

  // Position Statement Detection
  if (
    lowercaseContent.includes('position statement') ||
    lowercaseContent.includes('legal submissions') ||
    (lowercaseContent.includes('case law') && lowercaseContent.includes('submissions'))
  ) {
    detectedType = 'position_statement';
    confidence = 0.75;
  }

  if (!detectedType) {
    issues.push('Could not automatically detect document type');
    confidence = 0;
  }

  if (content.length < 100) {
    issues.push('Document content appears too short');
  }

  return {
    isValid: detectedType !== undefined,
    documentType: detectedType,
    confidence,
    issues
  };
}

export function validateDocumentStructure(content: string, documentType: DocumentType): ContentValidationResult {
  const issues: string[] = [];
  let isValid = true;

  switch (documentType) {
    case 'et1':
      if (!content.includes('Claimant') && !content.includes('claimant')) {
        issues.push('Missing claimant information');
        isValid = false;
      }
      if (!content.includes('Respondent') && !content.includes('respondent')) {
        issues.push('Missing respondent information');
        isValid = false;
      }
      break;

    case 'witness_statement':
      if (!content.toLowerCase().includes('statement of truth')) {
        issues.push('Missing statement of truth');
      }
      break;

    case 'chronology':
      if (!/\d{1,2}\/\d{1,2}\/\d{4}/.test(content)) {
        issues.push('No dates found in chronology');
        isValid = false;
      }
      break;

    case 'schedule_of_loss':
      if (!/£[\d,]+/.test(content)) {
        issues.push('No monetary amounts found');
      }
      break;
  }

  return {
    isValid,
    documentType,
    confidence: isValid ? 1.0 : 0.5,
    issues
  };
}
