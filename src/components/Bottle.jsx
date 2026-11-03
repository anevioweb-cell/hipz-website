import Picture from './Picture.jsx';

// A flavor's bottle (PET bottle with a screw cap in the flavor color), from the cutout image.
// Never shows a size: the volume is unknown.
export default function Bottle({
  flavor,
  sizes = '224px',
  className = '',
  imgClassName = 'h-auto w-full',
  priority = false,
}) {
  return (
    <Picture
      name={flavor.images.bottle}
      alt={`${flavor.name} Hipz bottle`}
      sizes={sizes}
      priority={priority}
      className={className}
      imgClassName={`${imgClassName} ${flavor.images.bottleCropped ? 'bottle-fade' : ''}`}
    />
  );
}
