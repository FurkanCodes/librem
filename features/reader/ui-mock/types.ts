export type AppTheme = 'light' | 'dark';

export type ReaderTheme = 'light' | 'sepia' | 'dark' | 'immersive';

export type ReaderMode = 'vertical' | 'horizontal';

export type ReaderFontId = 'lora' | 'playfair' | 'garamond' | 'spectral';

export type ReaderFont = {
  id: ReaderFontId;
  name: string;
  family: string;
};

export type Book = {
  id: string;
  title: string;
  author: string;
  synopsis: string;
  coverUrl: string;
  content: string;
  chunks: string[];
  progress: number;
  totalChunks: number;
};

export type Highlight = {
  id: string;
  bookId: string;
  chunkIndex: number;
  text: string;
  createdAt: string;
};

export type ReadingStreak = {
  streak: number;
  lastDateISO: string;
};

export type ReaderPreferences = {
  theme: ReaderTheme;
  mode: ReaderMode;
  fontId: ReaderFontId;
  fontSize: number;
  slowRead: boolean;
  hapticEnabled: boolean;
  autoNightEnabled: boolean;
  wpm: number;
};

export type ReaderSession = {
  currentBookId: string | null;
  currentChunkIndex: number;
  visitedChunkIndices: number[];
};

export type ReaderState = {
  books: Book[];
  highlights: Highlight[];
  streak: ReadingStreak;
  appTheme: AppTheme;
  preferences: ReaderPreferences;
  session: ReaderSession;
  hydrated: boolean;
};

