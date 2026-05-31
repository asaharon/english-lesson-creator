export type GradeBand = 1 | 2 | 3 | 4; // 1=Gr1-2, 2=Gr3-4, 3=Gr5-6, 4=Gr7-8
export type LessonType = 'vocabulary' | 'grammar' | 'reading' | 'speaking';
export type SlideType =
  | 'title' | 'warmup' | 'objectives' | 'vocabulary' | 'grammar'
  | 'reading' | 'speaking' | 'activity' | 'game' | 'song' | 'practice'
  | 'wrapup' | 'homework';

export interface VocabularyWord {
  word: string;
  definition: string;
  emoji?: string;
  example?: string;
  wikiTopic?: string; // Wikipedia article title for photo lookup
}

export interface TitleContent { type: 'title'; emoji?: string }
export interface BulletsContent { type: 'bullets'; bullets: string[]; emoji?: string }
export interface VocabularyContent { type: 'vocabulary'; words: VocabularyWord[] }
export interface GrammarContent {
  type: 'grammar';
  rule: string;
  structure?: string;
  examples: string[];
  emoji?: string;
}
export interface ReadingContent { type: 'reading'; text: string; questions: string[] }
export interface ActivityContent {
  type: 'activity';
  activityType: 'game' | 'exercise' | 'discussion' | 'song';
  instructions: string[];
  instructionTopics?: (string | null)[]; // Wikipedia topic per instruction item (for images)
  content?: string;
}

export type SlideContent =
  | TitleContent | BulletsContent | VocabularyContent
  | GrammarContent | ReadingContent | ActivityContent;

export interface Slide {
  id?: string;
  type: SlideType;
  title: string;
  subtitle?: string;
  content: SlideContent;
  duration: number;
  teacherNotes: string;
  emoji?: string;
  imageTopic?: string; // Wikipedia article title for slide background photo
}

export interface Presentation {
  id: string;
  title: string;
  grade: number;
  topic: string;
  lessonTypes: LessonType[];
  createdAt: string;
  slides: Slide[];
  totalDuration: number;
}

export interface LessonFormData {
  grade: number;
  topic: string;
  lessonTypes: LessonType[];
  specificContent?: string;
  includeGames: boolean;
  includeSongs: boolean;
  includeHomework: boolean;
}

export function getGradeBand(grade: number): GradeBand {
  if (grade <= 2) return 1;
  if (grade <= 4) return 2;
  if (grade <= 6) return 3;
  return 4;
}

export function getGradeBandLabel(grade: number): string {
  const labels: Record<GradeBand, string> = {
    1: 'Young Learners · A1',
    2: 'Elementary · A1–A2',
    3: 'Pre-Intermediate · A2',
    4: 'Intermediate · A2–B1',
  };
  return labels[getGradeBand(grade)];
}
