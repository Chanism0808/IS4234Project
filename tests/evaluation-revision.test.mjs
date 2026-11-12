import test from 'node:test';
import assert from 'node:assert/strict';

import {BASELINE, createState, transition} from '../src/core.mjs';

const review = {
  rationale: 'The synthetic evidence supports a controlled review decision.',
  intendedOutcomeConclusion: 'The defined intended outcome is supported for this exercise.',
  remainingUncertainty: 'Field performance remains uncertain until monitoring is reviewed.'
};

function candidate(source = 'LAB-OLD') {
  const scenarioDefinitions = Object.fromEntries(BASELINE.scenarios.map(scenario => [scenario, {
    hazard: `Synthetic hazard for ${scenario}`,
    safeguard: `Synthetic safeguard for ${scenario}`,
    intendedOutcome: `Synthetic intended outcome for ${scenario}`,
    successCriterion: `Synthetic success criterion for ${scenario}`
  }]));
  const evidence = BASELINE.scenarios.flatMap(scenario => BASELINE.configurations.map(configuration => ({
    scenario,
    configuration,
    version: 'demo-2.0',
    trials: 40,
    successes: 39,
    source,
    revision: source === 'LAB-OLD' ? 'r1' : 'r2'
  })));
  return {
    id: 'DEMO-REVISION-LINK',
    title: 'Revision-linked evaluation regression candidate',
    version: 'demo-2.0',
    submitter: 'engineer',
    scenarios: [...BASELINE.scenarios],
    configurations: [...BASELINE.configurations],
    scenarioDefinitions,
    evidence
  };
}

function field(evaluationReference) {
  return {
    version: 'demo-2.0',
    source: 'FIELD-REVISION-LINK',
    revision: 'r1',
    eventDefinition: 'Synthetic event definition for revision-link regression coverage.',
    observationPeriod: 'Synthetic cohorts observed over 4,000 engaged miles each.',
    evaluationReference,
    baseline: {events: 8, miles: 4000},
    post: {events: 4, miles: 4000},
    comparable: true,
    complete: true,
    safeguardsEnabled: true,
    seriousEvent: false
  };
}

test('a same-version candidate revision cannot progress using an earlier evaluation reference', () => {
  let state = createState(candidate(), '2026-01-01T00:00:00.000Z');
  state = transition(state, {type: 'approveLimited', actor: 'reviewer', ...review, evaluationReference: 'OLD-CE'}, '2026-01-02T00:00:00.000Z');
  state = transition(state, {type: 'revise', actor: 'engineer', candidate: candidate('LAB-REVISED')}, '2026-01-03T00:00:00.000Z');

  assert.equal(state.stage, 'draft');
  assert.throws(
    () => transition(state, {type: 'recordField', actor: 'safety', field: field('OLD-CE')}, '2026-01-04T00:00:00.000Z'),
    /matching controlled-evaluation reference/
  );

  state = transition(state, {type: 'approveLimited', actor: 'reviewer', ...review, evaluationReference: 'NEW-CE'}, '2026-01-05T00:00:00.000Z');

  const stateWithStaleField = structuredClone(state);
  stateWithStaleField.stage = 'review';
  stateWithStaleField.field = {...field('OLD-CE'), submittedBy: 'safety', authors: ['safety']};
  assert.throws(
    () => transition(stateWithStaleField, {type: 'approveExpansion', actor: 'reviewer', ...review}, '2026-01-06T00:00:00.000Z'),
    /current candidate revision/
  );

  assert.throws(
    () => transition(state, {type: 'recordField', actor: 'safety', field: field('OLD-CE')}, '2026-01-06T00:00:00.000Z'),
    /matching controlled-evaluation reference/
  );

  state = transition(state, {type: 'recordField', actor: 'safety', field: field('NEW-CE')}, '2026-01-06T00:00:00.000Z');
  state = transition(state, {type: 'approveExpansion', actor: 'reviewer', ...review}, '2026-01-07T00:00:00.000Z');

  assert.equal(state.stage, 'expanded');
  assert.equal(state.decisions.at(-1).evaluation.reference, 'NEW-CE');
  assert.equal(state.decisions.at(-1).evaluation.candidateRevision, 2);
  assert.deepEqual(state.evaluations.map(evaluation => evaluation.reference), ['OLD-CE', 'NEW-CE']);
});
