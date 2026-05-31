import PptxGenJS from 'pptxgenjs';
import {
  Presentation, Slide, GradeBand,
  TitleContent, BulletsContent, VocabularyContent,
  GrammarContent, ReadingContent, ActivityContent,
  getGradeBand,
} from '@/types/lesson';

// ─── Theme ───────────────────────────────────────────────────────────────────

interface Theme {
  bg: string; header: string; accent: string;
  dark: string; light: string; text: string;
}
const THEMES: Record<GradeBand, Theme> = {
  1: { bg: 'FFF9C4', header: 'AB47BC', accent: 'FF7043', dark: '6A1B9A', light: 'F3E5F5', text: '4A148C' },
  2: { bg: 'E3F2FD', header: '1565C0', accent: 'F57C00', dark: '0D47A1', light: 'BBDEFB', text: '0D47A1' },
  3: { bg: 'E8F5E9', header: '00695C', accent: '7B1FA2', dark: '004D40', light: 'C8E6C9', text: '1B5E20' },
  4: { bg: 'ECEFF1', header: '1A237E', accent: '00838F', dark: '0D1B6E', light: 'CFD8DC', text: '1A237E' },
};

const SLIDE_W = 13.33;
const SLIDE_H = 7.5;

// ─── Wikipedia image fetcher ──────────────────────────────────────────────────
// Returns a base64 data-URL suitable for pptxgenjs addImage(), or null on failure.

