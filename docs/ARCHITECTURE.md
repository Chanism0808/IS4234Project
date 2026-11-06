# Architecture and governance scope

## Design

The app separates a dependency-free policy module from browser rendering. `transition` clones its input, validates an action and returns a new state; rejected commands leave the prior state unchanged. Inputs are rendered with HTML escaping, and JSON imports are size-limited and validated before use.

## Data model

A candidate identifies its ID, title, version, submitter, required configurations and scenarios. Each laboratory record identifies a scenario, configuration, software version, source, source revision, trial count and success count. Duplicate records for the same scenario/configuration/version are rejected.

Field evidence identifies its software version, source and revision, baseline/post-update event counts and engaged miles, and boolean quality/safeguard/serious-event declarations. These declarations are assumptions requiring qualified review in any real deployment.

State holds the candidate, evidence revision, release stage, current field evidence, corrective actions, decisions and history. Decisions capture the candidate and field evidence at approval time. Full snapshots trade storage efficiency for transparent classroom review.

## Release transitions

| Starting state | Action | Preconditions | Result |
| --- | --- | --- | --- |
| Draft | Approve limited deployment | Laboratory gate passes; independent reviewer; rationale; no open actions | Limited |
| Limited, review or expanded | Record material field evidence | Prior limited deployment; engineer or safety lead; valid evidence | Review required |
| Review or limited | Approve expansion | Both gates pass; independent reviewer; rationale; no open actions | Expanded |
| Any | Revise candidate | Engineer; valid candidate with same ID and submitter | Draft; current field evidence cleared |
| Any deployed case | Close action | Both gates pass; independent closer differs from owner and submitter; rationale | Action closed; release stage unchanged |

A revised candidate retains historical actions and decisions. Field evidence can be gathered after an earlier limited deployment even while a revision is draft, but the draft still requires a new limited-deployment decision before expansion. This accommodates remediation of an already deployed candidate without discarding its concerns.

## GRC contribution

C2 makes unsupported evidence block review eligibility. C3 requires an attributable decision and rationale. C4 prevents silent reuse of approvals after material changes. C5 prevents a better metric from silently closing a concern. C1 legal classification and C6 recall reconciliation remain outside the implementation.

## Production gaps

Local state and identity selection are deliberately simulated. There is no true access control, protected audit trail, backend, collaboration, vehicle integration or deployment enforcement. Due-date escalation operates only while the application is running and does not send external messages. Source quality, cohort completeness and comparability are not independently verified. A production implementation needs domain-valid criteria and statistical methods, not these example thresholds.

The workflow cannot prevent a reviewer from making a poor judgment or an engineer from submitting misleading evidence. Independent validation, organisational authority and trustworthy source systems remain necessary.
