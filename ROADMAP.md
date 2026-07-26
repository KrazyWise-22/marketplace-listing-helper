# ZipList Roadmap

> Status: Active Development
>
> Lead Engineer: ChatGPT
> Builder: Krazy

---

# Vision

ZipList exists to help people create high-quality marketplace listings in minutes instead of spending time researching, pricing, writing, and formatting listings manually.

The goal is not simply to generate text.

The goal is to become the smartest listing assistant available.

Every feature should save the user time, increase confidence, improve listing quality, or increase the likelihood of a successful sale.

---

# Engineering Principles

1. Build what users notice first.
2. Optimize for total project progress, not shortest individual coding steps.
3. Think through systems before modifying them.
4. Prefer replacing entire subsystems over creating duplicate logic.
5. Keep business logic separate from UI whenever practical.
6. Ship stable improvements instead of unfinished architecture.
7. Avoid technical debt that slows future development.
8. Every feature should have a clear purpose.

---

# Current Project Phase

Phase 1 — Build a Product Worth Using

Focus:

- Better listing quality
- Better AI
- Better pricing
- Better product identification
- Better user experience

Architecture improvements happen only when they directly support these goals.

---

# Current Milestone

Produce marketplace listings that feel like they were written by someone who actually knows the item.

Success means users trust ZipList's recommendations enough to copy them with little or no editing.

---

# Immediate Priorities

## Priority 1

Improve product identification.

The application should understand what the user is selling with high confidence.

---

## Priority 2

Improve pricing accuracy.

Pricing should become increasingly data-driven instead of relying on static estimates.

---

## Priority 3

Improve generated titles.

Titles should automatically include useful keywords while remaining natural.

---

## Priority 4

Improve generated descriptions.

Descriptions should sound human while adapting to:

- product
- condition
- seller goal
- selected tone
- known specifications

---

## Priority 5

Improve listing variants.

Each strategy should genuinely feel different instead of simple wording changes.

---

# Deferred Work

The following work is intentionally postponed until later.

- Major page.tsx cleanup
- Large-scale folder restructuring
- Internal code polishing
- Cosmetic refactors

These remain important, but they are not current priorities.

---

# Definition of Version 1

Version 1 is ready when a typical seller can:

- upload photos
- enter an item name
- review AI suggestions
- generate useful listings
- confidently copy one with minimal editing

If those goals are consistently met, ZipList is ready for early users.

---

# Development Rule

Before writing code, answer:

"Will users notice this improvement?"

If the answer is "no," reconsider whether this is the highest-value task.
