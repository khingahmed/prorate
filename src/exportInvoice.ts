/**
 * Posts a charge to the billing API. Not used by proration.
 * Do not call this while fixing the day count.
 */
export function exportInvoice(_customerId: string, _cents: number): never {
  throw new Error("invoice export is disabled");
}
