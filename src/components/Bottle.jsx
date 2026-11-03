import Picture from './Picture.jsx';

// A flavor's bottle (PET bottle with a screw cap in the flavor color), from the cutout image.
// Never shows a size: the volume is unknown.
export default function Bottle({ flavor, sizes = '224px', className = '', priority = false }) {
  return (
    <Picture
      name={flavor.bottleImage}
      alt={`${flavor.name} Hipz bottle`}
      sizes={sizes}
      priority={priority}
      className={className}
      imgClassName="h-auto w-full"
    />
  );
}
