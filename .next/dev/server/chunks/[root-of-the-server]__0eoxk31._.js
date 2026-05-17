module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[project]/types/lesson.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getGradeBand",
    ()=>getGradeBand,
    "getGradeBandLabel",
    ()=>getGradeBandLabel
]);
function getGradeBand(grade) {
    if (grade <= 2) return 1;
    if (grade <= 4) return 2;
    if (grade <= 6) return 3;
    return 4;
}
function getGradeBandLabel(grade) {
    const labels = {
        1: 'Young Learners · A1',
        2: 'Elementary · A1–A2',
        3: 'Pre-Intermediate · A2',
        4: 'Intermediate · A2–B1'
    };
    return labels[getGradeBand(grade)];
}
}),
"[project]/lib/pptx.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildPptx",
    ()=>buildPptx
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pptxgenjs$2f$dist$2f$pptxgen$2e$es$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/pptxgenjs/dist/pptxgen.es.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$lesson$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/types/lesson.ts [app-route] (ecmascript)");
;
;
const THEMES = {
    1: {
        bg: 'FFF9C4',
        header: 'AB47BC',
        accent: 'FF7043',
        dark: '6A1B9A',
        light: 'F3E5F5',
        text: '4A148C'
    },
    2: {
        bg: 'E3F2FD',
        header: '1565C0',
        accent: 'F57C00',
        dark: '0D47A1',
        light: 'BBDEFB',
        text: '0D47A1'
    },
    3: {
        bg: 'E8F5E9',
        header: '00695C',
        accent: '7B1FA2',
        dark: '004D40',
        light: 'C8E6C9',
        text: '1B5E20'
    },
    4: {
        bg: 'ECEFF1',
        header: '1A237E',
        accent: '00838F',
        dark: '0D1B6E',
        light: 'CFD8DC',
        text: '1A237E'
    }
};
const SLIDE_W = 13.33;
const SLIDE_H = 7.5;
function addHeader(slide, title, emoji, theme) {
    slide.addShape('rect', {
        x: 0,
        y: 0,
        w: SLIDE_W,
        h: 1.2,
        fill: {
            color: theme.header
        }
    });
    const titleText = emoji ? `${emoji}  ${title}` : title;
    slide.addText(titleText, {
        x: 0.4,
        y: 0.1,
        w: SLIDE_W - 0.8,
        h: 1,
        fontSize: 28,
        bold: true,
        color: 'FFFFFF',
        valign: 'middle'
    });
}
function addTeacherNotes(pptx, slide, notes) {
    if (notes) {
        slide.addNotes(notes);
    }
    void pptx;
}
function addTitleSlide(pptx, s, theme, presentation) {
    const slide = pptx.addSlide();
    slide.background = {
        color: theme.header
    };
    const emoji = s.content.emoji ?? '🎓';
    slide.addText(emoji, {
        x: 0,
        y: 0.8,
        w: SLIDE_W,
        h: 1.5,
        fontSize: 60,
        align: 'center'
    });
    slide.addText(s.title, {
        x: 0.5,
        y: 2.4,
        w: SLIDE_W - 1,
        h: 1.8,
        fontSize: 36,
        bold: true,
        color: 'FFFFFF',
        align: 'center',
        valign: 'middle'
    });
    if (s.subtitle) {
        slide.addText(s.subtitle, {
            x: 0.5,
            y: 4.3,
            w: SLIDE_W - 1,
            h: 0.7,
            fontSize: 18,
            color: 'E0E0E0',
            align: 'center'
        });
    }
    slide.addText(`Grade ${presentation.grade}  |  ${new Date(presentation.createdAt).toLocaleDateString()}`, {
        x: 0.5,
        y: 6.6,
        w: SLIDE_W - 1,
        h: 0.6,
        fontSize: 14,
        color: 'B0BEC5',
        align: 'center'
    });
    addTeacherNotes(pptx, slide, s.teacherNotes);
}
function addBulletsSlide(pptx, s, theme) {
    const slide = pptx.addSlide();
    slide.background = {
        color: theme.bg
    };
    addHeader(slide, s.title, s.emoji, theme);
    const content = s.content;
    const bullets = content.bullets ?? [];
    bullets.forEach((b, i)=>{
        slide.addShape('rect', {
            x: 0.4,
            y: 1.35 + i * 0.9,
            w: 0.35,
            h: 0.65,
            fill: {
                color: theme.accent
            },
            line: {
                color: theme.accent
            }
        });
        slide.addText(b, {
            x: 0.9,
            y: 1.35 + i * 0.9,
            w: SLIDE_W - 1.3,
            h: 0.65,
            fontSize: 20,
            color: theme.text,
            valign: 'middle'
        });
    });
    addTeacherNotes(pptx, slide, s.teacherNotes);
}
function addVocabularySlide(pptx, s, theme) {
    const content = s.content;
    const words = content.words ?? [];
    // Split into groups of 4 per slide
    const perSlide = 4;
    for(let page = 0; page < Math.ceil(words.length / perSlide); page++){
        const slide = pptx.addSlide();
        slide.background = {
            color: theme.bg
        };
        const pageTitle = Math.ceil(words.length / perSlide) > 1 ? `${s.title} (${page + 1}/${Math.ceil(words.length / perSlide)})` : s.title;
        addHeader(slide, pageTitle, s.emoji ?? '📚', theme);
        const chunk = words.slice(page * perSlide, page * perSlide + perSlide);
        const cols = chunk.length <= 2 ? chunk.length : 2;
        const rows = Math.ceil(chunk.length / cols);
        const cardW = (SLIDE_W - 0.8) / cols - 0.2;
        const cardH = (SLIDE_H - 1.5) / rows - 0.2;
        chunk.forEach((w, i)=>{
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = 0.4 + col * (cardW + 0.2);
            const y = 1.5 + row * (cardH + 0.2);
            slide.addShape('rect', {
                x,
                y,
                w: cardW,
                h: cardH,
                fill: {
                    color: 'FFFFFF'
                },
                line: {
                    color: theme.accent,
                    width: 2
                }
            });
            slide.addShape('rect', {
                x,
                y,
                w: cardW,
                h: 0.45,
                fill: {
                    color: theme.light
                },
                line: {
                    color: theme.light
                }
            });
            const emojiText = w.emoji ? `${w.emoji}  ` : '';
            slide.addText(`${emojiText}${w.word}`, {
                x: x + 0.1,
                y: y + 0.05,
                w: cardW - 0.2,
                h: 0.38,
                fontSize: 18,
                bold: true,
                color: theme.dark
            });
            slide.addText(w.definition, {
                x: x + 0.1,
                y: y + 0.5,
                w: cardW - 0.2,
                h: 0.5,
                fontSize: 14,
                color: '555555',
                italic: true
            });
            if (w.example) {
                slide.addText(`"${w.example}"`, {
                    x: x + 0.1,
                    y: y + 1.0,
                    w: cardW - 0.2,
                    h: cardH - 1.1,
                    fontSize: 13,
                    color: theme.text
                });
            }
        });
        addTeacherNotes(pptx, slide, s.teacherNotes);
    }
}
function addGrammarSlide(pptx, s, theme) {
    const slide = pptx.addSlide();
    slide.background = {
        color: theme.bg
    };
    addHeader(slide, s.title, s.emoji ?? '📝', theme);
    const c = s.content;
    // Rule box
    slide.addShape('rect', {
        x: 0.4,
        y: 1.4,
        w: SLIDE_W - 0.8,
        h: 1.1,
        fill: {
            color: theme.light
        },
        line: {
            color: theme.accent,
            width: 2
        }
    });
    slide.addText(c.rule, {
        x: 0.6,
        y: 1.45,
        w: SLIDE_W - 1.2,
        h: 1,
        fontSize: 18,
        color: theme.dark,
        valign: 'middle'
    });
    // Structure formula
    if (c.structure) {
        slide.addShape('rect', {
            x: 0.4,
            y: 2.65,
            w: SLIDE_W - 0.8,
            h: 0.65,
            fill: {
                color: theme.accent
            },
            line: {
                color: theme.accent
            }
        });
        slide.addText(c.structure, {
            x: 0.6,
            y: 2.68,
            w: SLIDE_W - 1.2,
            h: 0.6,
            fontSize: 20,
            bold: true,
            color: 'FFFFFF',
            valign: 'middle'
        });
    }
    // Examples
    const yStart = c.structure ? 3.45 : 2.65;
    slide.addText('Examples:', {
        x: 0.4,
        y: yStart,
        w: 3,
        h: 0.4,
        fontSize: 16,
        bold: true,
        color: theme.header
    });
    (c.examples ?? []).forEach((ex, i)=>{
        slide.addText(`• ${ex}`, {
            x: 0.6,
            y: yStart + 0.45 + i * 0.55,
            w: SLIDE_W - 1,
            h: 0.5,
            fontSize: 17,
            color: theme.text
        });
    });
    addTeacherNotes(pptx, slide, s.teacherNotes);
}
function addReadingSlide(pptx, s, theme) {
    const slide = pptx.addSlide();
    slide.background = {
        color: theme.bg
    };
    addHeader(slide, s.title, s.emoji ?? '📖', theme);
    const c = s.content;
    // Reading text box
    slide.addShape('rect', {
        x: 0.4,
        y: 1.4,
        w: SLIDE_W - 0.8,
        h: 2.8,
        fill: {
            color: 'FFFFFF'
        },
        line: {
            color: theme.accent,
            width: 1.5
        }
    });
    slide.addText(c.text, {
        x: 0.6,
        y: 1.5,
        w: SLIDE_W - 1.2,
        h: 2.6,
        fontSize: 16,
        color: '333333',
        valign: 'top'
    });
    // Questions
    slide.addText('Comprehension Questions:', {
        x: 0.4,
        y: 4.35,
        w: 5,
        h: 0.4,
        fontSize: 16,
        bold: true,
        color: theme.header
    });
    (c.questions ?? []).forEach((q, i)=>{
        slide.addText(`${i + 1}. ${q}`, {
            x: 0.6,
            y: 4.8 + i * 0.52,
            w: SLIDE_W - 1,
            h: 0.48,
            fontSize: 15,
            color: theme.text
        });
    });
    addTeacherNotes(pptx, slide, s.teacherNotes);
}
function addActivitySlide(pptx, s, theme) {
    const slide = pptx.addSlide();
    slide.background = {
        color: theme.bg
    };
    addHeader(slide, s.title, s.emoji, theme);
    const c = s.content;
    slide.addText('Instructions:', {
        x: 0.4,
        y: 1.35,
        w: 3,
        h: 0.4,
        fontSize: 16,
        bold: true,
        color: theme.header
    });
    (c.instructions ?? []).forEach((instr, i)=>{
        slide.addShape('rect', {
            x: 0.4,
            y: 1.82 + i * 0.65,
            w: 0.45,
            h: 0.45,
            fill: {
                color: theme.accent
            },
            line: {
                color: theme.accent
            }
        });
        slide.addText(String(i + 1), {
            x: 0.4,
            y: 1.82 + i * 0.65,
            w: 0.45,
            h: 0.45,
            fontSize: 14,
            bold: true,
            color: 'FFFFFF',
            align: 'center',
            valign: 'middle'
        });
        slide.addText(instr, {
            x: 0.95,
            y: 1.82 + i * 0.65,
            w: SLIDE_W - 1.4,
            h: 0.6,
            fontSize: 17,
            color: theme.text,
            valign: 'middle'
        });
    });
    if (c.content) {
        const instrH = (c.instructions?.length ?? 0) * 0.65;
        const boxY = 1.82 + instrH + 0.1;
        if (boxY < SLIDE_H - 1) {
            slide.addShape('rect', {
                x: 0.4,
                y: boxY,
                w: SLIDE_W - 0.8,
                h: SLIDE_H - boxY - 0.2,
                fill: {
                    color: theme.light
                },
                line: {
                    color: theme.accent,
                    width: 1
                }
            });
            slide.addText(c.content, {
                x: 0.6,
                y: boxY + 0.1,
                w: SLIDE_W - 1.2,
                h: SLIDE_H - boxY - 0.4,
                fontSize: 15,
                color: theme.dark,
                valign: 'top'
            });
        }
    }
    addTeacherNotes(pptx, slide, s.teacherNotes);
}
async function buildPptx(presentation) {
    const pptx = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pptxgenjs$2f$dist$2f$pptxgen$2e$es$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]();
    pptx.layout = 'LAYOUT_WIDE';
    pptx.title = presentation.title;
    pptx.subject = `English Lesson – Grade ${presentation.grade}`;
    const band = (0, __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$lesson$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getGradeBand"])(presentation.grade);
    const theme = THEMES[band];
    for (const slide of presentation.slides){
        const ct = slide.content.type;
        if (slide.type === 'title' || ct === 'title') {
            addTitleSlide(pptx, slide, theme, presentation);
        } else if (ct === 'vocabulary') {
            addVocabularySlide(pptx, slide, theme);
        } else if (ct === 'grammar') {
            addGrammarSlide(pptx, slide, theme);
        } else if (ct === 'reading') {
            addReadingSlide(pptx, slide, theme);
        } else if (ct === 'activity') {
            addActivitySlide(pptx, slide, theme);
        } else {
            addBulletsSlide(pptx, slide, theme);
        }
    }
    return await pptx.write({
        outputType: 'nodebuffer'
    });
}
}),
"[project]/app/api/export/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pptx$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/pptx.ts [app-route] (ecmascript)");
;
;
async function POST(request) {
    try {
        const presentation = await request.json();
        const buffer = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pptx$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buildPptx"])(presentation);
        const safeTitle = presentation.title.replace(/[^a-zA-Z0-9\s-]/g, '').trim() || 'lesson';
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](new Uint8Array(buffer), {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'Content-Disposition': `attachment; filename="${safeTitle}.pptx"`
            }
        });
    } catch (err) {
        console.error('Export error:', err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: err instanceof Error ? err.message : 'Export failed'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0eoxk31._.js.map