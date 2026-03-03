export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export type Scale = {
  scale: number;
  scaleW: number;
  scaleH: number;
};

/**
 * A simple, predictable scaling model.
 * - anchored to iPhone 14-ish (390x844)
 * - clamped so UI doesn't become comically large/small
 */
export function getScale(width: number, height: number): Scale {
  const scaleW = clamp(width / 390, 0.82, 1.12);
  const scaleH = clamp(height / 844, 0.82, 1.08);
  return { scale: Math.min(scaleW, scaleH), scaleW, scaleH };
}

export type LibraryMetrics = {
  gutter: number;
  headerPadY: number;
  searchPadY: number;
  searchPadX: number;
  titleSize: number;
  subtitleSize: number;
  actionSize: number;

  bookWidth: number;
  bookHeight: number;
  navArrowSize: number;
};

export function getLibraryMetrics(args: {
  width: number;
  height: number;
  insetsTop: number;
  insetsBottom: number;
}): LibraryMetrics {
  const usableH = Math.max(1, args.height - args.insetsTop - args.insetsBottom);
  const { scale } = getScale(args.width, args.height);

  // Primary fix: cover art scales with available screen height.
  const bookHeight = clamp(Math.round(usableH * 0.34), 150, 255);
  const bookWidth = Math.round(bookHeight * 0.667);

  return {
    gutter: clamp(Math.round(20 * scale), 16, 22),
    headerPadY: clamp(Math.round(12 * scale), 8, 12),
    searchPadY: clamp(Math.round(10 * scale), 8, 11),
    searchPadX: clamp(Math.round(12 * scale), 10, 14),
    titleSize: clamp(Math.round(26 * scale), 20, 28),
    subtitleSize: clamp(Math.round(12 * scale), 11, 12),
    actionSize: clamp(Math.round(52 * scale), 44, 56),

    bookWidth,
    bookHeight,
    navArrowSize: clamp(Math.round(bookHeight * 0.14), 30, 38),
  };
}
