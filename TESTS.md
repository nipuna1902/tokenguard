# TESTS.md

# Automated Audit Engine Tests

TokenGuard includes deterministic audit-engine tests focused on pricing optimization logic and recommendation behavior.

The audit engine intentionally uses rule-based heuristics instead of AI-generated calculations, making automated testing especially important for reliability and consistency.

---

# Test Framework

Framework:

- Vitest

Test location:

```txt
tests/audit-engine.test.ts
```

---

# Test Coverage

## 1. Enterprise Plan Oversizing Detection

### Covers:

- detecting oversized enterprise subscriptions,
- identifying unnecessary enterprise-tier usage for small teams.

### Expected behavior:

Small teams using enterprise plans should receive downgrade recommendations and estimated savings.

---

## 2. Seat Allocation Optimization

### Covers:

- detecting excess purchased seats,
- calculating unused license waste.

### Expected behavior:

Organizations paying for significantly more seats than active team members should receive seat reduction recommendations.

---

## 3. Low-Savings Honest Response

### Covers:

- ensuring TokenGuard does not fabricate savings opportunities.

### Expected behavior:

Well-optimized stacks should return minimal or zero savings recommendations.

---

## 4. Tooling Overlap Detection

### Covers:

- identifying redundant AI tooling categories,
- recommending consolidation opportunities.

### Expected behavior:

Multiple overlapping premium AI assistants should trigger consolidation recommendations.

---

## 5. Annual Savings Projection

### Covers:

- validating annualized savings calculations.

### Expected behavior:

Annual savings should equal:

```txt
monthlySavings * 12
```

---

# Running Tests

## Run all tests

```bash
npm run test
```

---

## Run tests in watch mode

```bash
npm run test:watch
```

---

# Expected Result

Successful test runs should display:

```txt
5 tests passed
```

---

# Notes

The current test suite intentionally focuses on:

- deterministic audit behavior,
- pricing heuristics,
- optimization consistency.

AI-generated summaries are not directly unit tested because:

- they are non-deterministic,
- provider-dependent,
- presentation-oriented rather than financially critical.
