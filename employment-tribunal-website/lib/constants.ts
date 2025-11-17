export const AGENTS = {
  ET1: {
    id: 'et1',
    name: 'ET1 Agent',
    description: 'Expert in ET1 claim forms, jurisdiction requirements, and legal bases for tribunal claims',
    icon: '📋',
    capabilities: [
      'Drafts comprehensive ET1 claim forms',
      'Ensures proper jurisdiction and time limits',
      'Identifies all relevant legal bases',
      'Structures claims with proper detail'
    ]
  },
  WITNESS_STATEMENT: {
    id: 'witness_statement',
    name: 'Witness Statement Agent',
    description: 'Specialist in creating first-person narrative witness statements with proper evidence references',
    icon: '📝',
    capabilities: [
      'Creates compelling first-person narratives',
      'Includes proper statement of truth',
      'References documentary evidence (B/123 format)',
      'Maintains chronological flow'
    ]
  },
  CHRONOLOGY: {
    id: 'chronology',
    name: 'Chronology Agent',
    description: 'Expert in organizing events into clear timelines with evidence references',
    icon: '📅',
    capabilities: [
      'Organizes events chronologically',
      'Identifies key dates and milestones',
      'Links each event to evidence',
      'Maintains clear date formatting (DD/MM/YYYY)'
    ]
  },
  SCHEDULE_OF_LOSS: {
    id: 'schedule_of_loss',
    name: 'Schedule of Loss Agent',
    description: 'Specialist in calculating financial losses and remedies with proper documentation',
    icon: '💰',
    capabilities: [
      'Calculates past financial losses',
      'Projects future losses',
      'Includes all relevant loss categories',
      'Provides detailed calculations with evidence'
    ]
  },
  LIST_OF_ISSUES: {
    id: 'list_of_issues',
    name: 'List of Issues Agent',
    description: 'Expert in identifying and structuring legal issues for tribunal consideration',
    icon: '📑',
    capabilities: [
      'Identifies all legal questions',
      'Structures issues logically',
      'Links to legal tests and frameworks',
      'Ensures comprehensive coverage'
    ]
  },
  POSITION_STATEMENT: {
    id: 'position_statement',
    name: 'Position Statement Agent',
    description: 'Specialist in legal advocacy and argument synthesis for tribunal hearings',
    icon: '⚖️',
    capabilities: [
      'Develops legal arguments',
      'Cites relevant case law',
      'Synthesizes evidence and facts',
      'Presents compelling advocacy'
    ]
  }
} as const;

export const DOCUMENT_TYPES = {
  ET1: 'et1',
  WITNESS_STATEMENT: 'witness_statement',
  CHRONOLOGY: 'chronology',
  SCHEDULE_OF_LOSS: 'schedule_of_loss',
  LIST_OF_ISSUES: 'list_of_issues',
  POSITION_STATEMENT: 'position_statement'
} as const;

export const FILE_UPLOAD_CONFIG = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['.pdf', '.docx', '.txt', '.doc'],
  allowedMimeTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ]
};

export const LEGAL_DISCLAIMER = `IMPORTANT LEGAL NOTICE

This is NOT legal advice, legal representation, or a legal service. This tool provides AI-assisted document preparation only.

• We are NOT solicitors, barristers, or regulated legal professionals
• We are NOT regulated by the Solicitors Regulation Authority (SRA) or Bar Standards Board (BSB)
• Using this service does NOT create a solicitor-client relationship
• This service is provided for informational purposes only
• You should seek advice from a qualified solicitor for your specific situation

JURISDICTION: This tool is designed for Employment Tribunal matters in England & Wales only.

LIABILITY: We provide this service "as is" without warranties. We are not liable for any errors, omissions, or outcomes resulting from use of this tool.

DATA: We process your uploaded documents temporarily to provide this service. Files are deleted immediately after processing. See our Privacy Policy for details.`;

export const CONSENT_ITEMS = [
  {
    id: 'not-legal-advice',
    label: 'I understand this is not legal advice and I should consult a solicitor for my specific situation'
  },
  {
    id: 'not-regulated',
    label: 'I understand this service is not provided by regulated legal professionals'
  },
  {
    id: 'no-relationship',
    label: 'I acknowledge that using this tool does not create a solicitor-client relationship'
  },
  {
    id: 'terms',
    label: 'I have read and agree to the Terms of Service'
  },
  {
    id: 'privacy',
    label: 'I have read and understand the Privacy Policy'
  },
  {
    id: 'data-processing',
    label: 'I consent to my uploaded document being processed temporarily to provide this service'
  }
] as const;

export const PROCESS_STEPS = [
  {
    number: 1,
    title: 'Upload Your Documents',
    description: 'Upload your employment-related documents or information about your case',
    icon: '📤'
  },
  {
    number: 2,
    title: 'Select Agent Type',
    description: 'Choose the specialist agent or let our system detect the best match',
    icon: '🤖'
  },
  {
    number: 3,
    title: 'AI Processing',
    description: 'Our specialized agent processes your documents using advanced legal knowledge',
    icon: '⚡'
  },
  {
    number: 4,
    title: 'Download Results',
    description: 'Receive your professionally formatted tribunal document ready for submission',
    icon: '✅'
  }
] as const;
