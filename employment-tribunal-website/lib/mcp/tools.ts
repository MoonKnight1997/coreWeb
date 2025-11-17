import { DocumentType } from '@/types/agent';

// Mock implementations of MCP tools
// In production, these would call actual MCP tools via the Anthropic SDK

export interface DocumentTemplate {
  type: DocumentType;
  template: string;
  guidelines: string[];
}

export async function getDocumentTemplate(documentType: DocumentType): Promise<DocumentTemplate> {
  const templates: Record<DocumentType, DocumentTemplate> = {
    et1: {
      type: 'et1',
      template: 'ET1 Claim Form Template',
      guidelines: [
        'Keep to 10 pages maximum',
        'Include specific dates in DD/MM/YYYY format',
        'Clearly identify claimant and respondent',
        'State all legal bases for claims',
        'Include specific facts supporting each claim',
        'Reference documentary evidence where available'
      ]
    },
    witness_statement: {
      type: 'witness_statement',
      template: 'Witness Statement Template',
      guidelines: [
        'Write in first person',
        'Number all paragraphs',
        'Include statement of truth',
        'Reference evidence as B/123 format',
        'Maintain chronological order',
        'Include only facts, not opinions or legal arguments'
      ]
    },
    chronology: {
      type: 'chronology',
      template: 'Chronology Template',
      guidelines: [
        'Use DD/MM/YYYY date format consistently',
        'List events in chronological order',
        'Include brief description for each event',
        'Reference supporting evidence',
        'Highlight key dates',
        'Keep descriptions concise'
      ]
    },
    schedule_of_loss: {
      type: 'schedule_of_loss',
      template: 'Schedule of Loss Template',
      guidelines: [
        'Separate past and future losses',
        'Show all calculations clearly',
        'Include evidence for each loss claimed',
        'Consider pension loss',
        'Include injury to feelings if applicable',
        'Show deductions (e.g., mitigation)'
      ]
    },
    list_of_issues: {
      type: 'list_of_issues',
      template: 'List of Issues Template',
      guidelines: [
        'Frame as questions for tribunal',
        'Group by claim type',
        'Follow logical order',
        'Include all legal tests',
        'Cover jurisdiction issues first',
        'Address remedy separately'
      ]
    },
    position_statement: {
      type: 'position_statement',
      template: 'Position Statement Template',
      guidelines: [
        'Structure with clear headings',
        'Address each issue separately',
        'Cite relevant case law',
        'Reference evidence throughout',
        'Include legal submissions',
        'Conclude with remedy sought'
      ]
    }
  };

  return templates[documentType];
}

export interface ValidationResult {
  isValid: boolean;
  issues: Array<{
    severity: 'error' | 'warning' | 'info';
    message: string;
    location?: string;
  }>;
  score: number;
}

export async function validateDocument(
  documentType: DocumentType,
  content: string
): Promise<ValidationResult> {
  const issues: ValidationResult['issues'] = [];

  // Check length
  const wordCount = content.split(/\s+/).length;
  if (documentType === 'et1' && wordCount > 3000) {
    issues.push({
      severity: 'warning',
      message: 'ET1 appears lengthy. Consider keeping to 10 pages maximum.',
      location: 'overall'
    });
  }

  // Check for dates
  if (!content.match(/\d{1,2}\/\d{1,2}\/\d{4}/)) {
    issues.push({
      severity: 'warning',
      message: 'No dates found in DD/MM/YYYY format',
      location: 'overall'
    });
  }

  // Check for evidence references
  if (documentType === 'witness_statement' || documentType === 'chronology') {
    if (!content.match(/[A-Z]\/\d+/)) {
      issues.push({
        severity: 'info',
        message: 'Consider adding bundle references (e.g., B/123)',
        location: 'overall'
      });
    }
  }

  // Check for statement of truth
  if (documentType === 'witness_statement') {
    if (!content.toLowerCase().includes('statement of truth')) {
      issues.push({
        severity: 'error',
        message: 'Missing statement of truth',
        location: 'end'
      });
    }
  }

  const score = Math.max(0, 100 - issues.length * 10);

  return {
    isValid: !issues.some(i => i.severity === 'error'),
    issues,
    score
  };
}

export async function formatEvidenceReference(
  bundleLetter: string,
  pageNumber: number,
  description?: string
): Promise<string> {
  const reference = `${bundleLetter.toUpperCase()}/${pageNumber}`;
  return description ? `${description} (${reference})` : reference;
}

export interface ChronologyEvent {
  date: string;
  description: string;
  evidence?: string;
}

export async function organizeChronology(
  events: ChronologyEvent[]
): Promise<ChronologyEvent[]> {
  // Parse and sort events by date
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = parseDateString(a.date);
    const dateB = parseDateString(b.date);
    return dateA.getTime() - dateB.getTime();
  });

  return sortedEvents;
}

function parseDateString(dateStr: string): Date {
  // Handle DD/MM/YYYY format
  const match = dateStr.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (match) {
    const [, day, month, year] = match;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }
  // Fallback to Date parsing
  return new Date(dateStr);
}

export interface LossCalculation {
  loss_type: string;
  amount: number;
  calculation: string;
  details: string;
}

export async function calculateLoss(
  lossType: string,
  baseAmount: number,
  periodMonths?: number,
  details?: string
): Promise<LossCalculation> {
  let amount = baseAmount;
  let calculation = '';

  if (periodMonths) {
    amount = baseAmount * periodMonths;
    calculation = `£${baseAmount.toFixed(2)} × ${periodMonths} months = £${amount.toFixed(2)}`;
  } else {
    calculation = `£${amount.toFixed(2)}`;
  }

  return {
    loss_type: lossType,
    amount,
    calculation,
    details: details || ''
  };
}

export interface LegalTestCheck {
  claim_type: string;
  elements_addressed: string[];
  elements_missing: string[];
  suggestions: string[];
}

export async function checkLegalTest(
  claimType: string,
  elements: string[]
): Promise<LegalTestCheck> {
  const requiredElements: Record<string, string[]> = {
    unfair_dismissal: [
      'Employee status',
      'Qualifying period (2 years)',
      'Dismissal occurred',
      'Reason for dismissal',
      'Procedural fairness',
      'Substantive fairness'
    ],
    discrimination: [
      'Protected characteristic',
      'Less favourable treatment',
      'Comparator',
      'Causation link',
      'No justification',
      'Time limits'
    ],
    harassment: [
      'Unwanted conduct',
      'Related to protected characteristic',
      'Purpose or effect of violating dignity',
      'Creating intimidating/hostile environment'
    ]
  };

  const required = requiredElements[claimType] || [];
  const elementsLower = elements.map(e => e.toLowerCase());
  const addressed = required.filter(r =>
    elementsLower.some(e => e.includes(r.toLowerCase()))
  );
  const missing = required.filter(r =>
    !elementsLower.some(e => e.includes(r.toLowerCase()))
  );

  const suggestions = missing.map(m => `Consider addressing: ${m}`);

  return {
    claim_type: claimType,
    elements_addressed: addressed,
    elements_missing: missing,
    suggestions
  };
}
