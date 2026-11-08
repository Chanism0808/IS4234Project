# Safeguard — Autosteer Assurance and Review

An educational GRC application for the IS4234 Group 21 proposal. It links safeguard evidence to independent release decisions and corrective action. It runs locally with no runtime dependencies, accounts, API keys or vehicle connections.

**All examples are synthetic. This is not Tesla software, automotive safety certification, regulatory approval or a production release-control system.**

## Run locally

Install Node.js 20 or newer, download or clone this project, open a terminal inside its folder, and run:

```sh
npm start
```

Open **http://localhost:3000**. Stop with Ctrl+C. No `npm install` is needed. Do not open `index.html` directly: JavaScript modules and sample imports require an HTTP server.

Run the automated policy tests:

```sh
npm test
```

## What is implemented

| Report control | Implementation |
| --- | --- |
| C2 Evidence coverage | Candidate scope must exactly match the fixed three-scenario by two-configuration baseline. Each scenario defines its hazard, safeguard, intended outcome and success criterion. |
| C3 Independent decision | Candidate and retained field-evidence contributors cannot approve their own work. Decisions require an outcome conclusion, remaining uncertainty and rationale. |
| C4 Reassessment after change | Candidate revisions invalidate approval. Controlled-evaluation and field records remain version-specific, while historical snapshots are retained. |
| C5 Adverse-signal escalation | Failed or inconclusive screening creates an owned action with its trigger snapshot. The owner submits action-specific resolution evidence before a separate identity verifies closure. |

C1 safety-change legal assessment and C6 recall campaign reconciliation are outside this prototype. Evidence and decision exports support review; they do not establish legal compliance.

## Interface

- **Overview:** release stage, evidence coverage, field assessment, open actions and synthetic sample selection.
- **Evidence & release:** fixed-baseline matrix, evidence definitions, JSON editor/import and structured independent decisions.
- **Field monitoring:** event definition, observation period, version-specific evaluation reference, exposure and screening.
- **Corrective actions:** trigger snapshots, ownership, due dates, owner-submitted resolution evidence and separate verification.
- **Decision history:** recorded actions and inspectable input snapshots; export as JSON.

The default example deliberately has missing evidence. Start with the [five-minute walkthrough](docs/DEMO_GUIDE.md).

## Demonstration rules

Rule version `classroom-3` requires 30 trials and at least 95% successful responses for each fixed-baseline scenario/configuration. Field screening requires at least 1,000 engaged miles per cohort, declared completeness and comparability, enabled safeguards, no serious-event flag and no increase in the selected event rate. Passing means eligible for independent review, not proven safe or effective.

These values are illustrative teaching rules. They are not validated automotive safety criteria or Tesla thresholds. A 95% response rate may be wholly inappropriate for critical hazards. Simple rates do not establish statistical significance or acceptable rare-event risk.

The field sample represents the candidate's declared configurations as one cohort comparison. Configuration-specific field stratification and statistical uncertainty modelling are future work; only laboratory coverage is checked per configuration.

## Technical structure

| Path | Purpose |
| --- | --- |
| `index.html`, `styles.css` | Responsive application layout and styles |
| `src/core.mjs` | Pure validation, policy gates, state transitions and report generation |
| `src/app.mjs` | Browser interface and local persistence |
| `data/*.json` | Four synthetic candidate fixtures |
| `server.mjs` | Small local static server, bound to loopback |
| `tests/core.test.mjs` | Node built-in test suite |
| `.github/workflows/test.yml` | Runs policy tests on pushes and pull requests |
| `docs/DEMO_GUIDE.md` | Presentation walkthrough and troubleshooting |
| `docs/ARCHITECTURE.md` | Data model, decisions and production gaps |
| `docs/VALIDATION.md` | Observed test results and remaining validation |

## Hosting

The front end can be served by any static host. Upload `index.html`, `styles.css`, `src/` and `data/`. If GitHub Pages is enabled for the repository, the project can be served from the root of its main branch. Hosting must be configured separately; this repository does not automatically publish a public site.

## Important boundaries

Role selection is a simulation, not authentication. Anyone with access to this browser can switch identities, edit local storage or reset the case. The history is not tamper-resistant, and the app does not enforce any real deployment. Exported reports should not contain real personal, vehicle or confidential incident data.

Each browser holds one local case and one active candidate version. Earlier-version evidence remains in history, but new monitoring is accepted only for the active version. Import accepts candidate evidence, not saved application state; exports are review artifacts, not restore files. Loading a sample or resetting clears local history after confirmation. Export first if needed.

Escalation runs on application load, every minute while open, or when the user presses **Check overdue actions**. It is an in-app status change, not an email or background notification service. An action is overdue after its UTC due date ends.

Production use would require server-side authorisation, authenticated users, reliable database storage, protected audit records, evidence-source integrations, validated hazard-specific rules, privacy controls and deployment-system enforcement.
