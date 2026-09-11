import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const sourceUrl = 'https://sedlecky-kaolin.com/';
const localSource = process.env.KAOLIN_SOURCE_FILE;

async function loadHomepage() {
  if (localSource) {
    return readFile(localSource);
  }

  let lastError;
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);
      const response = await fetch(sourceUrl, {
        redirect: 'follow',
        signal: controller.signal,
        headers: {
          'user-agent': 'Mozilla/5.0 (compatible; KaolinVercelSnapshot/1.0)',
          accept: 'text/html,application/xhtml+xml'
        }
      });
      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`Source returned HTTP ${response.status}`);
      }

      return Buffer.from(await response.arrayBuffer());
    } catch (error) {
      lastError = error;
      if (attempt < 4) {
        await new Promise(resolve => setTimeout(resolve, attempt * 1000));
      }
    }
  }

  throw new Error(`Unable to capture ${sourceUrl}: ${lastError?.message ?? 'unknown error'}`);
}

const html = await loadHomepage();
const digest = createHash('sha256').update(html).digest('hex');

await mkdir(new URL('../public/', import.meta.url), { recursive: true });
await writeFile(new URL('../public/index.html', import.meta.url), html);
console.log(`Kaolin homepage built: ${html.length} bytes, sha256 ${digest}`);
