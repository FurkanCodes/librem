import React, { createContext, useContext, useMemo, useReducer } from 'react';

import { buildMockBooks } from './data';
import { APP_TOKENS, READER_TOKENS } from './tokens';
import type {
  AppTheme,
  Book,
  Highlight,
  ReaderMode,
  ReaderPreferences,
  ReaderSession,
  ReaderState,
  ReaderTheme,
} from './types';

type Action =
  | { type: 'toggle_highlight'; bookId: string; chunkIndex: number; text: string }
  | { type: 'set_progress'; bookId: string; progress: number }
  | { type: 'set_app_theme'; theme: AppTheme }
  | { type: 'set_reader_theme'; theme: ReaderTheme }
  | { type: 'set_reader_mode'; mode: ReaderMode }
  | { type: 'set_font_size'; size: number }
  | { type: 'set_font_id'; fontId: ReaderPreferences['fontId'] }
  | { type: 'set_slow_read'; value: boolean }
  | { type: 'set_wpm'; value: number }
  | { type: 'set_haptic'; value: boolean }
  | { type: 'set_auto_night'; value: boolean }
  | { type: 'set_session'; session: Partial<ReaderSession> }
  | { type: 'set_streak'; streak: number };

const initialState: ReaderState = {
  books: buildMockBooks(),
  highlights: [],
  streak: {
    streak: 7,
    lastDateISO: new Date(Date.now() - 86400000).toISOString().split('T')[0],
  },
  appTheme: 'light',
  preferences: {
    theme: 'immersive',
    mode: 'vertical',
    fontId: 'lora',
    fontSize: 20,
    slowRead: false,
    hapticEnabled: true,
    autoNightEnabled: false,
    wpm: 220,
  },
  session: {
    currentBookId: null,
    currentChunkIndex: 0,
    visitedChunkIndices: [],
  },
  hydrated: true,
};

function generateHighlightId(bookId: string, chunkIndex: number, text: string): string {
  const textSeed = text.substring(0, 16).replace(/\s+/g, '-').toLowerCase();
  return `${bookId}:${chunkIndex}:${textSeed}`;
}

function reducer(state: ReaderState, action: Action): ReaderState {
  switch (action.type) {
    case 'toggle_highlight': {
      const highlightId = generateHighlightId(action.bookId, action.chunkIndex, action.text);
      const exists = state.highlights.some((highlight) => highlight.id === highlightId);
      if (exists) {
        return {
          ...state,
          highlights: state.highlights.filter((highlight) => highlight.id !== highlightId),
        };
      }
      const newHighlight: Highlight = {
        id: highlightId,
        bookId: action.bookId,
        chunkIndex: action.chunkIndex,
        text: action.text,
        createdAt: new Date().toISOString(),
      };
      return { ...state, highlights: [...state.highlights, newHighlight] };
    }
    case 'set_progress':
      return {
        ...state,
        books: state.books.map((bookItem) =>
          bookItem.id === action.bookId ? { ...bookItem, progress: action.progress } : bookItem
        ),
      };
    case 'set_app_theme':
      return { ...state, appTheme: action.theme };
    case 'set_reader_theme':
      return { ...state, preferences: { ...state.preferences, theme: action.theme } };
    case 'set_reader_mode':
      return { ...state, preferences: { ...state.preferences, mode: action.mode } };
    case 'set_font_size':
      return { ...state, preferences: { ...state.preferences, fontSize: action.size } };
    case 'set_font_id':
      return { ...state, preferences: { ...state.preferences, fontId: action.fontId } };
    case 'set_slow_read':
      return { ...state, preferences: { ...state.preferences, slowRead: action.value } };
    case 'set_wpm':
      return { ...state, preferences: { ...state.preferences, wpm: action.value } };
    case 'set_haptic':
      return { ...state, preferences: { ...state.preferences, hapticEnabled: action.value } };
    case 'set_auto_night':
      return { ...state, preferences: { ...state.preferences, autoNightEnabled: action.value } };
    case 'set_session':
      return { ...state, session: { ...state.session, ...action.session } };
    case 'set_streak':
      return {
        ...state,
        streak: {
          streak: action.streak,
          lastDateISO: new Date().toISOString().split('T')[0],
        },
      };
    default:
      return state;
  }
}

type ReaderUIContextValue = {
  state: ReaderState;
  books: Book[];
  appTokens: typeof APP_TOKENS.light;
  readerTokens: typeof READER_TOKENS.light;
  getBook: (bookId: string) => Book | undefined;
  getHighlightForChunk: (bookId: string, chunkIndex: number) => Highlight | undefined;
  toggleHighlight: (bookId: string, chunkIndex: number, text: string) => void;
  setBookProgress: (bookId: string, progress: number) => void;
  setAppTheme: (theme: AppTheme) => void;
  setReaderTheme: (theme: ReaderTheme) => void;
  setReaderMode: (mode: ReaderMode) => void;
  setFontSize: (fontSize: number) => void;
  setFontId: (fontId: ReaderPreferences['fontId']) => void;
  setSlowRead: (value: boolean) => void;
  setWpm: (value: number) => void;
  setHapticEnabled: (value: boolean) => void;
  setAutoNightEnabled: (value: boolean) => void;
  setSession: (session: Partial<ReaderSession>) => void;
  setStreak: (streak: number) => void;
};

const ReaderUIContext = createContext<ReaderUIContextValue | null>(null);

export function ReaderUIMockProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const contextValue = useMemo<ReaderUIContextValue>(() => {
    return {
      state,
      books: state.books,
      appTokens: APP_TOKENS[state.appTheme],
      readerTokens: READER_TOKENS[state.preferences.theme],
      getBook: (bookId) => state.books.find((bookItem) => bookItem.id === bookId),
      getHighlightForChunk: (bookId, chunkIndex) =>
        state.highlights.find((highlight) => highlight.bookId === bookId && highlight.chunkIndex === chunkIndex),
      toggleHighlight: (bookId, chunkIndex, text) =>
        dispatch({ type: 'toggle_highlight', bookId, chunkIndex, text }),
      setBookProgress: (bookId, progress) => dispatch({ type: 'set_progress', bookId, progress }),
      setAppTheme: (theme) => dispatch({ type: 'set_app_theme', theme }),
      setReaderTheme: (theme) => dispatch({ type: 'set_reader_theme', theme }),
      setReaderMode: (mode) => dispatch({ type: 'set_reader_mode', mode }),
      setFontSize: (fontSize) => dispatch({ type: 'set_font_size', size: fontSize }),
      setFontId: (fontId) => dispatch({ type: 'set_font_id', fontId }),
      setSlowRead: (value) => dispatch({ type: 'set_slow_read', value }),
      setWpm: (value) => dispatch({ type: 'set_wpm', value }),
      setHapticEnabled: (value) => dispatch({ type: 'set_haptic', value }),
      setAutoNightEnabled: (value) => dispatch({ type: 'set_auto_night', value }),
      setSession: (session) => dispatch({ type: 'set_session', session }),
      setStreak: (streak) => dispatch({ type: 'set_streak', streak }),
    };
  }, [state]);

  return <ReaderUIContext.Provider value={contextValue}>{children}</ReaderUIContext.Provider>;
}

export function useReaderUIState() {
  const context = useContext(ReaderUIContext);
  if (!context) {
    throw new Error('useReaderUIState must be used inside ReaderUIMockProvider');
  }
  return context;
}

