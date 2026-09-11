# Kaolin

Vercel compatible deployment of the supplied Sedlecky Kaolin landing page.

The project snapshots the public homepage during the Vercel build, writes it to `public/index.html`, and serves the compiled Next.js assets, media, fonts and linked routes through transparent Vercel rewrites to their original public origins. This avoids a Node server and keeps deployment fully static at the root.

## Build

```bash
npm run build
```

For offline validation against the supplied capture:

```bash
KAOLIN_SOURCE_FILE=/path/to/index.html npm run build
```
