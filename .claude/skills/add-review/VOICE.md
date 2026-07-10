# Voice & Flavor Guide — Dan's 8 Minute Reviews

Reference for writing and **vetting** the site's flavor text (marquees, y2k
taglines, footer quips) — especially when a new page is spawned.

## Who is "Dan"

A self-aware late-90s webmaster who reviews movies based on **only the first ~8
minutes** (sometimes 9, 22, or "whenever I remember to pause"). The persona:

- **Retro Web 1.0 to the bone.** Marquees, `<blink>`, visitor counter, "Best
  viewed in Netscape 4", 800×600, "Made with Notepad", Y2K jokes, AIM, Tamagotchi,
  AddictingGames.com, "All your base."
- **Irreverent, self-deprecating, a little crude.** Swearing and gross-out jokes
  appear; keep them punchy, never cruel toward real named people. The press quote
  literally trashes his own reviews — he's in on the joke.
- **Confidently wrong / jumping to conclusions** about plots he hasn't finished.
- **Dry running gags:** "(I bet it won't be relevant going forward :P)", thanking
  visitors for the traffic spike, mock-authoritative ratings in weird emoji.

## The flavor slots

Each page has three flavor slots. Keep them short; ALL CAPS only in the marquee.

1. **Marquee** (top scroller): a chain of punchy phrases separated by ` *** `,
   wrapped in leading/trailing `***`. ALL CAPS. 3–8 phrases. Can rhyme, pun, or
   free-associate. Example energy:
   `*** PAGE 5 OF 6 *** YOU KNOW WHAT THEY SAY *** FIVE OUTTA SIX AINT BAD *** KEEP IT RAD *** MOVE OVER LAD *** ... ***`
2. **y2k tagline** (bottom bar, one line between `Prev` / `Next`): a single goofy
   non-sequitur. Examples: "All your base are belong to us.", "This site is like
   your mom: easy on the eyes", "Don't catch the Dantavirus!!", "This site is 100%
   Tamagotchi-safe.", "Not as good as AddictingGames.com, but close!"
3. **Footer quip** (after the copyright): a short tag. Examples: "The Dude
   abides.", "Kid tested; animal approved.", "Animal tested; kid approved.",
   "Catch me on AIM for more info."

## Position-locked flavor (stable — do NOT rewrite on rollover)

- **`page1.html` (oldest):** the "this is the beginning / origin / oldest reviews
  in the vault" vibe. `Older`/`Prev` is disabled here. Tagline references reaching
  the very first reviews ("Mind the cobwebs").
- **`index.html` (newest / home):** the welcome marquee, the press quote, the
  visitor counter, the newsletter plug. `Newer`/`Next` is disabled here. This is
  the front door — keep it as-is across rollovers.

## Volatile flavor (MUST be re-vetted whenever the page count changes)

Any flavor that states a **page number or total** goes stale when a new page is
added. On rollover, grep every page for these and fix them:

- `PAGE X OF Y` in a marquee → the `Y` must equal the new total.
- Number puns like `FIVE OUTTA SIX AINT BAD` (page 5 of 6). If the total changes,
  either update the pun to the new numbers or replace it.
- Brags about the page count ("SIX WHOLE PAGES NOW", "we had to build an annex").
- The meta-joke marquee explaining the reverse-index ("PAGINATION RUNS BACKWARDS
  HERE, OLDEST IS PAGE 1") is number-agnostic and can stay.

**Tip:** prefer number-agnostic banter for mid pages so most rollovers are purely
mechanical. Save number puns for when they're worth the upkeep.

## Vetting checklist (run on every new/changed flavor line)

1. **Voice:** sounds like Dan — retro, irreverent, self-aware. Not corporate, not
   earnest, not an AI disclaimer.
2. **Numbers:** every page number / total it mentions is correct for the new layout.
3. **No duplicates:** doesn't repeat another page's marquee or tagline verbatim.
4. **Lands:** the joke/reference actually works; cut filler phrases that don't.
5. **Taste:** crude is fine; punching down at real, named people is not.
6. **Format:** marquee is ALL CAPS with ` *** ` separators; tagline is one line.

## How to vet: generate → check → let the user pick

When a new page needs flavor, draft 3–4 marquee candidates and 2–3 tagline
candidates, run them through the checklist above, then present the survivors to the
user with `AskUserQuestion` and let them choose or tweak. The user is the final
taste vet — don't silently commit invented flavor.
