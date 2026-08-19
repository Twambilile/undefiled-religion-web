# Undefiled Religion

A family funded giving project in Malawi supporting orphans and families in need
with school fees, food, supplies and clothing. Running since 10 October 2022.

This site publishes the money. Every transfer, which month, back to the first one
that was written down. There is no donate button and there never will be one on
this version of the site.

Two pages. `/` is the project: what it is, how it started, how the money actually
moves, and the headline figures. `/ledger` is the record itself.

## What it is not

Not a registered charity. Not accepting donations. Do not add "registered
charity", a charity number, a donate button, or any wording implying UK
charitable status. If outside donations are ever taken, the legal structure has
to be sorted first and this copy has to change with it.

## The record

Everything on the page is derived from `data/ledger.csv`. That file is not
edited by hand: it is pulled from a published Google Sheet by
`scripts/sync-sheet.mjs`, which runs every morning in GitHub Actions and
republishes the site. **[data/SHEET.md](data/SHEET.md) is the guide to updating
the record**, and [data/README.md](data/README.md) covers the columns and the
safeguarding rules.

The sync is a gate, not a pipe. It refuses to publish a sheet with a bad month,
a non-numeric amount, an unknown currency or a missing ref, and it refuses a
sheet that has suddenly lost a fifth of its rows, which is what a bad paste
looks like. On any of those the run stops and the live site keeps the last good
record. It also warns, without stopping, when a note looks like it holds a phone
number, an email, a named school or a place.

The record runs from February 2023, when the WhatsApp group was created, to the
present. From July 2024 every row comes from a transfer receipt. Before that the
rows were reconstructed from messages and are partial, which the site states on
both pages rather than smoothing over: real payments were made in that period
that are not in the file, and nothing has been estimated to fill the gap. The
first months, from October 2022, predate the group and are not in the record at
all.

Nothing on the site is hand written from the data. Totals, monthly totals,
category and year splits and the family count are all derived in
`src/data/ledger.ts`, so the file and the page can never disagree.

## Currency

Kwacha is the currency of the site, because kwacha is what arrives. A few early
entries were sent in pounds and are stored that way, with `currency` on the row.

The pound view is a second reading of the same record, not a separate one. Each
entry converts at the rate for its own year from `data/rates.json`, never at
today's rate, because the kwacha lost more than half its value against the pound
across this period and converting the lot at one rate would misstate the history
badly. Those yearly rates are estimates and should be replaced with the rates
actually received if they are ever to hand.

## Safeguarding

Money reaches the families through two coordinators, and most transfers are
pooled, covering several households at once, so the record is kept by transfer
rather than by child and pooled rows are not split into invented categories.
Nobody is named: the coordinators appear as Coordinator A and Coordinator B, and
no beneficiary appears at all. No full names, no school names,
no place beyond "Malawi", no photographs of children or of any identifiable
person. The generated imagery is abstract on purpose: light, dust, cloth, paper,
ink, a maize field at dusk. It stays that way.

## Hosting

The site is served by Vercel from the `undefiledreligion.org` domain.

`vercel.json` holds one rewrite, and it is load bearing. This is a single page
app: `/ledger` exists in the router, not on disk, so without the rewrite a
refresh on that URL is a 404. Vercel checks the filesystem first, so real files
(`/logos.html`, `/planes/*.webp`, the built assets) still serve themselves and
only unmatched paths fall through to `index.html`.

The GitHub Actions workflow publishes to GitHub Pages as well, which is a second
live copy at the `github.io` address. The `404.html` it writes is the Pages
convention for the same problem and does nothing on Vercel.

## Running it

```bash
npm install
npm run dev
```

Build with `npm run build`.

## Motion

GSAP ScrollTrigger with Lenis for smooth scroll. Everything is driven by scroll
position, nothing loops on its own, and everything reverses on the way back up.

Three rules the code keeps to:

1. **Hidden states are written by JavaScript, never by the markup.** Every
   heading, row and figure renders plainly first and is then animated. If the
   script fails or never runs, the page is still a complete, readable document.
2. **`prefers-reduced-motion` returns early** before any tween is built, and the
   CSS override does not have to reach into GSAP to do it.
3. **Narrow screens and low core counts keep the reveals but drop the per-frame
   parallax.** Part of the audience is on cheap Android phones on slow
   connections. The plane images still show, they just stop moving, and each one
   only downloads when its section is near the viewport.

Dev flags, which are also genuine runtime fallbacks: `?nomotion` disables all
animation, `?nosmooth` restores native scrolling.

## Structure

| path                  | what it holds                                |
|-----------------------|----------------------------------------------|
| `data/`               | the published record and its notes           |
| `src/data/ledger.ts`  | parsing and every derived figure             |
| `src/lib/motion.tsx`  | Lenis, and the Reveal/MaskedLines/Counter/Plane primitives |
| `src/sections/`       | the six sections, in page order              |
| `public/planes/`      | the generated parallax plates                |
| `assets-src/planes/`  | their full resolution originals              |