async function fetchWikiImage(topic: string): Promise<string | null> {
  if (!topic?.trim()) return null;
  try {
    const ctrl1 = new AbortController();
    const t1 = setTimeout(() => ctrl1.abort(), 6000);
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic.trim())}`,
      { signal: ctrl1.signal }
    );
    clearTimeout(t1);
    if (!res.ok) return null;

    const data = await res.json() as { thumbnail?: { source: string } };
    const imgUrl = data?.thumbnail?.source;
    if (!imgUrl || imgUrl.toLowerCase().endsWith('.svg')) return null;

    const ctrl2 = new AbortController();
    const t2 = setTimeout(() => ctrl2.abort(), 6000);
    const imgRes = await fetch(imgUrl, { signal: ctrl2.signal });
    clearTimeout(t2);
    if (!imgRes.ok) return null;

    const ct = imgRes.headers.get('content-type') ?? 'image/jpeg';
    if (ct.includes('svg')) return null; // pptxgenjs can't render SVG

    const buf = Buffer.from(await imgRes.arrayBuffer());
    return `data:${ct};base64,${buf.toString('base64')}`;
  } catch {
    return null;
  }
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function addHeader(slide: PptxGenJS.Slide, title: string, emoji: string | undefined, theme: Theme) {
  slide.addShape('rect' as PptxGenJS.SHAPE_NAME, {
    x: 0, y: 0, w: SLIDE_W, h: 1.2,
    fill: { color: theme.header },
  });
  slide.addText((emoji ? `${emoji}  ` : '') + title, {
    x: 0.4, y: 0.1, w: SLIDE_W - 0.8, h: 1,
    fontSize: 28, bold: true, color: 'FFFFFF', valign: 'middle',
  });
}

function addTeacherNotes(_pptx: PptxGenJS, slide: PptxGenJS.Slide, notes: string) {
  if (notes) slide.addNotes(notes);
}

// ─── TITLE slide ─────────────────────────────────────────────────────────────

async function addTitleSlide(
  pptx: PptxGenJS, s: Slide, theme: Theme, presentation: Presentation
) {
  const slide = pptx.addSlide();
  slide.background = { color: theme.header };

  // Background photo (imageTopic)
  if (s.imageTopic) {
    const img = await fetchWikiImage(s.imageTopic);
    if (img) {
      slide.addImage({ data: img, x: 0, y: 0, w: SLIDE_W, h: SLIDE_H, transparency: 65 });
      // Re-draw a semi-transparent overlay so text stays readable
      slide.addShape('rect' as PptxGenJS.SHAPE_NAME, {
        x: 0, y: 0, w: SLIDE_W, h: SLIDE_H,
        fill: { color: theme.header, transparency: 45 },
      });
    }
  }

  const emoji = (s.content as TitleContent).emoji ?? '🎓';
  slide.addText(emoji, { x: 0, y: 0.8, w: SLIDE_W, h: 1.5, fontSize: 60, align: 'center' });
  slide.addText(s.title, {
    x: 0.5, y: 2.4, w: SLIDE_W - 1, h: 1.8,
    fontSize: 36, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle',
  });
  if (s.subtitle) {
    slide.addText(s.subtitle, {
      x: 0.5, y: 4.3, w: SLIDE_W - 1, h: 0.7,
      fontSize: 18, color: 'E0E0E0', align: 'center',
    });
  }
  slide.addText(`Grade ${presentation.grade}  |  ${new Date(presentation.createdAt).toLocaleDateString()}`, {
    x: 0.5, y: 6.6, w: SLIDE_W - 1, h: 0.6,
    fontSize: 14, color: 'B0BEC5', align: 'center',
  });
  addTeacherNotes(pptx, slide, s.teacherNotes);
}

// ─── BULLETS slide ────────────────────────────────────────────────────────────

async function addBulletsSlide(pptx: PptxGenJS, s: Slide, theme: Theme) {
  const slide = pptx.addSlide();
  slide.background = { color: theme.bg };
  addHeader(slide, s.title, s.emoji, theme);

  // Small thumbnail in top-right corner
  if (s.imageTopic) {
    const img = await fetchWikiImage(s.imageTopic);
    if (img) {
      slide.addImage({ data: img, x: SLIDE_W - 2.2, y: 1.3, w: 1.8, h: 1.2,
        rounding: true });
    }
  }

  const bullets = (s.content as BulletsContent).bullets ?? [];
  bullets.forEach((b, i) => {
    slide.addShape('rect' as PptxGenJS.SHAPE_NAME, {
      x: 0.4, y: 1.35 + i * 0.9, w: 0.35, h: 0.65,
      fill: { color: theme.accent }, line: { color: theme.accent },
    });
    slide.addText(b, {
      x: 0.9, y: 1.35 + i * 0.9, w: SLIDE_W - 3.2, h: 0.65,
      fontSize: 20, color: theme.text, valign: 'middle',
    });
  });
  addTeacherNotes(pptx, slide, s.teacherNotes);
}

// ─── VOCABULARY slide ─────────────────────────────────────────────────────────
// Layout mirrors the web preview: 3-column grid, photo fills top ~42%,
// emoji badge in a white circle overlaid on the photo, word/def/example below.

async function addVocabularySlide(pptx: PptxGenJS, s: Slide, theme: Theme) {
  const content = s.content as VocabularyContent;
  const words = content.words ?? [];

  // Pre-fetch all wiki images in parallel
  const imgs = await Promise.all(
    words.map(w => w.wikiTopic ? fetchWikiImage(w.wikiTopic) : Promise.resolve(null))
  );

  // Adaptive per-page count → always 3 columns to match web preview
  const perSlide = words.length <= 4 ? 4 : words.length <= 6 ? 6 : 9;
  const cols = words.length <= 2 ? words.length : 3;
  const gap  = 0.14;
  const padX = 0.32;
  const padY = 0.14;

  for (let page = 0; page < Math.ceil(words.length / perSlide); page++) {
    const slide = pptx.addSlide();
    slide.background = { color: theme.bg };
    const pages = Math.ceil(words.length / perSlide);
    const pageTitle = pages > 1 ? `${s.title} (${page + 1}/${pages})` : s.title;
    addHeader(slide, pageTitle, s.emoji ?? '📚', theme);

    const chunk    = words.slice(page * perSlide, page * perSlide + perSlide);
    const chunkImgs = imgs.slice(page * perSlide, page * perSlide + perSlide);
    const rows  = Math.ceil(chunk.length / cols);
    const cardW = (SLIDE_W - padX * 2 - gap * (cols - 1)) / cols;
    const cardH = (SLIDE_H - 1.5 - padY * 2 - gap * (rows - 1)) / rows;
    const photoH = cardH * 0.43; // photo fills top 43% — matches web

    chunk.forEach((w, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = padX + col * (cardW + gap);
      const y = 1.5 + padY + row * (cardH + gap);
      const imgData = chunkImgs[i];

      // ── Card background ────────────────────────────────────────────────────
      slide.addShape('rect' as PptxGenJS.SHAPE_NAME, {
        x, y, w: cardW, h: cardH,
        fill: { color: 'FFFFFF' },
        line: { color: theme.accent, width: 1.5 },
      });

      // ── Photo / fallback coloured area ────────────────────────────────────
      if (imgData) {
        slide.addImage({ data: imgData, x, y, w: cardW, h: photoH });
      } else {
        slide.addShape('rect' as PptxGenJS.SHAPE_NAME, {
          x, y, w: cardW, h: photoH,
          fill: { color: theme.light }, line: { color: theme.light },
        });
      }

      // ── Emoji badge — white circle overlaid on photo, centred ─────────────
      if (w.emoji) {
        const bSz = Math.min(cardW * 0.24, photoH * 0.55, 0.68);
        const bx  = x + cardW / 2 - bSz / 2;
        const by  = y + photoH / 2 - bSz / 2;
        slide.addShape('ellipse' as PptxGenJS.SHAPE_NAME, {
          x: bx, y: by, w: bSz, h: bSz,
          fill: { color: 'FFFFFF' },
          line: { color: 'CCCCCC', width: 0.5 },
        });
        slide.addText(w.emoji, {
          x: bx, y: by, w: bSz, h: bSz,
          fontSize: Math.round(bSz * 18), align: 'center', valign: 'middle',
        });
      }

      // ── Word (uppercase, header colour, centred) ──────────────────────────
      const wordY = y + photoH + 0.06;
      slide.addText(w.word.toUpperCase(), {
        x: x + 0.06, y: wordY, w: cardW - 0.12, h: 0.36,
        fontSize: Math.max(11, Math.round(14 - rows)),
        bold: true, color: theme.header, align: 'center', valign: 'middle',
      });

      // ── Definition (italic, grey, centred) ───────────────────────────────
      const defY = wordY + 0.37;
      slide.addText(w.definition, {
        x: x + 0.06, y: defY, w: cardW - 0.12, h: 0.34,
        fontSize: Math.max(9, Math.round(12 - rows)),
        color: '555555', italic: true, align: 'center', valign: 'middle',
      });

      // ── Example sentence (light-green pill) ───────────────────────────────
      if (w.example) {
        const exY = defY + 0.36;
        const exH = cardH - photoH - 0.06 - 0.36 - 0.36 - 0.06;
        if (exH > 0.2) {
          slide.addShape('rect' as PptxGenJS.SHAPE_NAME, {
            x: x + 0.06, y: exY, w: cardW - 0.12, h: exH,
            fill: { color: theme.light }, line: { color: theme.light },
          });
          slide.addText(`“ ${w.example} ”`, {
            x: x + 0.1, y: exY + 0.03, w: cardW - 0.2, h: exH - 0.06,
            fontSize: Math.max(8, Math.round(11 - rows)),
            color: theme.text, align: 'center', valign: 'middle',
          });
        }
      }
    });
    addTeacherNotes(pptx, slide, s.teacherNotes);
  }
}

// ─── GRAMMAR slide ────────────────────────────────────────────────────────────

async function addGrammarSlide(pptx: PptxGenJS, s: Slide, theme: Theme) {
  const slide = pptx.addSlide();
  slide.background = { color: theme.bg };
  addHeader(slide, s.title, s.emoji ?? '📝', theme);

  const c = s.content as GrammarContent;

  // Small photo on the right if available
  if (s.imageTopic) {
    const img = await fetchWikiImage(s.imageTopic);
    if (img) {
      slide.addImage({ data: img, x: SLIDE_W - 2.4, y: 1.3, w: 2.0, h: 1.4, rounding: true });
    }
  }

  const rightMargin = s.imageTopic ? 2.6 : 0;

  // Rule box
  slide.addShape('rect' as PptxGenJS.SHAPE_NAME, {
    x: 0.4, y: 1.4, w: SLIDE_W - 0.8 - rightMargin, h: 1.1,
    fill: { color: theme.light }, line: { color: theme.accent, width: 2 },
  });
  slide.addText(c.rule, {
    x: 0.6, y: 1.45, w: SLIDE_W - 1.2 - rightMargin, h: 1,
    fontSize: 18, color: theme.dark, valign: 'middle',
  });

  // Structure formula
  if (c.structure) {
    slide.addShape('rect' as PptxGenJS.SHAPE_NAME, {
      x: 0.4, y: 2.65, w: SLIDE_W - 0.8, h: 0.65,
      fill: { color: theme.accent }, line: { color: theme.accent },
    });
    slide.addText(c.structure, {
      x: 0.6, y: 2.68, w: SLIDE_W - 1.2, h: 0.6,
      fontSize: 20, bold: true, color: 'FFFFFF', valign: 'middle',
    });
  }

  const yStart = c.structure ? 3.45 : 2.65;
  slide.addText('Examples:', {
    x: 0.4, y: yStart, w: 3, h: 0.4,
    fontSize: 16, bold: true, color: theme.header,
  });
  (c.examples ?? []).forEach((ex, i) => {
    slide.addText(`• ${ex}`, {
      x: 0.6, y: yStart + 0.45 + i * 0.55, w: SLIDE_W - 1, h: 0.5,
      fontSize: 17, color: theme.text,
    });
  });
  addTeacherNotes(pptx, slide, s.teacherNotes);
}

// ─── READING slide ────────────────────────────────────────────────────────────

async function addReadingSlide(pptx: PptxGenJS, s: Slide, theme: Theme) {
  const slide = pptx.addSlide();
  slide.background = { color: theme.bg };
  addHeader(slide, s.title, s.emoji ?? '📖', theme);

  const c = s.content as ReadingContent;
  const img = s.imageTopic ? await fetchWikiImage(s.imageTopic) : null;
  const textW = img ? SLIDE_W * 0.58 - 0.6 : SLIDE_W - 0.8;

  // Reading text box (left side)
  slide.addShape('rect' as PptxGenJS.SHAPE_NAME, {
    x: 0.4, y: 1.4, w: textW, h: 2.8,
    fill: { color: 'FFFEF7' }, line: { color: theme.accent, width: 1.5 },
  });
  slide.addText(c.text, {
    x: 0.6, y: 1.5, w: textW - 0.4, h: 2.6,
    fontSize: 16, color: '333333', valign: 'top',
  });

  // Photo on the right side
  if (img) {
    slide.addImage({
      data: img,
      x: 0.4 + textW + 0.2, y: 1.4, w: SLIDE_W - textW - 0.8, h: 2.8,
    });
  }

  // Comprehension questions
  slide.addText('Comprehension Questions:', {
    x: 0.4, y: 4.35, w: 5, h: 0.4,
    fontSize: 16, bold: true, color: theme.header,
  });
  (c.questions ?? []).forEach((q, i) => {
    slide.addText(`${i + 1}. ${q}`, {
      x: 0.6, y: 4.8 + i * 0.52, w: SLIDE_W - 1, h: 0.48,
      fontSize: 15, color: theme.text,
    });
  });
  addTeacherNotes(pptx, slide, s.teacherNotes);
}

// ─── ACTIVITY / EXERCISE slide ────────────────────────────────────────────────

async function addActivitySlide(pptx: PptxGenJS, s: Slide, theme: Theme) {
  const slide = pptx.addSlide();
  slide.background = { color: theme.bg };
  addHeader(slide, s.title, s.emoji, theme);

  const c = s.content as ActivityContent;
  const isExercise = c.activityType === 'exercise';

  // Pre-fetch per-instruction images for exercise slides
  let instrImgs: (string | null)[] = [];
  if (isExercise && c.instructionTopics?.length) {
    instrImgs = await Promise.all(
      (c.instructionTopics).map(t => (t ? fetchWikiImage(t) : Promise.resolve(null)))
    );
  }

  // Slide-level photo banner (non-exercise) or small corner thumbnail
  if (s.imageTopic && !isExercise) {
    const img = await fetchWikiImage(s.imageTopic);
    if (img) {
      slide.addImage({ data: img, x: SLIDE_W - 2.2, y: 1.3, w: 1.8, h: 1.2, rounding: true });
    }
  }

  slide.addText('Instructions:', {
    x: 0.4, y: 1.35, w: 3, h: 0.4,
    fontSize: 16, bold: true, color: theme.header,
  });

  const instrCount = c.instructions?.length ?? 0;
  const rowH = isExercise ? Math.min(0.85, (SLIDE_H - 2.1) / Math.max(instrCount, 1)) : 0.65;
  const imgW = 1.35;
  const textRightPad = isExercise ? imgW + 0.25 : 0;

  (c.instructions ?? []).forEach((instr, i) => {
    const rowY = 1.82 + i * rowH;
    const hasImg = isExercise && instrImgs[i];

    // Number badge
    slide.addShape('rect' as PptxGenJS.SHAPE_NAME, {
      x: 0.4, y: rowY, w: 0.45, h: rowH - 0.06,
      fill: { color: theme.accent }, line: { color: theme.accent },
    });
    slide.addText(String(i + 1), {
      x: 0.4, y: rowY, w: 0.45, h: rowH - 0.06,
      fontSize: 14, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle',
    });

    // Instruction text
    slide.addText(instr, {
      x: 0.95, y: rowY, w: SLIDE_W - 1.4 - textRightPad, h: rowH - 0.06,
      fontSize: 17, color: theme.text, valign: 'middle',
    });

    // Per-item illustration (exercise only)
    if (hasImg) {
      slide.addImage({
        data: instrImgs[i]!,
        x: SLIDE_W - imgW - 0.3,
        y: rowY + 0.04,
        w: imgW,
        h: rowH - 0.10,
      });
    }
  });

  if (c.content) {
    const instrH = instrCount * rowH;
    const boxY = 1.82 + instrH + 0.1;
    if (boxY < SLIDE_H - 1) {
      slide.addShape('rect' as PptxGenJS.SHAPE_NAME, {
        x: 0.4, y: boxY, w: SLIDE_W - 0.8, h: SLIDE_H - boxY - 0.2,
        fill: { color: theme.light }, line: { color: theme.accent, width: 1 },
      });
      slide.addText(c.content, {
        x: 0.6, y: boxY + 0.1, w: SLIDE_W - 1.2, h: SLIDE_H - boxY - 0.4,
        fontSize: 15, color: theme.dark, valign: 'top',
      });
    }
  }
  addTeacherNotes(pptx, slide, s.teacherNotes);
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function buildPptx(presentation: Presentation): Promise<Buffer> {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.title = presentation.title;
  pptx.subject = `English Lesson – Grade ${presentation.grade}`;

  const band = getGradeBand(presentation.grade);
  const theme = THEMES[band];

  for (const slide of presentation.slides) {
    const ct = slide.content.type;
    if (slide.type === 'title' || ct === 'title') {
      await addTitleSlide(pptx, slide, theme, presentation);
    } else if (ct === 'vocabulary') {
      await addVocabularySlide(pptx, slide, theme);
    } else if (ct === 'grammar') {
      await addGrammarSlide(pptx, slide, theme);
    } else if (ct === 'reading') {
      await addReadingSlide(pptx, slide, theme);
    } else if (ct === 'activity') {
      await addActivitySlide(pptx, slide, theme);
    } else {
      await addBulletsSlide(pptx, slide, theme);
    }
  }

  return (await pptx.write({ outputType: 'nodebuffer' })) as unknown as Buffer;
}
