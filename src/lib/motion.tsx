import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

if (import.meta.env.DEV) {
  // verification handles: the preview pane suspends rAF, so triggers need forcing
  ;(window as unknown as Record<string, unknown>).__gsap = gsap
  ;(window as unknown as Record<string, unknown>).__ST = ScrollTrigger
}

export const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** ?nomotion disables every animation. ?nosmooth keeps native scrolling. */
const flag = (name: string) =>
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).has(name)

export const motionOff = () => reduced() || flag('nomotion')

/**
 * Cheap phones get the same content and the same reveals, but no heavy
 * per-frame parallax. Coarse pointer plus a narrow viewport is the signal.
 */
export const lightMotion = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia('(max-width: 700px)').matches ||
    (navigator.hardwareConcurrency ?? 8) <= 4)

/**
 * Type reveals are CSS transitions, not tweens, and this class is what arms
 * them. It is added by script, so a page with no script running never hides a
 * word in the first place. A transition also finishes on its own clock: if the
 * frame loop stalls, which it does in a background tab, on a throttled phone,
 * or in an inactive preview pane, the text still arrives. A frame-driven tween
 * freezes mid-flight instead and leaves headings sliced in half.
 */
function armCss() {
  document.documentElement.classList.add('js-anim')
}

/** Anything still part way through when the page is hidden is snapped to done. */
function watchdog() {
  const settle = () => {
    if (document.visibilityState !== 'hidden') return
    document.querySelectorAll('.js-reveal').forEach((el) => el.classList.add('is-in'))
  }
  document.addEventListener('visibilitychange', settle)
}

let ready = false
function ensureReady() {
  if (ready || typeof document === 'undefined' || motionOff()) return
  ready = true
  armCss()
  watchdog()
}

let lenisRef: Lenis | null = null

/** How far below the top of the viewport a jumped-to section should land. */
const NAV_CLEARANCE = 78

/**
 * Glides to a section instead of teleporting. Uses Lenis when it is running so
 * the easing matches the rest of the scrolling, and falls back to the browser's
 * own smooth scroll otherwise.
 */
export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenisRef && !motionOff()) {
    lenisRef.scrollTo(el, { offset: -NAV_CLEARANCE, duration: 1.4 })
    return
  }
  const top = el.getBoundingClientRect().top + window.scrollY - NAV_CLEARANCE
  window.scrollTo({ top, behavior: motionOff() ? 'auto' : 'smooth' })
}

export function useLenis() {
  useEffect(() => {
    ensureReady()
    if (motionOff() || flag('nosmooth')) return
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true })
    lenisRef = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t: number) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisRef = null
    }
  }, [])
}

/** Runs a GSAP setup inside a scoped context, after layout, once. */
export function useGsap(
  fn: (ctx: { el: HTMLElement }) => void,
  scope?: React.RefObject<HTMLElement | null>,
) {
  const fallback = useRef<HTMLElement | null>(null)
  const ref = scope ?? fallback
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || motionOff()) return
    const ctx = gsap.context(() => fn({ el }), el)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return ref
}

