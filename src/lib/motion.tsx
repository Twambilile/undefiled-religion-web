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

export function useLenis() {
  useEffect(() => {
    if (motionOff() || flag('nosmooth')) return
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t: number) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
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

/* ---------------------------------------------------------------- primitives */

/**
 * Content is always rendered plainly. The hidden state is written by JS, so a
 * failed or skipped script leaves a readable page rather than a blank one.
 */
export function Reveal({
  children,
  y = 28,
  delay = 0,
  as: Tag = 'div',
  className,
}: {
  children: ReactNode
  y?: number
  delay?: number
  as?: 'div' | 'p' | 'li' | 'section' | 'figure'
  className?: string
}) {
  const ref = useRef<HTMLElement | null>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || motionOff()) return
    const ctx = gsap.context(() => {
      gsap.set(el, { opacity: 0, y })
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        delay,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
      })
    }, el)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    // @ts-expect-error polymorphic tag
    <Tag ref={ref} className={className}>
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
  as: Tag = 'h2',
  className,
  stagger = 0.06,
  start = 'top 85%',
}: {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'p'
  className?: string
  stagger?: number
  start?: string
}) {
  const ref = useRef<HTMLElement | null>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || motionOff()) return
    const inners = el.querySelectorAll('.m-word__in')
    const ctx = gsap.context(() => {
      gsap.set(inners, { yPercent: 108 })
      gsap.to(inners, {
        yPercent: 0,
        duration: 1.05,
        ease: 'power4.out',
        stagger,
        scrollTrigger: { trigger: el, start },
      })
    }, el)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const words = text.split(' ')
  return (
    // @ts-expect-error polymorphic tag
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true">
          <span className="m-word">
            <span className="m-word__in">{w}</span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  )
}

/** Counts to `value` when it enters. Renders the final value in the DOM first. */
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
    const ctx = gsap.context(() => {
      const o = { n: 0 }
      gsap.to(o, {
        n: value,
        duration: 1.9,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = format(o.n)
        },
        scrollTrigger: { trigger: el, start: 'top 92%' },
      })
    }, el)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])
  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  )
}

/**
 * One depth plane. `speed` is how far it travels across its own scroll span,
 * as a fraction of the viewport height. Negative moves against the scroll.
 */
export function Plane({
  speed = 0.2,
  scale = 1,
  className,
  children,
  style,
}: {
  speed?: number
  scale?: number
  className?: string
  children?: ReactNode
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLDivElement | null>(null)
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
