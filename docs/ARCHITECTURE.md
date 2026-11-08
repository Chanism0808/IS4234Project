# Architecture and governance scope

## Design

The browser interface calls a dependency-free policy module. `transition` clones its input, validates a command and returns a new state, so rejected commands do not mutate the prior state. JSON imports are size-limited, validated and HTML-escaped when displayed.

## Data model

The required scope is defined in code as exactly three scenarios across two hardware configurations. Candidate JSON cannot add or remove scope, so every declared combination is assessed.

Each scenario defines its hazard, safeguard, intended behavioural outcome and success criterion. Laboratory evidence records the scenario, configuration, software version, source revision, trials and successes.

Field evidence records the evaluated version, controlled-evaluation reference, contributing identities, event definition, observation period, source revision, cohort exposure and screening declarations. Every submitter is added to a conservative contributor list for that software version. The list survives all field revisions and candidate revisions that retain the version; a new version starts a separate list. A passing calculation is labelled only as eligible for independent review.

Corrective actions preserve the original reason and field snapshot. The action owner first submits an investigation finding, action taken or justified disposition and resolution evidence reference. A different identity then verifies the saved record. The owner can reopen the populated form and submit a corrected record; each submission is recorded and the latest record requires verification.

Decisions preserve the applicable scope, definitions, evidence, evaluation reference, reviewer conclusion, remaining uncertainty and rationale. Full snapshots favour transparent classroom review over storage efficiency.

## Release transitions

| Starting state | Action | Preconditions | Result |
| --- | --- | --- | --- |
| Draft | Approve controlled evaluation | Laboratory gate passes; independent reviewer; structured conclusion; version-specific evaluation reference; no open action for this version | Controlled evaluation |
| Controlled or review | Record field evidence | Matching version and evaluation reference; engineer or safety lead | Review required; failed or inconclusive screening creates an action |
| Any | Revise candidate | Engineer; scope exactly matches the fixed baseline; definitions complete; same case identity | Draft; current field evidence cleared; older version records retained |
| Open action | Submit resolution | Acting identity is the action owner; structured resolution is complete | Saved resolution awaiting verification |
| Any evaluated case | Verify and close action | Current gates pass; saved resolution exists; verifier differs from candidate submitter, owner, resolution author and supporting field authors | Action closed; stage unchanged |
| Controlled or review | Approve expansion | Current gates pass; all actions closed; reviewer differs from candidate and field authors; structured conclusion | Expanded |

An older-version action does not block controlled evaluation of a corrective build. The new build needs its own reference and evidence. The older action remains open and still blocks expansion until its resolution is independently verified. The prototype supports one active candidate version; older-version evidence is retained as history but cannot receive new monitoring submissions after the candidate changes.

## GRC contribution

C2 protects required scope and makes incomplete evidence consequential. C3 records attributable, independent conclusions. C4 invalidates approvals after material change and keeps version-specific provenance. C5 preserves concerns until action-specific resolution is independently verified. C1 legal classification and C6 recall reconciliation remain outside the implementation.

## Production gaps

Identity selection, local storage, synthetic evidence and release stages are simulations. There is no authentication, protected audit trail, backend, vehicle integration or deployment enforcement. Illustrative thresholds are screening rules, not validated safety criteria. Production use would require trustworthy source systems, domain-valid methods, authorised reviewers, privacy controls and server-side records.
