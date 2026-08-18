# The island nav, and how to put it in another project

This is the floating navigation from Undefiled Religion, written up so another
project can have the same thing. It was reverse engineered from supaste.com by
inspecting the live page, not by guessing at a screenshot, and the three details
below are the ones that actually make it work.

## What makes it read as an "island"

1. **It is pinned to `top: 0` with square top corners and rounded bottom ones.**
   It grows out of the top edge of the page. A pill floating at `top: 12px` with
   four rounded corners looks like a stuck-on bar and is the usual mistake.
2. **Two concave fillets sit immediately outside its left and right edges.**
   These curve the pill back into the top edge so the pill and the page edge read
   as one carved shape. This is the detail people miss. In the original they are
   rotated SVG background images; below they are radial gradients.
3. **It is solid, not frosted.** No `backdrop-filter`. The reference has none.

It also self-sizes: `width: max-content`, so it hugs its contents rather than
spanning the page.

## The markup

```tsx
<nav className={`island${open ? ' is-open' : ''}`} aria-label="Main">
  <a className="island__brand" href="/">{logo}<span className="island__name">Name</span></a>

  <div className="island__links">
    <a href="#one">One</a>
    <a href="#two">Two</a>
  </div>

  <span className="island__tools">{/* theme toggle, currency, etc */}</span>

  <a className="island__cta" href="/somewhere">The action</a>

  <button className="island__burger" aria-expanded={open}
          onClick={() => setOpen(o => !o)}>{/* burger / close icon */}</button>

  {/* always mounted so it can animate; inert while closed so it is not tabbable */}
  <div className="island__sheet" inert={!open}>
    <a href="#one" style={{ transitionDelay: '0.04s' }}>One</a>
    <a href="#two" style={{ transitionDelay: '0.085s' }}>Two</a>
    <a className="island__cta" style={{ transitionDelay: '0.13s' }} href="/somewhere">The action</a>
  </div>
</nav>
```

## The CSS

```css
.island {
  --pill: #0b0806;      /* the pill colour: see the mapping below */
  --fillet: 18px;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 40;
  width: max-content;
  max-width: calc(100% - 2.5rem);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.5rem 0.5rem 0.9rem;
  border-radius: 0 0 1.15rem 1.15rem;   /* square top, round bottom */
  background: var(--pill);
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* the concave corners: this is the bit that sells it */
.island::before,
.island::after {
  content: '';
  position: absolute;
  top: 0;
  width: var(--fillet);
  height: var(--fillet);
  pointer-events: none;
}
.island::before {
  left: calc(var(--fillet) * -1);
  background: radial-gradient(circle at 0 100%,
    transparent 0 var(--fillet), var(--pill) var(--fillet));
}
.island::after {
  right: calc(var(--fillet) * -1);
  background: radial-gradient(circle at 100% 100%,
    transparent 0 var(--fillet), var(--pill) var(--fillet));
}

/* one filled control, as in the reference */
.island__cta {
  padding: 0.5rem 0.95rem;
  border-radius: 999px;
  background: var(--cta-bg);
  color: var(--cta-fg);
  text-decoration: none;
  white-space: nowrap;
}

/* the sheet hangs off the pill in the same colour, so the two are one shape */
.island__sheet {
  display: none;
  position: absolute;
  top: calc(100% - 1px);
  left: 0;
  right: 0;
  flex-direction: column;
  padding: 0.4rem 0.6rem 0.7rem;
  background: var(--pill);
  border-radius: 0 0 1.35rem 1.35rem;
  transform-origin: top center;
  transform: scaleY(0.55) translateY(-6px);
  opacity: 0;
  visibility: hidden;
  transition:
    transform 0.42s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.24s ease,
    visibility 0s linear 0.42s;
}
.island.is-open .island__sheet {
  transform: none;
  opacity: 1;
  visibility: visible;
  transition:
    transform 0.46s cubic-bezier(0.22, 1.2, 0.36, 1),
    opacity 0.2s ease,
    visibility 0s;
}
.island.is-open { border-radius: 0; }   /* joins the sheet while open */

.island__sheet a {
  font-family: var(--display-font);
  font-size: 1.75rem;
  text-transform: none;
  text-decoration: none;
  padding: 0.5rem 0.4rem;
  opacity: 0;
  transform: translateY(-10px);
  transition: opacity 0.3s ease, transform 0.36s cubic-bezier(0.22, 1, 0.36, 1);
}
.island.is-open .island__sheet a { opacity: 1; transform: none; }

.island__burger { display: none; }

@media (max-width: 900px) {
  .island { width: calc(100% - 2.5rem); }
  .island__links { display: none; }
  .island > .island__cta { display: none; }
  .island__burger { display: grid; }
  .island__sheet { display: flex; }
  .island__brand { flex: 1; }
}
@media (max-width: 560px) { .island__name { display: none; } }

@media (prefers-reduced-motion: reduce) {
  .island__sheet, .island__sheet a { transition-duration: 0.001ms; }
}
```

Stagger the sheet links with an inline `transitionDelay` of about
`0.04s + index * 0.045s`.

## Mapping it onto Undefiled Labs

Labs is dark kinetic editorial with an electric violet accent, and it already
has its own tokens in `src/styles/index.css`. Use them rather than the values
above:

| Island needs   | Use from Labs                                       |
|----------------|-----------------------------------------------------|
| `--pill`       | `#08080a` (its `--ink-0`), a touch darker than the page |
| pill text      | `var(--paper)` `#f4f1ea`                             |
| muted link     | `var(--paper-dim)`                                   |
| hover / active | `var(--accent)` `#7c6bff`                            |
| `--cta-bg`     | `var(--paper)` with `--cta-fg: var(--ink-0)`, or violet on dark for more punch |
| sheet font     | `var(--font-serif)` Instrument Serif, or `--font-sans` Space Grotesk |
| label font     | `var(--font-mono)` JetBrains Mono                    |
| easing         | `var(--ease)`, which is already the same curve       |
| focus ring     | `var(--focus)`                                       |

Two things specific to Labs:

- It has a **light theme** (`html[data-theme]`, remembered as `ul-theme`). The
  pill should stay dark in both, as it does here: a dark pill reads over both a
  dark page and a light one, and switching it per theme makes it flicker on
  scroll. Check the fillets against the light theme, since they are the pill
  colour and will show as dark notches on paper. That is correct and looks
  deliberate.
- Labs has a **hard no-cards rule**. This does not break it: the island is
  floating chrome, not a card around content. Keep glass and pills off the prose.

## Watch out for

- **The fillets are the whole trick.** Without them it is just a bar near the top.
- **Do not add `backdrop-filter`.** The reference has none and it muddies the edge.
- **Keep the sheet mounted** and toggle a class. Mounting it on open means it
  cannot animate, it just appears.
- **`inert` while closed**, or the hidden links stay in the tab order.
- If a control inside the pill is a `<select>`, lay it over its whole pill at
  `opacity: 0` rather than sitting it next to a decorative arrow, or the arrow
  is not clickable.
