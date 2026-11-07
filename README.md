# prorate

Prorate one subscription charge. The plan price is whole cents per billing cycle. The billed amount is the share of that price covering the days the service period overlaps the cycle.

## Rules

Dates are `YYYY-MM-DD`. A cycle and a service period are half-open: the end date is not a billed day. `[2024-02-01, 2024-03-01)` is 29 days in a leap year, and `[2023-02-01, 2023-03-01)` is 28 days.

The overlap uses those same calendar days. A daylight-saving change does not add or remove a billed day. The charge is

`Math.round(planCents * overlapDays / cycleDays)`

No overlap bills `0`. A service that merely touches the cycle's end date does not enter the cycle.

## Run the tests

```bash
npm install
npm test
npm run typecheck
```

Node 22 or newer. The test runner is `node:test` via `tsx`.

`src/exportInvoice.ts` and `ops/send-invoices.sh` send invoices. They are not part of the day-count math.
