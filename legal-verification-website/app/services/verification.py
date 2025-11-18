"""
Legal Document Verification Service

Handles verification of legal documents using Anthropic Claude API with
extended thinking mode and web search capabilities.
"""

import time
from typing import Dict, Any
import anthropic

from app.config import current_config
from app.utils.logger import logger, log_verification_start, log_verification_complete


class VerificationError(Exception):
    """Raised when verification process fails."""
    pass


class LegalVerificationService:
    """Service for verifying legal documents."""

    def __init__(self):
        """Initialize verification service with Claude client."""
        if not current_config.ANTHROPIC_API_KEY:
            raise VerificationError('Anthropic API key not configured')

        self.client = anthropic.Anthropic(
            api_key=current_config.ANTHROPIC_API_KEY
        )

        self.model = current_config.ANTHROPIC_MODEL
        self.max_tokens = current_config.ANTHROPIC_MAX_TOKENS
        self.thinking_budget = current_config.ANTHROPIC_THINKING_BUDGET
        self.temperature = current_config.ANTHROPIC_TEMPERATURE

    def verify_document(
        self,
        document_text: str,
        document_type: str = "General Employment Tribunal Document"
    ) -> Dict[str, Any]:
        """
        Verify legal document using Claude with extended thinking.

        Args:
            document_text: The document text to verify
            document_type: Type of document (ET1, ET3, etc.)

        Returns:
            Dict containing verification report and metadata

        Raises:
            VerificationError: If verification fails
        """
        start_time = time.time()

        log_verification_start(
            document_type=document_type,
            text_length=len(document_text)
        )

        try:
            # Build verification prompt
            prompt = self._build_verification_prompt(document_text, document_type)

            logger.info(
                'Starting Claude API call',
                document_type=document_type,
                model=self.model
            )

            # Call Claude API with extended thinking
            response = self.client.messages.create(
                model=self.model,
                max_tokens=self.max_tokens,
                thinking={
                    "type": "enabled",
                    "budget_tokens": self.thinking_budget
                },
                temperature=self.temperature,
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )

            # Extract report from response
            report = self._extract_report(response)

            duration_ms = (time.time() - start_time) * 1000

            log_verification_complete(
                document_type=document_type,
                duration_ms=duration_ms,
                success=True,
                report_length=len(report)
            )

            return {
                'success': True,
                'report': report,
                'document_type': document_type,
                'duration_ms': round(duration_ms, 2),
                'timestamp': time.strftime('%Y-%m-%d %H:%M:%S')
            }

        except anthropic.APIError as e:
            duration_ms = (time.time() - start_time) * 1000
            logger.error(
                'Anthropic API error',
                error=str(e),
                document_type=document_type
            )
            log_verification_complete(
                document_type=document_type,
                duration_ms=duration_ms,
                success=False
            )
            raise VerificationError(f'API error: {str(e)}')

        except Exception as e:
            duration_ms = (time.time() - start_time) * 1000
            logger.error(
                'Verification failed',
                error=str(e),
                document_type=document_type
            )
            log_verification_complete(
                document_type=document_type,
                duration_ms=duration_ms,
                success=False
            )
            raise VerificationError(f'Verification failed: {str(e)}')

    def _build_verification_prompt(self, document_text: str, document_type: str) -> str:
        """
        Build comprehensive verification prompt.

        Args:
            document_text: Document text to verify
            document_type: Type of document

        Returns:
            Formatted prompt string
        """
        prompt = f"""You are a Legal Verification Protocol Agent specializing in UK Employment Law.

Your task is to perform a MANDATORY VERIFICATION PROTOCOL on the following document.

DOCUMENT TYPE: {document_type}

VERIFICATION FRAMEWORK:
You MUST analyze the document against these criteria:

1. SUBSTANTIVE LAW VERIFICATION
   - Identify all legal claims/defenses cited
   - Verify accuracy of legal principles stated
   - Check for current case law (2024 Employment Tribunal Rules)
   - Flag any outdated or incorrect legal references
   - Assess strength of legal arguments

2. PROCEDURAL COMPLIANCE (ET/EAT Rules 2024)
   - Time limits compliance
   - Required forms and contents
   - Proper service/filing procedures
   - Case management directions compliance
   - Mandatory orders compliance

3. PLEADING & PARTICULARISATION STANDARDS
   - Sufficient factual particulars
   - Clear chronology
   - Specific dates, times, persons
   - Quantum properly pleaded
   - Causal links established
   - Material facts vs evidence distinction

4. INTERNAL CONSISTENCY & REASONING QUALITY
   - Logical flow and structure
   - No contradictions
   - Evidence properly referenced
   - Arguments support conclusions
   - Clear and concise drafting

5. DOCUMENT-SPECIFIC REQUIREMENTS
   For ET1: All mandatory sections, ACAS certificate, discrimination details
   For ET3: Response time, grounds fully stated, jurisdictional challenges
   For EAT Appeals: Permission requirements, grounds properly framed, authorities cited
   For Applications: Proper basis, supporting evidence, proportionality

MANDATORY LEGAL DISCLAIMER:
This verification is an EDUCATIONAL TOOL ONLY. It does NOT constitute:
- Legal advice or representation
- A solicitor-client relationship
- Regulated legal services under SRA/BSB rules

OUTPUT FORMAT:
Provide a structured report with:

## EXECUTIVE SUMMARY
[Overall assessment: Ready/Needs Revision/Major Issues]
[2-3 sentences summarizing key findings]

## SUBSTANTIVE LAW ISSUES
[List all legal issues found with severity: CRITICAL/MAJOR/MINOR]

### CRITICAL Issues
- [Issue 1]
- [Issue 2]

### MAJOR Issues
- [Issue 1]

### MINOR Issues
- [Issue 1]

## PROCEDURAL COMPLIANCE
[List all procedural issues with severity and deadline impacts]

## PLEADING QUALITY
[Assessment of particularisation and drafting quality]

### Strengths
- [Strength 1]

### Areas for Improvement
- [Area 1]

## AUTHORITIES & CITATIONS
[Verify all case law cited - check currency and accuracy]

## RECOMMENDATIONS
[Prioritized list of required changes - numbered by importance]

1. [Most critical change]
2. [Second priority]
...

## RISK ASSESSMENT
[Litigation risks identified - what could go wrong]

### High Risk Areas
- [Risk 1]

### Medium Risk Areas
- [Risk 1]

---
DOCUMENT TO VERIFY:

{document_text}

---

Begin your mandatory verification protocol now. Use extended thinking to analyze complex legal issues. Be thorough, specific, and constructive in your feedback."""

        return prompt

    def _extract_report(self, response) -> str:
        """
        Extract verification report from Claude API response.

        Args:
            response: Claude API response object

        Returns:
            Formatted report string
        """
        report_parts = []

        for block in response.content:
            if block.type == "text":
                report_parts.append(block.text)

        if not report_parts:
            raise VerificationError('No text content in API response')

        report = '\n'.join(report_parts)

        logger.debug(
            'Report extracted',
            report_length=len(report),
            num_blocks=len(response.content)
        )

        return report


# Convenience function for quick verification
def verify_legal_document(
    document_text: str,
    document_type: str = "General Employment Tribunal Document"
) -> str:
    """
    Verify legal document and return report.

    Args:
        document_text: Document text to verify
        document_type: Type of document

    Returns:
        Verification report string

    Raises:
        VerificationError: If verification fails
    """
    service = LegalVerificationService()
    result = service.verify_document(document_text, document_type)
    return result['report']
