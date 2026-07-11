---
name: add-review
description: >-
  Add a new movie review to Dan's 8 Minute Reviews. Use whenever the user hands
  you a review to publish — a regular 8-minute review or a Theater Popcorn Review.
  Formats the review into the site's HTML, places it on the correct
  (reverse-indexed) page, spawns and flavors a new page when the newest one is
  full, updates pagination, and opens a PR.
---

# Add a Review

This site (Dan's 8 Minute Reviews) is a hand-authored retro static site on GitHub
Pages. This skill adds a review by editing the HTML directly — there is **no build
step**. Keep the "Made with Notepad" charm intact.

## The pagination model (READ THIS FIRST — it is reverse-indexed)

Reviews are split across pages. **Oldest reviews are on `page1.html`; the newest
reviews live on `index.html`.** Pages are numbered `1 .. N` where `N` = total
pages, and **`index.html` is page `N`** (the newest, and the landing page).

```
page1.html   = Page 1 of N   OLDEST reviews   (frozen — never changes)
page2.html   = Page 2 of N
...
page{N-1}.html
index.html   = Page N of N   NEWEST reviews   (the active page appends land here)
```

Why reverse-indexed: adding a review only ever touches `index.html`. A page only
"fills up" at the newest end, so growth appends a new page at the end instead of
cascading every review down a page. Old pages stay immutable.

**Navigation semantics (same on every page):**
- `«« Newer Reviews` → the next *higher*-numbered page (toward `index.html`).
  Disabled on `index.html` (nothing newer).
- `Older Reviews »»` → the next *lower*-numbered page. Disabled on `page1.html`.
- `y2k` bar: `Prev` = Older (lower page), `Next` = Newer (higher page).
- `page-numbers` bar lists `1..N`; number `N` links to `index.html`, the rest to
  `pageK.html`; the current page is a `<span class="current">`.

**Within a page, reviews are newest-at-top.** So the very top of `index.html` is
the single newest review on the whole site.

**Page capacity: 6 reviews.** A page may hold up to 6 review-cards.

## Step 1 — Parse the review the user gave you

Extract:
- **Title** (movie name).
- **Date** — normalize to `Month D, YYYY` (e.g. `July 6, 2026`). If the user gives
  a bare date like "June 5", assume the current year unless context says otherwise.
- **Body** — the review text, as one or more short paragraphs, preserving the
  author's voice. Fix only obvious typos (see VOICE.md); keep intentional bits.
- **Rating** — emoji/score line, if any.
- **Type** — regular review, or **Theater Popcorn Review** (the user will say
  "Popcorn Review" / "Popcorn Rating", or mention seeing it in a theater / not
  being able to pause). Popcorn reviews are rated in 🍿 out of 5.

If anything essential is ambiguous (which year, is this a popcorn review), ask.

## Step 2 — Format the review card

**Regular review:**
```html
    <!-- ============== Mon D YYYY ============== -->
    <div class="review-card">
      <p class="review-date">July 6, 2026</p>
      <h3><i>Movie Title</i></h3>
      <p>First paragraph of the review.</p>
      <p>Another paragraph.</p>
      <p class="stars-emoji">⭐⭐⭐</p>
    </div>
```
- The `<h3>` title is playful — match existing patterns: `<i>Title</i>`,
  `8 Minutes of <i>Title</i>`, `13 Minutes of <i>Title</i>`,
  `First Ten Minutes of <i>Title</i>`, or a bespoke riff that captures an odd
  runtime (e.g. `5:30 + a Long Pizza Break + ~4:00 of <i>Sheep Detectives</i>`).
- The rating `<p class="stars-emoji">` line is **optional** — many reviews have none.
- Emoji may be pasted literally (e.g. `🐏🐑`) or as HTML entities
  (`&#x1F52A;`) — both are used on the site. Literal is fine.
- Use `<span class="spoiler">…</span>` for spoilers, `<blockquote class="pullquote">`
  for pulled quotes, and the `.update` block for "added later" notes (see any
  existing page for the markup).

**Theater Popcorn Review** (add the `popcorn` class + tag + `popcorn-rating`):
```html
    <!-- ============== Mon D YYYY ============== -->
    <div class="review-card popcorn">
      <p class="review-date">June 6, 2026</p>
      <span class="popcorn-tag">🍿 Theater Popcorn Review 🍿</span>
      <h3><i>Movie Title</i></h3>
      <p>The review — how good the movie was, framed by how much popcorn was left.</p>
      <p class="popcorn-rating">🍿🍿🍿🍿 / 5</p>
    </div>
```
- The rating is popcorn emoji out of 5; the author sometimes adds a bonus food
  emoji (e.g. `🍿🍿🍿🍿 🍛 / 5`). Preserve whatever they give.
- The `.popcorn` styling (red popcorn-box border, stripes, ribbon tag) lives in
  `styles.css`. Don't duplicate CSS.

## Step 3 — Place the review

**Common case — the review is the newest (its date is ≥ the current top review
on `index.html`):**
1. Count `review-card` blocks in `index.html`.
2. If **fewer than 6**: insert the new card at the **top** of the review list —
   immediately after the first `</div>` that closes the top `<div class="pagination">`.
   That's the only change. Done — go to Step 5.
3. If **already 6** (full): do the **rollover** in Step 4, then this new review
   becomes the sole card on the fresh `index.html`.

**Out-of-order case — the review is older than the newest** (backfilling): find
the page whose date range brackets the review, and insert it in date order
(newest-at-top) on that page. If that page would exceed 6 cards, push its oldest
card down onto the next *older* page, cascading toward `page1.html` (which, as the
oldest page, simply absorbs the overflow). This is rare — confirm with the user
before reshuffling multiple pages.

## Step 4 — Rollover (only when the newest page is full)

Let `N` = current total pages (so `index.html` is currently `Page N of N`).
Adding a page makes the new total `N+1`.

1. **Freeze the current newest bucket.** Create `page{N}.html` containing the 6
   reviews currently in `index.html`, using the **archive page template** (copy the
   structure of any existing `pageK.html`): marquee → h1/tagline/nav → h2 → top
   pagination → the 6 review cards → bottom pagination → page-numbers → y2k →
   footer → `sparkles.js`. Label it `Page N of {N+1}`.
   Do **not** carry over `index.html`'s home-only chrome (press-quote,
   under-construction banner, visitor counter, newsletter line, `popup.js`)
   — those belong only to the home/newest page.
