# The record

`ledger.csv` is the published record. It is the only file that needs editing to
update the site. Open it in Excel, Numbers or Google Sheets, add rows, save as
CSV, commit.

## Columns

| column   | meaning                                                             |
|----------|---------------------------------------------------------------------|
| month    | `YYYY-MM`, the month the money went out                             |
| ref      | who received it for distribution, as a pseudonym. Never a real name. |
| category | Pooled transfer, School fees, Exams, Medical, Transport, Pocket money, One-off support |
| amount   | a number, no currency symbol, no thousands separators               |
| currency | `MWK` or `GBP`, whichever it was actually sent in                   |
| note     | optional, one short line. Leave it blank rather than risk a detail   |

One row per transfer. Most transfers are pooled: one payment covering several
households, which is why the record is kept by transfer and the category for
those rows is `Pooled transfer`. Do not split a pooled transfer into invented
categories. One-off help for someone who asked once is a single row like any
other.

`rates.json` holds one kwacha-per-pound figure per year, used only for the pound
view and for the single combined total. Each entry converts at the rate for its
own year, never at today's rate. Those figures are estimates and the site says
so.

## Safeguarding

No full names. No school names. No village, district or city. No ages, no dates
of birth, nothing that combines with another row to identify a child. If a note
would let a reader work out who someone is, cut the note. The note is optional
and the record is still complete without it.

## Completeness

`ledger.meta.json` has `completeFrom`. From that month onwards every row comes
from a transfer receipt. Everything before it was reconstructed from the WhatsApp
group and is partial: real payments were made in that period that are not in this
file, so the early totals are understated. The site states this rather than
smoothing it over. Never estimate a figure to close the gap.

`placeholder` should stay `false` unless the rows are stand-ins again, in which
case the site shows a banner saying every figure is fake.
