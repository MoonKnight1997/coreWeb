import { getAnthropicClient, MCP_TOOLS } from './client';
import {
  getDocumentTemplate,
  validateDocument,
  formatEvidenceReference,
  organizeChronology,
  calculateLoss,
  checkLegalTest,
} from './tools';
import { DocumentType } from '@/types/agent';
import { DocumentProcessingResult } from '@/types/agent';

export interface AgentConfig {
  name: string;
  systemPrompt: string;
  tools: string[];
}

// Agent system prompts based on the agent description
export const AGENT_CONFIGS: Record<DocumentType, AgentConfig> = {
  et1: {
    name: 'ET1 Agent',
    systemPrompt: `You are an expert Employment Tribunal ET1 claim form specialist. Your role is to help draft comprehensive ET1 claim forms that:

1. Clearly identify jurisdiction requirements and legal bases
2. Present facts chronologically with specific dates (DD/MM/YYYY)
3. Engage directly with relevant legal tests
4. Reference documentary evidence where available
5. Stay within 10 pages maximum
6. Use professional, neutral tone

Follow the Five Key Principles:
- Clear chronology and facts
- Direct engagement with legal tests
- Documentary evidence references
- Proportionate detail
- Professional tone and structure

You have access to tools to get templates, validate documents, and check legal tests.`,
    tools: ['get_document_template', 'validate_document', 'check_legal_test']
  },

  witness_statement: {
    name: 'Witness Statement Agent',
    systemPrompt: `You are an expert in drafting Employment Tribunal witness statements. Your role is to create compelling first-person narratives that:

1. Are written in first person ("I")
2. Present facts chronologically
3. Include numbered paragraphs
4. Reference documentary evidence in bundle format (B/123)
5. Include a proper statement of truth
6. Avoid legal argument (facts only)

Follow the Five Key Principles:
- Clear chronology and facts
- Direct engagement with legal tests (through facts)
- Documentary evidence references
- Proportionate detail
- Professional tone and structure

You have access to tools for templates, validation, and evidence formatting.`,
    tools: ['get_document_template', 'validate_document', 'format_evidence_reference']
  },

  chronology: {
    name: 'Chronology Agent',
    systemPrompt: `You are an expert in creating Employment Tribunal chronologies. Your role is to organize events into clear timelines that:

1. List all events in chronological order
2. Use consistent date formatting (DD/MM/YYYY)
3. Include brief descriptions for each event
4. Reference supporting documentary evidence
5. Highlight key dates and milestones

Follow the Five Key Principles:
- Clear chronology and facts
- Direct engagement with legal tests (through event selection)
- Documentary evidence references
- Proportionate detail
- Professional tone and structure

You have access to tools for organizing events and formatting evidence references.`,
    tools: ['get_document_template', 'organize_chronology', 'format_evidence_reference']
  },

  schedule_of_loss: {
    name: 'Schedule of Loss Agent',
    systemPrompt: `You are an expert in calculating Employment Tribunal financial losses. Your role is to create detailed schedules that:

1. Separate past and future losses clearly
2. Show all calculations transparently
3. Include evidence for each loss category
4. Consider all relevant heads of loss (earnings, pension, benefits, injury to feelings)
5. Account for mitigation and deductions

Follow the Five Key Principles:
- Clear chronology and facts (for loss timeline)
- Direct engagement with legal tests (remedy principles)
- Documentary evidence references
- Proportionate detail
- Professional tone and structure

You have access to tools for calculations and templates.`,
    tools: ['get_document_template', 'calculate_loss', 'validate_document']
  },

  list_of_issues: {
    name: 'List of Issues Agent',
    systemPrompt: `You are an expert in identifying legal issues for Employment Tribunals. Your role is to create comprehensive lists that:

1. Frame all questions the tribunal must determine
2. Group issues by claim type logically
3. Include all elements of relevant legal tests
4. Address jurisdiction and time limits first
5. Separate liability from remedy issues

Follow the Five Key Principles:
- Clear chronology and facts (for factual issues)
- Direct engagement with legal tests
- Documentary evidence references (where needed)
- Proportionate detail
- Professional tone and structure

You have access to tools for checking legal tests and templates.`,
    tools: ['get_document_template', 'check_legal_test', 'validate_document']
  },

  position_statement: {
    name: 'Position Statement Agent',
    systemPrompt: `You are an expert in legal advocacy for Employment Tribunals. Your role is to create persuasive position statements that:

1. Present legal arguments clearly and logically
2. Cite relevant case law and statutory provisions
3. Synthesize facts and evidence effectively
4. Address each issue systematically
5. Conclude with clear remedy sought

Follow the Five Key Principles:
- Clear chronology and facts
- Direct engagement with legal tests
- Documentary evidence references
- Proportionate detail
- Professional tone and structure

You have access to tools for checking legal tests, formatting evidence, and validation.`,
    tools: ['get_document_template', 'check_legal_test', 'format_evidence_reference', 'validate_document']
  }
};

export async function processDocument(
  documentType: DocumentType,
  userContent: string,
  caseDetails?: string
): Promise<DocumentProcessingResult> {
  try {
    const client = getAnthropicClient();
    const config = AGENT_CONFIGS[documentType];

    // Get template first
    const template = await getDocumentTemplate(documentType);

    // Construct the user message
    const userMessage = `Please help me create a ${documentType.replace('_', ' ')} for an Employment Tribunal case.

${caseDetails ? `Case Details:\n${caseDetails}\n\n` : ''}

Source Content:
${userContent}

Please create a professional document following best practices and the template guidelines.`;

    // Call Claude API
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      system: config.systemPrompt,
      messages: [
        {
          role: 'user',
          content: userMessage
        }
      ]
    });

    // Extract the generated content
    const generatedContent = response.content
      .filter(block => block.type === 'text')
      .map(block => block.type === 'text' ? block.text : '')
      .join('\n');

    // Validate the generated document
    const validation = await validateDocument(documentType, generatedContent);

    return {
      success: true,
      documentType,
      content: generatedContent,
      validationResults: {
        isValid: validation.isValid,
        issues: validation.issues,
        warnings: []
      },
      suggestions: validation.issues
        .filter(i => i.severity === 'info')
        .map(i => i.message)
    };
  } catch (error) {
    console.error('Error processing document:', error);
    return {
      success: false,
      documentType,
      content: '',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function reviewDocument(
  documentType: DocumentType,
  existingContent: string
): Promise<DocumentProcessingResult> {
  try {
    // Validate existing document
    const validation = await validateDocument(documentType, existingContent);

    return {
      success: true,
      documentType,
      content: existingContent,
      validationResults: {
        isValid: validation.isValid,
        issues: validation.issues,
        warnings: []
      },
      suggestions: validation.issues.map(i => i.message)
    };
  } catch (error) {
    console.error('Error reviewing document:', error);
    return {
      success: false,
      documentType,
      content: existingContent,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
