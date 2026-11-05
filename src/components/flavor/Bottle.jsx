import Picture from '../ui/Picture.jsx';

// A flavor's bottle (PET bottle with a screw cap in the flavor color), from the cutout image.
// The image never carries a size; the volume is only written as text in "The basics".
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
      imgClassName={imgClassName}
    />
  );
}
