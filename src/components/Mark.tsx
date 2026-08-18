/**
 * The mark: nine dots, and the ninth is smaller.
 *
 * Matthew 25:40. Eight of the nine are identical, drawn at the same size and in
 * the same ink, because in a list of people that is what everyone looks like.
 * The ninth is smaller, which is the whole point of the verse, and it is the
 * only one carrying colour. The eye lands on it precisely because it is the
 * least, which is the argument the verse is making.
 *
 * The animation performs the sentence rather than decorating it: all nine
 * arrive equal, then the last one shrinks and lights. Nothing is added to the
 * grid and nothing is taken away. The same nine are there at the end as at the
 * beginning; only the attention has moved.
 */
const DOTS = [
  [24, 30], [50, 30], [76, 30],
  [24, 58], [50, 58], [76, 58],
  [24, 86], [50, 86],
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
      viewBox="0 0 100 116"
      width={size}
      height={size * 1.16}
      className={['mark', animated ? 'mark--anim' : '', className].filter(Boolean).join(' ')}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {DOTS.map(([cx, cy], i) => (
        <circle
          key={i}
          className="mark__dot"
          cx={cx}
          cy={cy}
          r="9"
          style={{ animationDelay: `${i * 0.055}s`, transitionDelay: `${i * 0.055}s` }}
        />
      ))}
      <circle className="mark__least" cx="76" cy="86" r="9" />
    </svg>
  )
}