2. **Reset `index.html`** to the new newest page: keep its home chrome, relabel it
   `Page {N+1} of {N+1}`, replace its review list with just the new review, set
   `Older Reviews`/`Prev` → `page{N}.html`, keep `Newer`/`Next` disabled.
3. **Bump the counters on every page** (`page1 … page{N}` and `index.html`):
   - `Page X of N` → `Page X of {N+1}` in the `<h2>` and both pagination bars.
   - In every `page-numbers` bar: the entry `N` currently links to `index.html` —
     repoint it to `page{N}.html` — and append a new entry `{N+1}` linking to
     `index.html`. Fix the `current` highlight per page.
   - The newest archive page (`page{N}.html`) gets `Newer` → `index.html`.
4. **Flavor the new page.** `page{N}.html` is now a *mid* page and needs its own
   marquee + y2k tagline + footer quip. Generate and vet these per **VOICE.md**
   (Step 4a). The "beginning" flavor on `page1.html` and the home flavor on
   `index.html` are stable — leave them.
5. **Re-vet number-locked flavor.** Any marquee/tagline that references a page
   count or position (e.g. `FIVE OUTTA SIX AINT BAD`, `PAGE 4 OF 6`, "six whole
   pages") is now stale. Scan all pages and update/re-vet those. See VOICE.md
   → "Volatile flavor."

### Step 4a — Generate & vet flavor (the part that can't be mechanical)

Read **VOICE.md** in this skill folder, then:
1. Draft **3–4 candidate marquees** and **2–3 y2k taglines** in Dan's voice.
2. Self-check each against VOICE.md: right voice, correct any page number it
   states, not a duplicate of another page's line, lands the joke, not mean-
   spirited toward real people.
3. **Present the top candidates to the user with `AskUserQuestion` and let them
   pick/approve** before committing. Flavor is subjective — the human is the vet.

## Step 5 — Verify, commit, PR

1. Run the structure check: `node .claude/skills/add-review/verify.cjs`. It
   validates the page chain, counters, link targets, and per-page review counts.
   Fix anything it flags.
2. Optionally screenshot the changed page(s) with the project's browser to eyeball
   the render (see prior sessions for the Playwright one-liner).
3. Create/commit on a working branch, push, and open a PR. **Do not auto-merge**
   unless the user asks. Keep the PR body to what changed (which review, and any
   new page/flavor).

## Quick reference

| Situation | Files touched |
|---|---|
| Newest page has room | `index.html` only |
| Newest page full (rollover) | new `page{N}.html`, `index.html`, + counter/nav bump on all pages, + new-page flavor |
| Backfill an old-dated review | the target page (rarely a small cascade toward `page1`) |
