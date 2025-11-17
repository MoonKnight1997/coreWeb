import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
export function getAnthropicClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is not set');
  }

  return new Anthropic({
    apiKey,
  });
}

// MCP Tool definitions as per the agent description
export const MCP_TOOLS = {
  GET_DOCUMENT_TEMPLATE: {
    name: 'get_document_template',
    description: 'Access templates and guidelines for specific Employment Tribunal document types',
    input_schema: {
      type: 'object',
      properties: {
        document_type: {
          type: 'string',
          enum: ['et1', 'witness_statement', 'chronology', 'schedule_of_loss', 'list_of_issues', 'position_statement'],
          description: 'The type of document template to retrieve'
        }
      },
      required: ['document_type']
    }
  },

  VALIDATE_DOCUMENT: {
    name: 'validate_document',
    description: 'Check document against Employment Tribunal best practices and requirements',
    input_schema: {
      type: 'object',
      properties: {
        document_type: {
          type: 'string',
          enum: ['et1', 'witness_statement', 'chronology', 'schedule_of_loss', 'list_of_issues', 'position_statement'],
          description: 'The type of document being validated'
        },
        content: {
          type: 'string',
          description: 'The document content to validate'
        }
      },
      required: ['document_type', 'content']
    }
  },

  FORMAT_EVIDENCE_REFERENCE: {
    name: 'format_evidence_reference',
    description: 'Format bundle references in the standard format (e.g., B/123)',
    input_schema: {
      type: 'object',
      properties: {
        bundle_letter: {
          type: 'string',
          description: 'The bundle letter (e.g., A, B, C)'
        },
        page_number: {
          type: 'number',
          description: 'The page number in the bundle'
        },
        description: {
          type: 'string',
          description: 'Optional description of the evidence'
        }
      },
      required: ['bundle_letter', 'page_number']
    }
  },

  ORGANIZE_CHRONOLOGY: {
    name: 'organize_chronology',
    description: 'Sort events chronologically and ensure proper formatting',
    input_schema: {
      type: 'object',
      properties: {
        events: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              date: { type: 'string' },
              description: { type: 'string' },
              evidence: { type: 'string' }
            }
          },
          description: 'Array of events to organize'
        }
      },
      required: ['events']
    }
  },

  CALCULATE_LOSS: {
    name: 'calculate_loss',
    description: 'Compute financial losses with proper calculations',
    input_schema: {
      type: 'object',
      properties: {
        loss_type: {
          type: 'string',
          enum: ['past_earnings', 'future_earnings', 'pension', 'benefits', 'injury_to_feelings'],
          description: 'The type of loss to calculate'
        },
        base_amount: {
          type: 'number',
          description: 'Base amount for calculation'
        },
        period_months: {
          type: 'number',
          description: 'Period in months for calculation'
        },
        details: {
          type: 'string',
          description: 'Additional details for the calculation'
        }
      },
      required: ['loss_type', 'base_amount']
    }
  },

  CHECK_LEGAL_TEST: {
    name: 'check_legal_test',
    description: 'Verify that legal elements and tests are properly addressed',
    input_schema: {
      type: 'object',
      properties: {
        claim_type: {
          type: 'string',
          enum: ['unfair_dismissal', 'discrimination', 'harassment', 'victimisation', 'breach_of_contract', 'redundancy'],
          description: 'The type of claim'
        },
        elements: {
          type: 'array',
          items: { type: 'string' },
          description: 'Legal elements to check'
        }
      },
      required: ['claim_type', 'elements']
    }
  }
} as const;

export type MCPToolName = keyof typeof MCP_TOOLS;
