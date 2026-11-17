@AGENTS.md

## Working Rules

Apply these whenever adding a feature or starting new work.

### 1. The Open-Source Scout
Don't write an unfamiliar feature from scratch. First search GitHub for open-source projects that already solve it, compare their approaches (trade-offs, maintenance, licence, fit), and then start building, either by adopting one or by borrowing the best approach.

### 2. Bug Triage
Score each bug from 1 to 10 on **frequency** (how often it would happen) and from 1 to 10 on **severity** (how bad it would be).
- If **frequency × severity < 5**, file it as an issue and leave the code alone.
- Do not design for rare or future cases nobody asked about.
