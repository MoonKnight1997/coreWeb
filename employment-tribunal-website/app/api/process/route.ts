import { NextRequest, NextResponse } from 'next/server';
import { readFile, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { processDocument } from '@/lib/mcp/agents';
import { DocumentType } from '@/types/agent';
import { ProcessRequest } from '@/types/api';

const UPLOAD_DIR = path.join(process.cwd(), 'temp-uploads');

export async function POST(request: NextRequest) {
  let filePath: string | null = null;

  try {
    // Parse request body
    const body: ProcessRequest = await request.json();
    const { fileId, documentType, caseDetails } = body;

    if (!fileId || !documentType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate document type
    const validTypes: DocumentType[] = [
      'et1',
      'witness_statement',
      'chronology',
      'schedule_of_loss',
      'list_of_issues',
      'position_statement'
    ];

    if (!validTypes.includes(documentType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid document type' },
        { status: 400 }
      );
    }

    // Find the uploaded file
    const files = await import('fs').then(fs =>
      fs.readdirSync(UPLOAD_DIR).filter(f => f.startsWith(fileId))
    );

    if (files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'File not found. It may have expired.' },
        { status: 404 }
      );
    }

    const fileName = files[0];
    filePath = path.join(UPLOAD_DIR, fileName);

    // Read file content
    let fileContent: string;
    try {
      const buffer = await readFile(filePath);
      fileContent = buffer.toString('utf-8');
    } catch (readError) {
      console.error('Error reading file:', readError);
      return NextResponse.json(
        { success: false, error: 'Failed to read file. File may be corrupted or in an unsupported format.' },
        { status: 400 }
      );
    }

    // Validate file content
    if (!fileContent || fileContent.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'File appears to be empty' },
        { status: 400 }
      );
    }

    console.log(`Processing document: ${documentType}, File size: ${fileContent.length} chars`);

    // Process document with agent
    const result = await processDocument(
      documentType,
      fileContent,
      caseDetails
    );

    // Clean up: Delete the uploaded file immediately
    if (filePath && existsSync(filePath)) {
      try {
        await unlink(filePath);
        console.log(`File deleted: ${fileName}`);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
        // Don't fail the request if file deletion fails
      }
    }

    // Return the processing result
    return NextResponse.json(result);

  } catch (error) {
    console.error('Processing error:', error);

    // Try to clean up file even if processing failed
    if (filePath && existsSync(filePath)) {
      try {
        await unlink(filePath);
      } catch {
        // Ignore cleanup errors
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process document',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
