import { useMemo, useState } from 'react'
import { MaskedLines, Reveal } from '../lib/motion'

/**
 * Everything is reckoned in kwacha, because that is what gets spent. The three
 * input currencies convert at roughly this year's rate. These are estimates and
 * the section says so.
 */
const perUnitMwk: Record<string, number> = {
  MWK: 1,
  GBP: 2600,
  USD: 2050,
}

const symbol: Record<string, string> = { MWK: 'MK', GBP: '£', USD: '$' }

/**
 * Real building blocks, in kwacha, from our own budgets. `share` is the slice
 * of a spend that would realistically go on each one, so the basket scales the
 * way an actual month of support scales rather than piling everything onto the
 * biggest item.
 */
const blocks = [
  { mwk: 290000, share: 0.2, one: 'a term of boarding for a child', many: (n: number) => `${n} terms of boarding` },
  { mwk: 90000, share: 0.25, one: 'half a term of school fees', many: (n: number) => `${n} half-terms of school fees` },
  { mwk: 60000, share: 0.3, one: 'a month of food for a family', many: (n: number) => `${n} months of food for a family` },
  { mwk: 55000, share: 0.15, one: 'exam fees for a student', many: (n: number) => `${n} students' exam fees` },
  { mwk: 40000, share: 0.1, one: 'a bag of maize flour', many: (n: number) => `${n} bags of maize flour` },
]

/** A month of steady support for one family. */
const MONTH_PER_FAMILY = 60000
/** A full year of the essentials for one family. */
const YEAR_PER_FAMILY = 600000

const mwkFmt = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 })

function joinList(parts: string[]): string {
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0]
  return parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1]
}

/**
 * A concrete basket that grows with the amount. Each block gets its share of
 * the spend, converted to a whole quantity, and the three biggest lines are
 * shown. Small amounts fall back to whatever single things actually fit.
 */
function basket(amountMwk: number): string {
  // A year or more: spread it by share, so the counts read like real support
  // for many families rather than everything piled on one line.
  if (amountMwk >= YEAR_PER_FAMILY) {
    const picked = blocks
      .map((b) => {
        const qty = Math.floor((amountMwk * b.share) / b.mwk)
        return { b, qty, spend: qty * b.mwk }
      })
      .filter((x) => x.qty > 0)
      .sort((a, b) => b.spend - a.spend)
      .slice(0, 3)
      .sort((a, b) => b.b.mwk - a.b.mwk)
    if (picked.length > 0) {
      return joinList(picked.map((x) => (x.qty === 1 ? x.b.one : x.b.many(x.qty))))
    }
  }

  // Below a year: spend it down, largest item first, so a smaller amount still
  // shows a full, varied basket.
  let left = amountMwk
  const parts: string[] = []
  for (const b of blocks) {
    if (parts.length >= 3 || left < b.mwk) continue
    const n = Math.min(Math.floor(left / b.mwk), 4)
    if (n <= 0) continue
    left -= n * b.mwk
    parts.push(n === 1 ? b.one : b.many(n))
  }
  if (parts.length > 0) return joinList(parts)

  const smallest = blocks[blocks.length - 1]
  const pct = Math.round((amountMwk / smallest.mwk) * 100)
  return pct > 0 ? `about ${pct}% of ${smallest.one}` : ''
}

/** The plain-English headline, in the biggest unit that the amount reaches. */
function headline(amountMwk: number): string | null {
  if (amountMwk >= YEAR_PER_FAMILY) {
    const n = Math.floor(amountMwk / YEAR_PER_FAMILY)
    return `a full year of support for ${n === 1 ? 'a family' : `about ${n} families`}`
  }
  if (amountMwk >= MONTH_PER_FAMILY) {
    const months = amountMwk / MONTH_PER_FAMILY
    const n = months < 3 ? months.toFixed(1) : String(Math.floor(months))
    return `about ${n} ${Number(n) === 1 ? 'month' : 'months'} of support for a family`
  }
  return null
}

export default function Calculator() {
  const [raw, setRaw] = useState('100')
  const [cur, setCur] = useState<'GBP' | 'USD' | 'MWK'>('GBP')

  const value = Math.max(0, Number(raw.replace(/[^0-9.]/g, '')) || 0)
  const amountMwk = value * perUnitMwk[cur]

  const result = useMemo(() => {
    if (amountMwk <= 0) return null
    return { list: basket(amountMwk), months: headline(amountMwk) }
  }, [amountMwk])

  return (
    <section className="section surface--paper calc">
      <p className="eyebrow">See for yourself</p>
      <MaskedLines as="h2" text="Put in an amount, see what it does." className="h2" />

      <div className="calc__panel">
        <div className="calc__input">
          <div className="calc__field">
            <label className="calc__cur" htmlFor="calc-amount">
              <span className="visually-hidden">Currency</span>
              <select
                value={cur}
                onChange={(e) => setCur(e.target.value as typeof cur)}
                aria-label="Currency"
                className="calc__select"
              >
                <option value="GBP">£</option>
                <option value="USD">$</option>
                <option value="MWK">MK</option>
              </select>
            </label>
            <input
              id="calc-amount"
              className="calc__amount num"
              inputMode="decimal"
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              aria-label={`Amount in ${cur}`}
            />
          </div>
          <div className="calc__chips">
            {[25, 50, 100, 250].map((n) => (
              <button key={n} type="button" className="calc__chip" onClick={() => setRaw(String(n))}>
                {symbol[cur]}
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="calc__out" aria-live="polite">
          {result ? (
            <>
              <p className="calc__mwk num">MK {mwkFmt.format(Math.round(amountMwk))}</p>
              <p className="calc__line">
                {result.list ? (
                  <>
                    That covers <strong>{result.list}</strong>.
                  </>
                ) : (
                  'That is a start towards the next bag of flour.'
                )}
              </p>
              {result.months ? (
                <p className="calc__months dim">Or {result.months}.</p>
              ) : null}
            </>
          ) : (
            <p className="calc__line dim">Type an amount above.</p>
          )}
        </div>
      </div>

      <Reveal as="p" className="dim calc__note">
        Worked out from the real prices in our record. Kwacha is what we actually spend;
        the pound and dollar rates are rough and move over time. It is a guide to what an
        amount does, not a checkout.
      </Reveal>
    </section>
  )
}
