# METRICS.md

# North Star Metric

## Saved Audit Reports Per Week

The primary North Star metric for TokenGuard is:

# the number of audit reports successfully saved per week.

This metric is more meaningful than simple page views or daily active users because TokenGuard is fundamentally a lead-generation and operational finance qualification tool rather than a high-frequency engagement product.

A saved report indicates that a user:

- completed the onboarding flow,
- found value in the audit,
- trusted the output enough to preserve it,
- and was willing to exchange contact information after seeing value first.

That makes it a strong proxy for:

- product usefulness,
- lead quality,
- and business intent.

---

# Why Not DAU?

Daily Active Users would be misleading for this product because AI infrastructure audits are not workflows users perform every day.

Most startups would likely:

- run audits occasionally,
- revisit reports during budgeting cycles,
- or return after major tooling/pricing changes.

As a result, maximizing repeat daily usage is less important than generating high-quality completed audits from relevant technical teams.

---

# Input Metrics That Drive the North Star

## 1. Audit Completion Rate

Definition:

```txt
Visitors who finish the onboarding flow ÷ total landing page visitors
```

This measures:

- onboarding clarity,
- friction reduction,
- UX effectiveness,
- and perceived value proposition strength.

A low completion rate would indicate:

- confusing onboarding,
- excessive form complexity,
- or weak perceived value.

---

## 2. Report Save Rate

Definition:

```txt
Users who save reports ÷ completed audits
```

This measures:

- trust in audit quality,
- perceived usefulness,
- and lead capture effectiveness.

Because the email gate appears only after value is shown, this metric is particularly important for evaluating whether the audit output itself feels compelling.

---

## 3. Shareable Report Clickthroughs

Definition:

```txt
Visits generated from shared audit URLs
```

This measures:

- virality,
- screenshot-worthiness,
- and social sharing behavior.

The public report system is intentionally designed as a distribution loop rather than only a reporting feature.

---

# First Instrumentation Priorities

If TokenGuard were deployed in production, the first events I would instrument are:

- Landing page visits
- Audit started
- Audit completed
- Report saved
- Shareable report viewed
- Consultation CTA clicked
- Transactional email opened
- Shared report referral traffic

These events would help identify:

- onboarding dropoff points,
- conversion bottlenecks,
- and the strongest acquisition channels.

---

# Metrics That Would Trigger a Pivot

A major concern would be:

# low report save rates despite high audit completion.

For example:

```txt
> 20% audit completion
< 5% report saves
```

This would likely indicate that:

- the audit recommendations are not trusted,
- the savings opportunities are not compelling,
- or the product is not perceived as operationally useful enough to exchange contact information for.

In that scenario, I would likely pivot toward:

- benchmarking,
- AI infrastructure analytics,
- or collaborative procurement tooling

instead of purely optimization-focused audits.

---

# Success Signals

Strong early-stage validation would look like:

- 20%+ audit completion rate
- 25%+ report save rate
- Meaningful organic traffic from shared report URLs
- Multiple startups voluntarily sharing audit screenshots publicly
- Repeat usage after pricing changes or tooling expansion

Those signals would suggest that TokenGuard is functioning not only as a calculator, but as a credible operational finance workflow for AI infrastructure management.
