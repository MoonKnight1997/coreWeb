# Employment Tribunal Documents - AI-Powered Document Assistance

A production-ready web application that provides AI-powered assistance for Employment Tribunal document preparation. Features six specialized agents for different document types, each expert in their specific area.

## Features

- **Six Specialized AI Agents:**
  - ET1 Agent - Claim forms and legal bases
  - Witness Statement Agent - First-person narratives with evidence
  - Chronology Agent - Timeline organization
  - Schedule of Loss Agent - Financial calculations
  - List of Issues Agent - Legal framework identification
  - Position Statement Agent - Legal advocacy and arguments

- **Production-Ready Features:**
  - No user authentication required
  - Immediate file deletion after processing
  - Mobile-responsive design
  - Comprehensive legal disclaimers
  - UK GDPR compliant
  - Accessibility-focused (WCAG 2.1 AA)

- **Security & Privacy:**
  - Files deleted immediately after processing
  - No persistent storage of user data
  - Secure file upload with validation
  - HTTPS enforced
  - Security headers configured

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui components
- **AI Processing:** Anthropic Claude API
- **File Handling:** Multipart upload with immediate deletion
- **Deployment:** Optimized for Vercel

## Getting Started

### Prerequisites

- Node.js 18.17.0 or higher
- npm or yarn
- Anthropic API key

### Installation

1. Clone the repository:
```bash
cd employment-tribunal-website
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.local.example .env.local
```

4. Add your Anthropic API key to `.env.local`:
```env
ANTHROPIC_API_KEY=your_api_key_here
```

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
employment-tribunal-website/
├── app/                      # Next.js app directory
│   ├── api/                 # API routes
│   │   ├── upload/         # File upload endpoint
│   │   └── process/        # Document processing endpoint
│   ├── process/            # Main processing flow page
│   ├── privacy/            # Privacy policy
│   ├── terms/              # Terms of service
│   ├── disclaimer/         # Legal disclaimer
│   ├── support/            # Support & donate page
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   └── globals.css         # Global styles
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   ├── DisclaimerModal.tsx
│   ├── ConsentForm.tsx
│   ├── FileUpload.tsx
│   ├── AgentSelector.tsx
│   ├── ProcessingStatus.tsx
│   ├── DocumentResults.tsx
│   ├── HeroSection.tsx
│   ├── HowItWorks.tsx
│   ├── AgentShowcase.tsx
│   └── Footer.tsx
├── lib/                    # Utility libraries
│   ├── mcp/               # MCP tool integration
│   │   ├── client.ts     # Anthropic client
│   │   ├── tools.ts      # Tool implementations
│   │   └── agents.ts     # Agent workflows
│   ├── validators/        # Input validation
│   ├── utils.ts          # Helper functions
│   └── constants.ts      # App constants
├── types/                 # TypeScript type definitions
└── public/               # Static assets
```

## Environment Variables

Required environment variables:

- `ANTHROPIC_API_KEY` - Your Anthropic API key for Claude
- `NODE_ENV` - Environment (development/production)
- `NEXT_PUBLIC_APP_URL` - Your app URL

Optional variables:

- `MAX_FILE_SIZE` - Max upload size in bytes (default: 10485760)
- `ALLOWED_FILE_TYPES` - Comma-separated file extensions

## Legal Compliance

This application includes comprehensive legal compliance features:

- **Disclaimers:** Multiple touchpoints throughout the user journey
- **Terms of Service:** Complete terms with all necessary disclosures
- **Privacy Policy:** UK GDPR-compliant privacy policy
- **Consent Management:** Required acceptance before processing
- **Data Deletion:** Immediate file deletion after processing

**Important:** This is NOT a legal service. Users must be informed that:
- This is not legal advice or representation
- We are not regulated by SRA or BSB
- Users should consult qualified solicitors
- England & Wales jurisdiction only

## Security Features

- File type validation (client and server-side)
- File size limits enforced
- Immediate file deletion after processing
- HTTPS enforcement
- Security headers (CSP, X-Frame-Options, etc.)
- No persistent storage of user data
- Input sanitization

## Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader compatible
- Sufficient color contrast
- Focus indicators
- ARIA labels throughout

## API Routes

### POST /api/upload

Upload a document file for processing.

**Request:**
- Content-Type: multipart/form-data
- Body: file (File)

**Response:**
```json
{
  "success": true,
  "fileId": "abc123...",
  "fileName": "document.pdf",
  "fileSize": 12345
}
```

### POST /api/process

Process an uploaded document with a specialized agent.

**Request:**
```json
{
  "fileId": "abc123...",
  "documentType": "et1",
  "caseDetails": "Optional additional context"
}
```

**Response:**
```json
{
  "success": true,
  "documentType": "et1",
  "content": "Generated document content...",
  "validationResults": {
    "isValid": true,
    "issues": []
  },
  "suggestions": []
}
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Self-hosted with Node.js

## Contributing

This is a demonstration project. For production use, consider:

1. Adding comprehensive error tracking (e.g., Sentry)
2. Implementing rate limiting
3. Adding CAPTCHA to prevent abuse
4. Setting up monitoring and analytics
5. Adding automated testing
6. Implementing CI/CD pipelines

## License

This project is for demonstration purposes. Consult with legal professionals before deploying a similar service.

## Disclaimer

This application provides AI-assisted document preparation only. It is NOT legal advice, legal representation, or a legal service. Users must consult qualified solicitors for their specific situations.

## Support

For questions or support:
- Email: support@example.com
- GitHub Issues: [Create an issue](https://github.com/example/repo/issues)

## Acknowledgments

- Built with Next.js and React
- AI powered by Anthropic Claude
- UI components from shadcn/ui
- Icons from Lucide React

---

**Remember:** This is NOT a legal service. Always consult a qualified solicitor for Employment Tribunal matters.
