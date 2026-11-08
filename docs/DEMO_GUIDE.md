# Five-minute demonstration guide

All records and decisions are synthetic. The app demonstrates governance controls, not vehicle safety.

## 1 Start with a blocked case

Run `npm start`, open http://localhost:3000 and select **Evidence & release**.

The default case has five of six required combinations. Try removing a scenario from the JSON and applying it. The fixed baseline rejects the reduction.

## 2 Approve controlled evaluation

Click **Fill passing results**, then **Apply evidence revision**.

Switch to Priya Shah. Complete the three decision fields, keep the controlled-evaluation reference, and click **Approve controlled evaluation**.

## 3 Record a concern

Open **Field monitoring** and switch to Sam Rivera. Keep the prefilled event definition, observation period and evaluation reference. Select Alex as owner, then record the prefilled adverse assessment.

The screening fails, review reopens and an action is created. Sam is recorded as the field-evidence author, so Sam cannot approve expansion from it.

## 4 Resolve the action

Click **Fill improving example** and record it. The action stays open.

Open **Corrective actions**. Switch to Priya and enter an investigation finding, action or disposition, resolution evidence reference and verification rationale. Keep Alex as the resolution-evidence author, then verify and close the action.

## 5 Make and inspect the decision

Return to **Evidence & release**. Complete the three decision fields and approve expansion.

Open **Decision history** and export the JSON. It includes the fixed scope, definitions, versions, evidence authors, reviewer conclusions, evaluation reference and action resolution.

## Troubleshooting

- Cannot approve: check the selected identity, all three decision fields, evidence status and open actions.
- Cannot record field evidence: first approve controlled evaluation and use its exact reference.
- Cannot close an action: record improving evidence, complete every resolution field and use a verifier independent of the owner and evidence author.
- Old local case: click **Reset demonstration** after an update.
