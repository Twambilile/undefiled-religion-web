# Undefiled Religion

A family funded giving project in Malawi supporting orphans and families in need
with school fees, food, supplies and clothing. Running since 10 October 2022.

This site publishes the money. Every payment, what it was for, which month, back
to the first one. There is no donate button and there never will be one on this
version of the site.

## What it is not

Not a registered charity. Not accepting donations. Do not add "registered
charity", a charity number, a donate button, or any wording implying UK
charitable status. If outside donations are ever taken, the legal structure has
to be sorted first and this copy has to change with it.

## The record

Everything on the page is derived from `data/ledger.csv`, a plain file a
non-developer can edit in Excel, Numbers or Google Sheets. See
[data/README.md](data/README.md) for the columns and the safeguarding rules.

`data/ledger.meta.json` carries `"placeholder": true`. While that is true, the
rows are fake, every amount is zero, and the site says so in a banner at the top
of the page and again in the colophon. Set it to false in the same commit that
brings in the real record.

Nothing on the site is hand written from the data. Totals, monthly totals,
category and year splits and the family count are all derived in
`src/data/ledger.ts`, so the file and the page can never disagree.

## Safeguarding

Beneficiaries appear as initials or pseudonyms. No full names, no school names,
no place beyond "Malawi", no photographs of children or of any identifiable
person. The generated imagery is abstract on purpose: light, dust, cloth, paper,
ink, a maize field at dusk. It stays that way.

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
