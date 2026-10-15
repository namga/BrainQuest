# Brain Quest v0.4.5 — build fix

Fixed TypeScript errors in src/main.ts generatedPuzzle(): the question factory already returns string[] answers and a correct-answer index. The previous code incorrectly passed a string into a numeric answer generator and then assigned number[] to string[]. The redundant second answer-generation step was removed.

## Netlify
Build command: `npm install --no-audit --no-fund && npm run build`
Publish directory: `dist`
Node: 22

For the Netlify ZIP, upload the contents of this folder as the repository root (the folder containing package.json, netlify.toml, index.html, src/, and public/).

## GitHub
For the GitHub ZIP, upload the contents of the `brain-quest` folder to the repository root. The existing Actions workflows will run the TypeScript build and puzzle audit.
