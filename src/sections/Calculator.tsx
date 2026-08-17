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

/** Real building blocks, in kwacha, taken from our own budgets. Largest first. */
const blocks = [
  { mwk: 290000, one: 'a term of boarding for a child', many: (n: number) => `${n} terms of boarding` },
  { mwk: 90000, one: 'half a term of school fees', many: (n: number) => `${n} half-terms of school fees` },
  { mwk: 60000, one: 'a month of food for a family', many: (n: number) => `${n} months of food for a family` },
  { mwk: 55000, one: 'exam fees for a student', many: (n: number) => `${n} students' exam fees` },
  { mwk: 40000, one: 'a bag of maize flour', many: (n: number) => `${n} bags of maize flour` },
]

/** A month of steady support for one family, used for the plain-English headline. */
const MONTH_PER_FAMILY = 60000

const mwkFmt = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 })

function joinList(parts: string[]): string {
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0]
  return parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1]
}

/** Greedy basket over the blocks, each capped so the mix stays varied. */
function basket(amountMwk: number): string {
  let left = amountMwk
  const parts: string[] = []
  for (const b of blocks) {
    // keep the basket to a few varied lines; the months figure carries the scale
    if (parts.length >= 3) break
    if (left < b.mwk) continue
    let n = Math.floor(left / b.mwk)
    n = Math.min(n, 3)
    if (n <= 0) continue
    left -= n * b.mwk
    parts.push(n === 1 ? b.one : b.many(n))
  }
  if (parts.length === 0) {
    const smallest = blocks[blocks.length - 1]
    const pct = Math.round((amountMwk / smallest.mwk) * 100)
    if (pct <= 0) return ''
    return `about ${pct}% of ${smallest.one}`
  }
  return joinList(parts)
}

export default function Calculator() {
  const [raw, setRaw] = useState('100')
  const [cur, setCur] = useState<'GBP' | 'USD' | 'MWK'>('GBP')

  const value = Math.max(0, Number(raw.replace(/[^0-9.]/g, '')) || 0)
  const amountMwk = value * perUnitMwk[cur]

  const result = useMemo(() => {
    if (amountMwk <= 0) return null
    const months = amountMwk / MONTH_PER_FAMILY
    const monthText =
      months >= 1
        ? `about ${months < 10 ? months.toFixed(months < 3 ? 1 : 0) : Math.floor(months)} ${
            Math.round(months) === 1 ? 'month' : 'months'
          } of support for a family`
        : null
    return { list: basket(amountMwk), months: monthText }
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
