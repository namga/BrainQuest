# Netlify deploy notes — Brain Quest v0.4.2

## Recommended setup
- Netlify Base directory: leave blank if the repository root contains package.json and netlify.toml.
- Build command: npm install --no-audit --no-fund && npm run build
- Publish directory: dist
- Node version: 22 (set NODE_VERSION=22 in Site configuration > Environment variables if needed).

## Important
Push the contents of the brain-quest directory to the Git repository root, not the enclosing parent directory. The repository root should contain package.json, netlify.toml, index.html, src/, and public/.

The Netlify build no longer runs the optional puzzle audit before building, so an audit-script mismatch cannot block deployment. You can still run npm run audit:puzzles separately in GitHub Actions or locally.
