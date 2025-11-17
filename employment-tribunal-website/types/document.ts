export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  content?: string;
}

export interface CaseInformation {
  claimantName?: string;
  respondentName?: string;
  caseNumber?: string;
  claimType?: string[];
  incidentDate?: string;
  employmentStartDate?: string;
  employmentEndDate?: string;
  additionalNotes?: string;
}

export interface DocumentTemplate {
  type: string;
  template: string;
  guidelines: string[];
  examples?: string[];
}

export interface EvidenceReference {
  bundleReference: string;
  description: string;
  pageNumber?: number;
}

export interface ChronologyEvent {
  date: string;
  description: string;
  evidenceReferences?: string[];
  significance?: string;
}

export interface LossCalculation {
  category: string;
  amount: number;
  calculation: string;
  evidence?: string[];
  timeframe?: string;
}
