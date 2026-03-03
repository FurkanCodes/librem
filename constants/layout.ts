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

  // Adapt artwork size by phone class first, then by usable height.
  // This keeps small phones compact and lets larger phones breathe.
  const phoneArtworkScale = args.width <= 360 ? 0.92 : args.width >= 420 ? 1.08 : 1;
  const baseBookHeight = usableH * 0.35 * phoneArtworkScale;
  const bookHeight = clamp(Math.round(baseBookHeight), 145, 280);
  const bookWidth = Math.round(bookHeight * 0.667);

  return {
    gutter: clamp(Math.round(20 * scale), 16, 22),
    titleSize: clamp(Math.round(24 * scale), 20, 26),
    subtitleSize: clamp(Math.round(12 * scale), 11, 12),
    actionSize: clamp(Math.round(52 * scale), 44, 56),

    bookWidth,
    bookHeight,
    navArrowSize: clamp(Math.round(bookHeight * 0.14), 30, 38),
  };
}
