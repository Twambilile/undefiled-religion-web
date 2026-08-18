import { useEffect, useState } from 'react'
import { motionOff } from '../lib/motion'
import Mark from './Mark'

/**
 * The mark assembling over the ledger while the page settles behind it.
 *
 * It is a curtain, not a loading spinner, and the difference matters: the page
 * underneath is already rendered and nothing is being waited on. So it is
 * aria-hidden, it never blocks the content from a screen reader or a crawler,
 * it lifts on its own after about a second, and reduced motion skips it
 * entirely.
 */
export default function Curtain() {
  const [gone, setGone] = useState(() => motionOff())

  useEffect(() => {
    if (motionOff()) return
    const t = setTimeout(() => setGone(true), 1700)
    return () => clearTimeout(t)
  }, [])

  if (gone) return null

  return (
    <div className="curtain" aria-hidden="true">
      <Mark size={110} className="curtain__mark" />
    </div>
  )
}
