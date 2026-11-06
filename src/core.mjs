// Pure, dependency-free demonstration policy. These are NOT automotive safety criteria.
export const RULES = Object.freeze({version:'classroom-1', minTrials:30, minSuccess:0.95, minMiles:1000});
export const PEOPLE = Object.freeze([
  {id:'engineer', name:'Alex Chen', role:'engineer'},
  {id:'reviewer', name:'Priya Shah', role:'reviewer'},
  {id:'safety', name:'Sam Rivera', role:'safety'}
]);
const clone = x => structuredClone(x);
const requireThat = (ok, msg) => {if (!ok) throw new Error(msg);};
const str = x => typeof x === 'string' && x.trim().length > 0 && x.length <= 500;
const count = x => Number.isSafeInteger(x) && x >= 0;
export function validateCandidate(c) {
  requireThat(c && typeof c === 'object', 'Candidate must be an object.');
  for (const key of ['id','title','version','submitter']) requireThat(str(c[key]), `${key} is required (maximum 500 characters).`);
  requireThat(PEOPLE.some(p=>p.id===c.submitter && p.role==='engineer'), 'Submitter must be a demonstration engineer.');
  for (const key of ['configurations','scenarios']) {
    requireThat(Array.isArray(c[key]) && c[key].length>0 && c[key].length<=30 && c[key].every(str), `${key} must contain 1–30 named entries.`);
    requireThat(new Set(c[key]).size===c[key].length, `${key} contains duplicates.`);
  }
  requireThat(Array.isArray(c.evidence) && c.evidence.length<=1000, 'Evidence must be an array (maximum 1000 records).');
  const keys=new Set();
  c.evidence.forEach(e=>{
    for(const k of ['scenario','configuration','version','source','revision']) requireThat(str(e[k]), `Evidence ${k} is required.`);
    requireThat(c.scenarios.includes(e.scenario) && c.configurations.includes(e.configuration), 'Evidence references an undeclared scenario or configuration.');
    requireThat(count(e.trials) && count(e.successes) && e.successes<=e.trials, 'Trials and successes must be nonnegative integers; successes cannot exceed trials.');
    const key=JSON.stringify([e.scenario,e.configuration,e.version]);
    requireThat(!keys.has(key), 'Duplicate scenario/configuration/version evidence.'); keys.add(key);
  });
  return c;
}
export function laboratoryGate(candidate) {
  validateCandidate(candidate);
  const checks=[];
  for (const scenario of candidate.scenarios) for (const configuration of candidate.configurations) {
    const e=candidate.evidence.find(e=>e.scenario===scenario && e.configuration===configuration && e.version===candidate.version);
    let status='pass', reason='Demonstration threshold met';
    if(!e) {status='inconclusive'; reason='Missing evidence for this software version';}
    else if(e.trials<RULES.minTrials) {status='inconclusive'; reason=`Insufficient trials (${e.trials}/${RULES.minTrials})`;}
    else if(e.successes/e.trials<RULES.minSuccess) {status='fail'; reason='Response rate below demonstration threshold';}
    checks.push({scenario,configuration,status,reason,evidence:e??null});
  }
  return {status:checks.some(c=>c.status==='fail')?'fail':checks.some(c=>c.status==='inconclusive')?'inconclusive':'pass', checks};
}
export function validateField(f) {
  requireThat(f && typeof f==='object','Field evidence must be an object.');
  for(const k of ['version','source','revision']) requireThat(str(f[k]),`Field ${k} is required.`);
  for(const k of ['comparable','complete','safeguardsEnabled','seriousEvent']) requireThat(typeof f[k]==='boolean',`${k} must be true or false.`);
  for(const key of ['baseline','post']) {
    requireThat(f[key] && count(f[key].events) && Number.isFinite(f[key].miles) && f[key].miles>=0, 'Events must be nonnegative integers and miles finite nonnegative numbers.');
  }
  return f;
}
export function fieldGate(f, version) {
  if(!f) return {status:'inconclusive',reasons:['No field evidence recorded'],baselineRate:null,postRate:null};
  validateField(f);
  const rates={baselineRate:f.baseline.miles>0?1000*f.baseline.events/f.baseline.miles:null,postRate:f.post.miles>0?1000*f.post.events/f.post.miles:null};
  if(f.version!==version) return {status:'inconclusive',reasons:['Field evidence belongs to a different software version'],...rates};
  const failures=[];
  if(f.seriousEvent) failures.push('Serious-event flag requires investigation');
  if(!f.safeguardsEnabled) failures.push('Required safeguards are not enabled');
  const gaps=[];
  if(!f.complete) gaps.push('Evidence completeness not confirmed');
  if(!f.comparable) gaps.push('Comparison cohorts are not declared comparable');
  if(f.baseline.miles<RULES.minMiles || f.post.miles<RULES.minMiles) gaps.push('Insufficient exposure: at least 1,000 engaged miles per cohort required');
  if(!gaps.length && rates.postRate>rates.baselineRate) failures.push('Selected event rate increased after update');
  return {status:failures.length?'fail':gaps.length?'inconclusive':'pass',reasons:[...failures,...gaps],...rates};
}
function record(s, actor, type, details, now) {
  s.history.push({id:s.history.length+1,at:now,actor,type,details:clone(details)});
}
export function createState(candidate, now=new Date().toISOString()) {
  validateCandidate(candidate);
  const s={schemaVersion:1,candidate:clone(candidate),revision:1,stage:'draft',field:null,everDeployed:false,actions:[],decisions:[],history:[]};
  record(s,candidate.submitter,'Candidate loaded',{candidate,ruleVersion:RULES.version},now);
  return s;
}
function actorFor(id) {const p=PEOPLE.find(p=>p.id===id);requireThat(p,'Unknown demonstration identity.');return p;}
function independent(s,p) {requireThat(['reviewer','safety'].includes(p.role) && p.id!==s.candidate.submitter,'An independent reviewer is required; the submitter cannot approve.');}
function rationale(text) {requireThat(str(text),'A rationale is required (maximum 500 characters).');}
export function transition(state, command, now=new Date().toISOString()) {
  requireThat(Number.isFinite(Date.parse(now)),'Invalid decision time.');
  const s=clone(state), p=actorFor(command.actor);
  switch(command.type) {
    case 'revise': {
      requireThat(p.role==='engineer','Only the engineer can revise candidate evidence.');
      validateCandidate(command.candidate);
      requireThat(command.candidate.id===s.candidate.id && command.candidate.submitter===s.candidate.submitter,'Revision must retain candidate ID and submitter. Load a new candidate to change them.');
      s.candidate=clone(command.candidate);s.revision++;s.stage='draft';s.field=null;
      record(s,p.id,'Evidence revised; approval invalidated',{candidate:s.candidate,revision:s.revision},now);break;
    }
    case 'approveLimited':
    case 'approveExpansion': {
      independent(s,p);rationale(command.rationale);
      requireThat(laboratoryGate(s.candidate).status==='pass','Required laboratory evidence is missing, failed or insufficient.');
      requireThat(!s.actions.some(a=>a.status==='open'),'Open corrective actions must be independently closed first.');
      if(command.type==='approveLimited') requireThat(s.stage==='draft','Limited deployment requires a draft candidate.');
      else {
        requireThat(['limited','review'].includes(s.stage) && s.everDeployed,'Expansion requires prior limited deployment.');
        requireThat(fieldGate(s.field,s.candidate.version).status==='pass','Field evidence is failed or inconclusive.');
      }
      s.stage=command.type==='approveLimited'?'limited':'expanded';s.everDeployed=true;
      const decision={at:now,reviewer:p.id,rationale:command.rationale,stage:s.stage,revision:s.revision,ruleVersion:RULES.version,candidate:clone(s.candidate),field:clone(s.field)};
      s.decisions.push(decision);record(s,p.id,'Release decision recorded',decision,now);break;
    }
    case 'recordField': {
      requireThat(['engineer','safety'].includes(p.role),'Only an engineer or safety lead can submit field evidence.');
      requireThat(s.everDeployed,'Field monitoring begins after simulated limited deployment.');
      validateField(command.field);requireThat(command.field.version===s.candidate.version,'Field evidence must match the current version.');
      const gate=fieldGate(command.field,s.candidate.version);
      if(gate.status!=='pass') {
        requireThat(PEOPLE.some(x=>x.id===command.owner),'Assign a corrective-action owner.');
        requireThat(/^\d{4}-\d{2}-\d{2}$/.test(command.due??'') && Number.isFinite(Date.parse(command.due)) && new Date(command.due).toISOString().slice(0,10)===command.due,'A valid action due date is required.');
        s.actions.push({id:`A-${s.actions.length+1}`,status:'open',owner:command.owner,due:command.due,openedAt:now,revision:s.revision,reasons:gate.reasons,escalatedAt:null});
      }
      s.field=clone(command.field);s.revision++;
      // Any material evidence change invalidates the previous decision, even improved evidence.
      if(s.stage!=='draft') s.stage='review';
      record(s,p.id,'Field evidence recorded; review required',{field:s.field,gate,revision:s.revision},now);break;
    }
    case 'closeAction': {
      independent(s,p);rationale(command.rationale);
      const a=s.actions.find(a=>a.id===command.id);
      requireThat(a?.status==='open','Action is not open.');
      requireThat(a.owner!==p.id,'Action owners cannot independently close their own actions.');
      requireThat(laboratoryGate(s.candidate).status==='pass' && fieldGate(s.field,s.candidate.version).status==='pass','Current laboratory and field checks must pass before closure.');
      a.status='closed';a.closedAt=now;a.closedBy=p.id;a.rationale=command.rationale;
      record(s,p.id,'Action independently closed',{action:a},now);break;
    }
    case 'escalate': {
      const overdue=s.actions.filter(a=>a.status==='open' && a.due<now.slice(0,10) && !a.escalatedAt);
      for(const a of overdue){a.escalatedAt=now;record(s,p.id,'Overdue action escalated to safety lead',{actionId:a.id,safetyLead:'safety'},now);}break;
    }
    default: throw new Error('Unsupported action.');
  }
  return s;
}
export function reviewReport(s,now=new Date().toISOString()) {
  return {generatedAt:now,disclaimer:'Synthetic educational demonstration. Not safety certification, regulatory approval, authenticated authorisation or a tamper-resistant audit trail.',rules:RULES,labGate:laboratoryGate(s.candidate),fieldGate:fieldGate(s.field,s.candidate.version),...clone(s)};
}
