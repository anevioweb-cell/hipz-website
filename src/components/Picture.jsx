import { useState } from 'react';
import { images } from '../data/images.generated.js';

const PORTRAIT_MEDIA = '(max-aspect-ratio: 1/1)';

// Responsive <picture> (AVIF → WebP → JPG/PNG) with explicit width/height from the build metadata,
// so the browser reserves space and there is no layout shift. Variants are made by `npm run images`.
// Art direction: pass `portrait` (an image name) to serve a different crop on portrait viewports.
// A failed image hides itself (keeps its reserved size: no broken-image icon, no layout shift); the
// frame or card behind it shows its own colour.
export default function Picture({
  name,
  portrait,
  alt,
  sizes = '100vw',
  priority = false,
  className = '',
  imgClassName = '',
  onError,
  style,
  ...rest
}) {
  const [failed, setFailed] = useState(false);
  const meta = images[name];
  if (!meta) return null;
  const fallbackExt = meta.kind === 'scene' ? 'jpg' : 'png';
  const set = (n, ext) =>
    images[n].variants.map((v) => `/images/${n}-${v.width}.${ext} ${v.width}w`).join(', ');
  const largest = meta.variants[meta.variants.length - 1];
  const pMeta = portrait ? images[portrait] : null;
  return (
    <picture className={className}>
      {pMeta && (
        <source
          media={PORTRAIT_MEDIA}
          type="image/avif"
          srcSet={set(portrait, 'avif')}
          sizes={sizes}
        />
      )}
      {pMeta && (
        <source
          media={PORTRAIT_MEDIA}
          type="image/webp"
          srcSet={set(portrait, 'webp')}
          sizes={sizes}
        />
      )}
      <source type="image/avif" srcSet={set(name, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={set(name, 'webp')} sizes={sizes} />
      <img
        src={`/images/${name}-${largest.width}.${fallbackExt}`}
        srcSet={set(name, fallbackExt)}
        sizes={sizes}
        width={largest.width}
        height={largest.height}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        className={imgClassName}
        style={failed ? { ...style, visibility: 'hidden' } : style}
        onError={(e) => {
          setFailed(true);
          onError?.(e);
        }}
        data-failed={failed || undefined}
        {...rest}
      />
    </picture>
  );
}
