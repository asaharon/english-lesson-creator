import { NextRequest, NextResponse } from 'next/server';
import { buildPptx } from '@/lib/pptx';
import { Presentation } from '@/types/lesson';

export async function POST(request: NextRequest) {
  try {
    const presentation: Presentation = await request.json();
    const buffer = await buildPptx(presentation);

    const safeTitle = presentation.title.replace(/[^a-zA-Z0-9\s-]/g, '').trim() || 'lesson';

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-Disposition': `attachment; filename="${safeTitle}.pptx"`,
      },
    });
  } catch (err) {
    console.error('Export error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Export failed' },
      { status: 500 },
    );
  }
}
