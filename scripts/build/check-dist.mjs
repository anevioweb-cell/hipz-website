// Fails when dist/ contains a creator image that no page uses (see scripts/build/creator-images.mjs).
import { unusedCreatorFiles } from './creator-images.mjs';

const extra = unusedCreatorFiles('dist');
if (extra.length) {
  console.error(
    `✖ dist/ contains ${extra.length} unused creator image(s):\n  ${extra.join('\n  ')}`,
  );
  process.exit(1);
}
console.log('✔ dist/ contains only creator images that a page uses.');
