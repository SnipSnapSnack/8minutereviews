#!/usr/bin/env node
/*
 * Structure checker for Dan's 8 Minute Reviews (reverse-indexed pagination).
 * Read-only: validates the page chain, "Page X of N" counters, pagination /
 * page-numbers / y2k link targets, and per-page review counts.
 *
 * Usage:  node .claude/skills/add-review/verify.cjs
 * Exits non-zero if anything is wrong.
 */
const fs = require('fs');
const path = require('path');

const REPO = path.resolve(__dirname, '..', '..', '..'); // skill lives in .claude/skills/add-review
const CAP = 6; // max reviews per page

// Discover pages: page1..pageK are archives (oldest->newer); index.html is newest.
const archives = fs.readdirSync(REPO)
  .filter(f => /^page\d+\.html$/.test(f))
  .sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]));
const N = archives.length + 1; // + index.html
const fileFor = n => (n === N ? 'index.html' : `page${n}.html`);

const problems = [];
const fail = (file, msg) => problems.push(`${file}: ${msg}`);
const read = f => fs.readFileSync(path.join(REPO, f), 'utf8');

// Sanity: archives must be exactly page1..page{N-1} with no gaps.
archives.forEach((f, i) => {
  const num = parseInt(f.match(/\d+/)[0]);
  if (num !== i + 1) fail(f, `unexpected page number; expected page${i + 1}.html (no gaps allowed)`);
});

function linkTarget(html, label) {
  // Find the anchor/span for a nav label; return its href, or 'disabled', or null.
  const re = new RegExp(`<(a|span)([^>]*)>\\s*(?:&laquo;&laquo;\\s*)?${label}`, 'i');
  const m = html.match(re);
  if (!m) return null;
  if (m[1].toLowerCase() === 'span') return 'disabled';
  const href = m[2].match(/href="([^"]+)"/);
  return href ? href[1] : null;
}

function checkPage(n) {
  const file = fileFor(n);
  const html = read(file);
  const older = n > 1 ? fileFor(n - 1) : 'disabled'; // Older / Prev  -> lower number
  const newer = n < N ? fileFor(n + 1) : 'disabled'; // Newer / Next  -> higher number

  // 1. "Page X of N" must appear (h2 + both pagination bars => at least 3 times).
  const label = `Page ${n} of ${N}`;
  const count = (html.match(new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
  if (count < 3) fail(file, `expected "${label}" at least 3× (h2 + 2 pagination bars), found ${count}`);

  // 2. Pagination Newer/Older targets.
  const gotNewer = linkTarget(html, 'Newer Reviews');
  const gotOlder = linkTarget(html, 'Older Reviews');
  if (gotNewer !== newer) fail(file, `"Newer Reviews" -> ${gotNewer}, expected ${newer}`);
  if (gotOlder !== older) fail(file, `"Older Reviews" -> ${gotOlder}, expected ${older}`);

  // 3. y2k Prev(=older)/Next(=newer) targets.
  const gotPrev = linkTarget(html, 'Prev');
  const gotNext = linkTarget(html, 'Next');
  if (gotPrev !== older) fail(file, `y2k "Prev" -> ${gotPrev}, expected ${older}`);
  if (gotNext !== newer) fail(file, `y2k "Next" -> ${gotNext}, expected ${newer}`);

  // 4. page-numbers bar: entries 1..N, current = n, each links to fileFor(i).
  const pn = html.match(/<div class="page-numbers">([\s\S]*?)<\/div>/);
  if (!pn) { fail(file, 'missing page-numbers bar'); }
  else {
    for (let i = 1; i <= N; i++) {
      if (i === n) {
        if (!new RegExp(`<span class="current">${i}</span>`).test(pn[1]))
          fail(file, `page-numbers: current should be <span class="current">${i}</span>`);
      } else {
        const re = new RegExp(`<a href="${fileFor(i).replace('.', '\\.')}">${i}</a>`);
        if (!re.test(pn[1])) fail(file, `page-numbers: entry ${i} should link to ${fileFor(i)}`);
      }
    }
  }

  // 5. Review count within capacity.
  const reviews = (html.match(/class="review-card/g) || []).length;
  if (reviews > CAP) fail(file, `${reviews} reviews exceeds capacity of ${CAP}`);
  if (reviews === 0) fail(file, 'no reviews on page');

  // 6. Title tag page number.
  const title = html.match(/<title>[^<]*Page (\d+)[^<]*<\/title>/);
  if (title && parseInt(title[1]) !== n) fail(file, `<title> says Page ${title[1]}, expected ${n}`);

  return reviews;
}

console.log(`Checking ${N} pages (page1..page${N - 1} + index.html)...\n`);
let total = 0;
for (let n = 1; n <= N; n++) total += checkPage(n);

// Cross-page: dates should run oldest (page1) -> newest (index).
console.log(`Total reviews: ${total}`);
if (problems.length === 0) {
  console.log('\n✓ PASS — pagination chain, counters, and links are consistent.');
  process.exit(0);
} else {
  console.log(`\n✗ FAIL — ${problems.length} problem(s):`);
  for (const p of problems) console.log('  - ' + p);
  process.exit(1);
}