/** Adds `is-in` when the element arrives, takes it off on the way back up. */
function useInView(
  ref: React.RefObject<HTMLElement | null>,
  start = 'top 88%',
) {
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || motionOff()) return
    ensureReady()
    el.classList.add('js-reveal')
    const st = ScrollTrigger.create({
      trigger: el,
      start,
      onEnter: () => el.classList.add('is-in'),
      onLeaveBack: () => el.classList.remove('is-in'),
    })
    return () => {
      st.kill()
      el.classList.remove('js-reveal', 'is-in')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

/* ---------------------------------------------------------------- primitives */

/**
 * Content is always rendered plainly. The hidden state comes from a class the
 * script adds, so a failed or skipped script leaves a readable page.
 */
export function Reveal({
  children,
  as: Tag = 'div',
  className,
  start,
}: {
  children: ReactNode
  as?: 'div' | 'p' | 'li' | 'section' | 'figure'
  className?: string
  start?: string
}) {
  const ref = useRef<HTMLElement | null>(null)
  useInView(ref, start)
  return (
    // @ts-expect-error polymorphic tag
    <Tag ref={ref} className={['reveal', className].filter(Boolean).join(' ')}>
      {children}
    </Tag>
  )
}

/**
 * Words rise out of an overflow mask. The real string stays on aria-label so a
 * screen reader never hears the split.
 */
export function MaskedLines({
  text,
  label,
  as: Tag = 'h2',
  className,
  stagger = 0.055,
  start = 'top 85%',
}: {
  text: string
  /** What a screen reader hears, when the visible text is only part of it. */
  label?: string
  as?: 'h1' | 'h2' | 'h3' | 'p'
  className?: string
  stagger?: number
  start?: string
}) {
  const ref = useRef<HTMLElement | null>(null)
  useInView(ref, start)
  const words = text.split(' ')
  return (
    <Tag
      // @ts-expect-error polymorphic tag
      ref={ref}
      className={['masked', className].filter(Boolean).join(' ')}
      aria-label={label ?? text}
    >
      {words.map((w, i) => (
        <span key={i} aria-hidden="true">
          <span className="m-word">
            <span
              className="m-word__in"
              style={{ transitionDelay: `${(i * stagger).toFixed(3)}s` }}
            >
              {w}
            </span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  )
}

/**
 * Counts to `value` when it enters. The final value is in the DOM from the
 * start, and if the frame loop stops the number is put back to the real one
 * rather than left frozen part way there.
 */
export function Counter({
  value,
  format,
  className,
}: {
  value: number
  format: (n: number) => string
  className?: string
}) {
  const ref = useRef<HTMLSpanElement | null>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || motionOff()) return
    const final = format(value)
    const ctx = gsap.context(() => {
      const o = { n: 0 }
      const tween = gsap.to(o, {
        n: value,
        duration: 1.9,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = format(o.n)
        },
        onComplete: () => {
          el.textContent = final
        },
        scrollTrigger: { trigger: el, start: 'top 92%' },
      })
      const settle = () => {
        if (document.visibilityState === 'hidden') {
          tween.progress(1)
          el.textContent = final
        }
      }
      document.addEventListener('visibilitychange', settle)
      return () => document.removeEventListener('visibilitychange', settle)
    }, el)
    return () => {
      ctx.revert()
      el.textContent = final
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, format])
  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  )
}

/**
 * One depth plane. `speed` is how far it travels across its own scroll span,
 * as a fraction of the viewport height. A stalled scrub only leaves a plane
 * slightly off its mark, which costs nothing, so this one stays a tween.
 */
export function Plane({
  speed = 0.2,
  scale = 1,
  src,
  className,
  children,
  style,
}: {
  speed?: number
  scale?: number
  /** Loaded only once the section is near the viewport, for slow connections. */
  src?: string
  className?: string
  children?: ReactNode
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !src) return
    const target = el.parentElement ?? el
    // absolute paths need the deploy base in front of them, or they break
    // the moment the site is served from a subpath
    const href = src.startsWith('/') ? import.meta.env.BASE_URL + src.slice(1) : src
    const load = () => {
      el.style.backgroundImage = `url(${href})`
    }
    if (!('IntersectionObserver' in window)) {
      load()
      return
    }
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          load()
          io.disconnect()
        }
      },
      { rootMargin: '120% 0px' },
    )
    io.observe(target)
    return () => io.disconnect()
  }, [src])

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || motionOff() || lightMotion()) return
    const ctx = gsap.context(() => {
      gsap.set(el, { scale })
      gsap.fromTo(
        el,
        { yPercent: -speed * 50 },
        {
          yPercent: speed * 50,
          ease: 'none',
          scrollTrigger: {
            trigger: el.parentElement ?? el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      )
    }, el)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div ref={ref} className={className} style={style} aria-hidden="true">
      {children}
    </div>
  )
}
