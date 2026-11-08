# Five-minute demonstration guide

All records and decisions are synthetic. The app demonstrates governance controls, not vehicle safety.

## 1 Start with a blocked case

Run `npm start`, open http://localhost:3000 and select **Evidence & release**.

The default case has five of six required combinations. Try adding or removing a scenario or configuration in the JSON. The fixed scope rejects either change.

## 2 Approve controlled evaluation

Click **Fill passing results**, then **Apply evidence revision**.

Switch to Priya Shah. Complete the three decision fields, keep the controlled-evaluation reference, and click **Approve controlled evaluation**.

## 3 Record a concern

Open **Field monitoring** and switch to Sam Rivera. Keep the prefilled event definition, observation period and evaluation reference. Select Alex as owner, then record the prefilled adverse assessment.

The screening fails, review reopens and an action is created. Sam is recorded as the field-evidence author, so Sam cannot approve expansion from it.

## 4 Resolve the action

Click **Fill improving example** and record it. The action stays open.

Open **Corrective actions**. Switch to Alex, enter the investigation finding, action or disposition and resolution evidence reference, then submit the resolution. Alex is recorded automatically as its author.

Switch to Priya, enter the independent verification rationale, then verify and close the action. Priya cannot change the saved author or resolution fields during verification.

If the saved record needs correction, switch to Alex and click **Edit resolution**. Saving the revision records another submission and still requires Priya's verification.

## 5 Make and inspect the decision

Return to **Evidence & release**. Complete the three decision fields and approve expansion.

Open **Decision history** and export the JSON. It includes the fixed scope, definitions, versions, evidence authors, reviewer conclusions, evaluation reference and action resolution.

## Troubleshooting

- Cannot approve: check the selected identity, all three decision fields, evidence status and open actions.
- Cannot record field evidence: first approve controlled evaluation and use its exact reference.
- Cannot submit a resolution: switch to the action owner.
- Cannot edit a resolution: the action must still be open; click **Edit resolution**, then switch to its owner before saving.
- Cannot close an action: record improving evidence, submit the resolution first, then use a verifier independent of the owner and all supporting evidence authors.
- Old local case: click **Reset demonstration** after an update.

The prototype has one active candidate version. Earlier-version evidence remains in history, but new monitoring can only be recorded for the active version.
