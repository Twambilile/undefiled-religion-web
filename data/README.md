# The record

`ledger.csv` is the published record. It is the only file that needs editing to
update the site. Open it in Excel, Numbers or Google Sheets, add rows, save as
CSV, commit.

## Columns

| column   | meaning                                                        |
|----------|----------------------------------------------------------------|
| month    | `YYYY-MM`, the month the money went out                        |
| ref      | initials or a pseudonym for the family. Never a full name.      |
| category | School fees, Food, Supplies, Clothing, Medical, One-off support |
| amount   | a number, no currency symbol, no thousands separators           |
| note     | optional, one short line on what it bought                      |

One row per payment. A family can appear many times in a month, or not at all.
One-off help for someone who asked once is a single row like any other.

## Safeguarding

No full names. No school names. No village, district or city. No ages, no dates
of birth, nothing that combines with another row to identify a child. If a note
would let a reader work out who someone is, cut the note. The note is optional
and the record is still complete without it.

## Placeholder state

`ledger.meta.json` has `"placeholder": true`. While it is true, every row here is
fake and the site says so on the page. Set it to false in the same commit that
brings in the real rows, and not before.
