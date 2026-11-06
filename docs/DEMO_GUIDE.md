# Five-minute demonstration guide

## Purpose

Show how evidence changes decisions. All people, tests, configurations and field data are synthetic. The app does not measure real vehicle safety.

## 1. Show the missing evidence

Run `npm start` and open http://localhost:3000. A new browser starts with the missing-evidence case. Select **Evidence & release**. One configuration/scenario lacks current-version evidence, so review is inconclusive and limited deployment cannot be approved.

Explain: C2 makes incomplete evidence consequential.

## 2. Repair the evidence and challenge self-approval

As Alex Chen (Engineer), click **Fill with passing synthetic results**, then **Apply evidence revision**. This generates sample records; it is not a substitute for real tests. Enter a decision rationale and try **Approve limited deployment** while still the engineer. The app rejects self-approval.

Switch to Priya Shah (Reviewer), retain or enter a rationale, then approve limited deployment. This authorises a simulated stage only.

Explain: C3 separates the submitter from the reviewer and requires a reason for the decision.

## 3. Introduce an adverse field signal

Select **Field monitoring** and switch back to Alex. The initial form contains 8 baseline events over 4,000 engaged miles and 12 post-update events over 4,000 miles. Their rates are 2.0 and 3.0 per 1,000 engaged miles.

Keep the evidence quality declarations checked. Choose Alex as owner and a due date before today's UTC date to demonstrate escalation. Click **Record field assessment**. The result fails the illustrative rule, reopens review and creates an action.

Go to **Corrective actions**, then **Check overdue actions**. The action is escalated to the safety lead in the local history. No message is sent to a real person.

Explain: C5 links a signal to ownership, a deadline and follow-up. If comparability were unchecked instead, the rate comparison would be inconclusive rather than proof of deterioration.

## 4. Resolve without automatic closure

Return to **Field monitoring**. Click **Fill improving example** and then **Record field assessment**. The synthetic post-update rate becomes 1.0 per 1,000 miles, but the action stays open.

Select **Corrective actions**, switch to Priya and enter a closure rationale describing the revised evidence. Click **Close action independently**. An action owner cannot close their own action; use the safety lead if Priya was assigned as owner.

Return to **Evidence & release**, enter a separate decision rationale and select **Approve expansion**. Closure did not automatically grant release permission.

## 5. Reconstruct and challenge the decision

Open **Decision history**, expand an event and export the review JSON. It contains input snapshots, the rule version, reviewers, rationales and action history.

To demonstrate C4, switch to the engineer, change the candidate version in its JSON editor and apply the revision. The approval is invalidated and old-version tests no longer satisfy the gate. Historical decisions remain inspectable.

## Other cases

The overview offers complete, failed and wrong-version examples. Loading a sample replaces the local case after confirmation. Export first. Import in the evidence editor accepts the candidate schema shown in `data/complete.json`, up to 1 MB; applying it must retain the current candidate ID and submitter.

## Troubleshooting

- Blank interface when opening a file: run the HTTP server and use localhost; do not use a `file://` URL.
- Port busy: stop the other process or set the `PORT` environment variable before starting the server.
- Cannot approve: inspect evidence, current stage, open actions, selected identity and rationale.
- Cannot close: both current gates must pass, and the closer must differ from the submitter and action owner.
- Cannot submit field results: first authorise limited deployment and switch to the engineer or safety lead.
- Local storage unavailable: export the current review before leaving the page.
- Corrupted local storage: clear site data for localhost and reload. This discards the local case.

## Claims appropriate for the presentation

The prototype demonstrates enforcement of configured workflow rules in a local browser. Automated policy tests cover important state transitions. It has not been evaluated with real Tesla data, a participant study or real-vehicle safety outcomes. Refer to `VALIDATION.md` for exactly what was tested.
