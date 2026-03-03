import type { Book, ReaderFont } from './types';

export const READER_FONTS: ReaderFont[] = [
  { id: 'lora', name: 'Lora', family: 'serif' },
  { id: 'playfair', name: 'Playfair', family: 'serif' },
  { id: 'garamond', name: 'Garamond', family: 'serif' },
  { id: 'spectral', name: 'Spectral', family: 'serif' },
];

type RawBook = Omit<Book, 'chunks' | 'totalChunks'>;

const RAW_BOOKS: RawBook[] = [
  {
    id: '1',
    title: "Alice's Adventures in Wonderland",
    author: 'Lewis Carroll',
    synopsis:
      'A young girl falls into a surreal world of paradox, wit, and wonder. A classic about curiosity, identity, and imagination.',
    coverUrl:
      'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1000&auto=format&fit=crop',
    progress: 0,
    content: `Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do.

So she was considering in her own mind whether making a daisy-chain would be worth the trouble when suddenly a White Rabbit with pink eyes ran close by her.

There was nothing so very remarkable in that. But when the Rabbit took a watch out of its waistcoat-pocket and hurried on, Alice started to her feet.

She had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it. Burning with curiosity, she ran after it.

In another moment down went Alice after it, never once considering how in the world she was to get out again.

Either the well was very deep, or she fell very slowly, for she had plenty of time as she went down to look about her and to wonder what was going to happen next.`,
  },
  {
    id: '2',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    synopsis:
      'Nick Carraway recounts glamour and emptiness in the Jazz Age as Gatsby chases an impossible dream.',
    coverUrl:
      'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=1000&auto=format&fit=crop',
    progress: 0,
    content: `In my younger and more vulnerable years my father gave me some advice that I have been turning over in my mind ever since.

"Whenever you feel like criticizing anyone," he told me, "just remember that all the people in this world have not had the advantages that you have had."

In consequence, I am inclined to reserve all judgments, a habit that has opened up many curious natures to me.

When I came back from the East last autumn I felt that I wanted the world to be in uniform and at a sort of moral attention forever.

Only Gatsby, the man who gives his name to this book, was exempt from my reaction.`,
  },
  {
    id: '3',
    title: 'The Art of War',
    author: 'Sun Tzu',
    synopsis:
      'A concise strategic treatise on conflict, leadership, discipline, and adaptation that remains relevant today.',
    coverUrl:
      'https://images.unsplash.com/photo-1732714403349-05fc43b67042?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    progress: 0,
    content: `Sun Tzu said: The art of war is of vital importance to the state.

It is a matter of life and death, a road either to safety or to ruin.

The art of war is governed by constant factors to be considered in all deliberations.

These are the Moral Law, Heaven, Earth, the Commander, and Method and Discipline.

By means of these considerations, one can forecast victory or defeat.`,
  },
];

export function chunkText(text: string, charsPerChunk: number = 400): string[] {
  const chunks: string[] = [];
  let currentIndex = 0;

  while (currentIndex < text.length) {
    let endIndex = Math.min(currentIndex + charsPerChunk, text.length);
    if (endIndex < text.length) {
      const lookahead = text.substring(currentIndex, endIndex + 100);
      const lastSentenceEnd = Math.max(
        lookahead.lastIndexOf('. '),
        lookahead.lastIndexOf('! '),
        lookahead.lastIndexOf('? '),
        lookahead.lastIndexOf('.\n'),
        lookahead.lastIndexOf('"\n')
      );
      if (lastSentenceEnd !== -1 && lastSentenceEnd < charsPerChunk + 80) {
        endIndex = currentIndex + lastSentenceEnd + 1;
      } else {
        const lastSpace = text.lastIndexOf(' ', endIndex);
        if (lastSpace > currentIndex) endIndex = lastSpace;
      }
    }

    const chunk = text.substring(currentIndex, endIndex).trim();
    if (chunk.length > 0) chunks.push(chunk);
    currentIndex = endIndex + 1;
  }

  return chunks;
}

export function buildMockBooks(): Book[] {
  return RAW_BOOKS.map((book) => {
    const chunks = chunkText(book.content);
    return { ...book, chunks, totalChunks: chunks.length };
  });
}

