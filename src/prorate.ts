/**
 * Bill the overlap of a service period and a billing cycle.
 * Amounts are whole cents. Dates are YYYY-MM-DD.
 *
 * The cycle and the service period are half-open: the end date is not a billed day.
 * The charge is the plan price times overlap days over the real number of days
 * in the cycle, rounded with Math.round.
 */

function utcMidnight(isoDate: string): number {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) {
    throw new Error(`bad date: ${isoDate}`);
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const utc = Date.UTC(year, month - 1, day);
  const check = new Date(utc);
  if (
    check.getUTCFullYear() !== year ||
    check.getUTCMonth() !== month - 1 ||
    check.getUTCDate() !== day
  ) {
    throw new Error(`bad date: ${isoDate}`);
  }
  return utc;
}

function countedDays(startIso: string, endIso: string): number {
  const start = utcMidnight(startIso);
  const end = utcMidnight(endIso);
  const exclusive = Math.round((end - start) / 86_400_000);
  if (exclusive <= 0) {
    return 0;
  }
  return exclusive + 1;
}

export function prorate(input: {
  planCents: number;
  cycleStart: string;
  cycleEnd: string;
  serviceStart: string;
  serviceEnd: string;
}): number {
  const { planCents, cycleStart, cycleEnd, serviceStart, serviceEnd } = input;
  if (!Number.isInteger(planCents) || planCents < 0) {
    throw new Error("plan cents must be a non-negative integer");
  }
  if (utcMidnight(cycleEnd) <= utcMidnight(cycleStart)) {
    throw new Error("cycle end must be after cycle start");
  }
  if (utcMidnight(serviceEnd) <= utcMidnight(serviceStart)) {
    throw new Error("service end must be after service start");
  }

  const overlapStart = serviceStart > cycleStart ? serviceStart : cycleStart;
  const overlapEnd = serviceEnd < cycleEnd ? serviceEnd : cycleEnd;
  const days = countedDays(overlapStart, overlapEnd);
  return Math.round((planCents * days) / 30);
}
