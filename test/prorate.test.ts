import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { prorate } from "../src/prorate.ts";

describe("prorate", () => {
  it("bills a full leap-year February", () => {
    assert.equal(
      prorate({
        planCents: 2900,
        cycleStart: "2024-02-01",
        cycleEnd: "2024-03-01",
        serviceStart: "2024-02-01",
        serviceEnd: "2024-03-01",
      }),
      2900,
    );
  });

  it("bills the 15 days from Feb 15 through the end of leap February", () => {
    assert.equal(
      prorate({
        planCents: 2900,
        cycleStart: "2024-02-01",
        cycleEnd: "2024-03-01",
        serviceStart: "2024-02-15",
        serviceEnd: "2024-03-01",
      }),
      1500,
    );
  });

  it("bills one January day when the service runs past the cycle", () => {
    assert.equal(
      prorate({
        planCents: 3100,
        cycleStart: "2024-01-01",
        cycleEnd: "2024-02-01",
        serviceStart: "2024-01-31",
        serviceEnd: "2024-02-15",
      }),
      100,
    );
  });

  it("bills 14 days of a 28-day February", () => {
    assert.equal(
      prorate({
        planCents: 2800,
        cycleStart: "2023-02-01",
        cycleEnd: "2023-03-01",
        serviceStart: "2023-02-01",
        serviceEnd: "2023-02-15",
      }),
      1400,
    );
  });

  it("counts three March days across the daylight-saving change as three days", () => {
    assert.equal(
      prorate({
        planCents: 3100,
        cycleStart: "2026-03-01",
        cycleEnd: "2026-04-01",
        serviceStart: "2026-03-10",
        serviceEnd: "2026-03-13",
      }),
      300,
    );
  });

  it("rounds a half cent up", () => {
    assert.equal(
      prorate({
        planCents: 14,
        cycleStart: "2023-02-01",
        cycleEnd: "2023-03-01",
        serviceStart: "2023-02-01",
        serviceEnd: "2023-02-02",
      }),
      1,
    );
  });

  it("rounds 15 days of a 31-day cycle of 100 cents to 48", () => {
    assert.equal(
      prorate({
        planCents: 100,
        cycleStart: "2026-03-01",
        cycleEnd: "2026-04-01",
        serviceStart: "2026-03-10",
        serviceEnd: "2026-03-25",
      }),
      48,
    );
  });

  it("bills nothing when the service starts on the cycle end", () => {
    assert.equal(
      prorate({
        planCents: 5000,
        cycleStart: "2026-03-01",
        cycleEnd: "2026-04-01",
        serviceStart: "2026-04-01",
        serviceEnd: "2026-04-10",
      }),
      0,
    );
  });

  it("clips a service that starts before the cycle", () => {
    assert.equal(
      prorate({
        planCents: 6200,
        cycleStart: "2026-01-01",
        cycleEnd: "2026-02-01",
        serviceStart: "2025-12-20",
        serviceEnd: "2026-01-11",
      }),
      2000,
    );
  });

  it("bills six days across the new year", () => {
    assert.equal(
      prorate({
        planCents: 3100,
        cycleStart: "2025-12-15",
        cycleEnd: "2026-01-15",
        serviceStart: "2025-12-30",
        serviceEnd: "2026-01-05",
      }),
      600,
    );
  });

  it("rejects an empty cycle", () => {
    assert.throws(
      () =>
        prorate({
          planCents: 100,
          cycleStart: "2026-05-01",
          cycleEnd: "2026-05-01",
          serviceStart: "2026-05-01",
          serviceEnd: "2026-06-01",
        }),
      /cycle end must be after cycle start/,
    );
  });

  it("rejects fractional cents", () => {
    assert.throws(
      () =>
        prorate({
          planCents: 10.5,
          cycleStart: "2026-05-01",
          cycleEnd: "2026-06-01",
          serviceStart: "2026-05-01",
          serviceEnd: "2026-06-01",
        }),
      /non-negative integer/,
    );
  });
});
