import { images } from '../data/images.generated.js';

// Responsive <picture> (AVIF → WebP → JPG/PNG) with explicit width/height from the build metadata,
// so the browser reserves space and there is no layout shift. Variants are made by `npm run images`.
export default function Picture({
  name,
  alt,
  sizes = '100vw',
  priority = false,
  className = '',
  imgClassName = '',
  ...rest
}) {
  const meta = images[name];
  if (!meta) return null;
  const fallbackExt = meta.kind === 'scene' ? 'jpg' : 'png';
  const set = (ext) =>
    meta.variants.map((v) => `/images/${name}-${v.width}.${ext} ${v.width}w`).join(', ');
  const largest = meta.variants[meta.variants.length - 1];
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={set('webp')} sizes={sizes} />
      <img
        src={`/images/${name}-${largest.width}.${fallbackExt}`}
        srcSet={set(fallbackExt)}
        sizes={sizes}
        width={largest.width}
        height={largest.height}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        className={imgClassName}
        {...rest}
      />
    </picture>
  );
}
