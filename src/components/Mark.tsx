/**
 * The mark: nine shapes, none of them the same, sitting on one grid.
 *
 * 1 Corinthians 12:12. The body is one and has many members, and the members
 * are many but the body is one. So the shapes differ on purpose: a circle, a
 * square, a triangle, a diamond, an arch, a capsule. Some are large and some
 * are small, because a family is not a set of equals in size or need. Three
 * carry colour and the rest take the ink of whatever surface they sit on.
 *
 * What holds it together is the grid. Every shape is centred on its own point
 * and none of them touch, and it still reads as one object. That is the whole
 * argument: the difference is the point, and so is the fact that it is one
 * thing.
 *
 * The animation lets them arrive separately, each in its own time, and land as
 * one. Nothing merges and nothing is added.
 */
type Shape = {
  /** what it is, for the animation delay ordering */
  el: 'circle' | 'rect' | 'poly'
  props: Record<string, string | number>
  /** a colour token, or nothing to take the surrounding ink */
  tone?: 'ochre' | 'rust' | 'sage'
}

const COL = [22, 50, 78]
const ROW = [22, 50, 78]

const SHAPES: Shape[] = [
  // top row
  { el: 'circle', props: { cx: COL[0], cy: ROW[0], r: 11 } },
  { el: 'rect', props: { x: COL[1] - 9, y: ROW[0] - 9, width: 18, height: 18, rx: 2 }, tone: 'ochre' },
  { el: 'poly', props: { points: `${COL[2]},${ROW[0] - 8} ${COL[2] + 8},${ROW[0] + 7} ${COL[2] - 8},${ROW[0] + 7}` } },
  // middle row
  { el: 'poly', props: { points: `${COL[0]},${ROW[1] - 10} ${COL[0] + 10},${ROW[1]} ${COL[0]},${ROW[1] + 10} ${COL[0] - 10},${ROW[1]}` }, tone: 'sage' },
  { el: 'rect', props: { x: COL[1] - 11, y: ROW[1] - 11, width: 22, height: 22, rx: 8 } },
  { el: 'circle', props: { cx: COL[2], cy: ROW[1], r: 6 }, tone: 'rust' },
  // bottom row
  { el: 'rect', props: { x: COL[0] - 10, y: ROW[2] - 6, width: 20, height: 12, rx: 6 } },
  { el: 'circle', props: { cx: COL[1], cy: ROW[2], r: 7 }, tone: 'ochre' },
  { el: 'poly', props: { points: `${COL[2] - 9},${ROW[2] + 8} ${COL[2] - 9},${ROW[2] - 2} ${COL[2] + 9},${ROW[2] - 2} ${COL[2] + 9},${ROW[2] + 8}` }, tone: 'rust' },
]

export default function Mark({
  size = 24,
  animated = false,
  className,
  title,
}: {
  size?: number
  animated?: boolean
  className?: string
  title?: string
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={['mark', animated ? 'mark--anim' : '', className].filter(Boolean).join(' ')}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {SHAPES.map((s, i) => {
        const common = {
          className: ['mark__bit', s.tone ? `mark__bit--${s.tone}` : ''].filter(Boolean).join(' '),
          style: { animationDelay: `${i * 0.07}s`, transitionDelay: `${i * 0.07}s` },
        }
        if (s.el === 'circle') return <circle key={i} {...common} {...s.props} />
        if (s.el === 'rect') return <rect key={i} {...common} {...s.props} />
        return <polygon key={i} {...common} {...s.props} />
      })}
    </svg>
  )
}
