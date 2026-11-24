import assert from 'node:assert/strict';
import fs from 'node:fs';
const d=JSON.parse(fs.readFileSync(new URL('../remotion/src/context-data.json',import.meta.url)));
assert.equal(d.series.length,28);assert.ok(d.series.every(p=>Number.isFinite(p.day)&&Number.isFinite(p.month)),'The selected window has complete score data; no missing value is rendered as zero.');assert.equal(d.series[0].date,'2026-10-26');assert.equal(d.series.at(-1).date,d.date);
assert.equal(Math.round(d.daily.score),81);assert.equal(Math.round(d.trailing28.score),77);
assert.equal(d.daily.pillars.reduce((s,p)=>s+p.weight,0),1);
assert.ok(Math.abs(d.daily.pillars.reduce((s,p)=>s+p.weight*p.score,0)-d.daily.score)<1e-9);
assert.deepEqual(d.daily.pillars.map(p=>p.key),['sleep','activity','fitness','heart']);
assert.equal(d.workout.durationMin,48);assert.equal((d.workout.end-d.workout.start)/60000,48);
// Engine strain.ts rounds plot samples to integer bpm; the mean retains raw precision.
assert.ok(Math.abs(d.workout.series.reduce((s,p)=>s+p[1],0)/d.workout.series.length-d.workout.hrAvg)<=.5);
assert.equal(Math.max(...d.workout.series.map(p=>p[1])),d.workout.hrMax);
assert.equal(d.workout.hrMax,174);assert.equal(Math.round(d.workout.hrAvg),145);
assert.equal(d.workout.zonesMin.reduce((a,b)=>a+b,0)+7.25,48);
assert.equal(d.night.segments.reduce((s,p)=>s+(p.stage==='awake'?0:(p.e-p.s)/60000),0),443);
assert.equal(d.night.segments.reduce((s,p)=>s+(p.stage==='awake'?(p.e-p.s)/60000:0),0),15);
assert.equal(Math.round(d.recovery.contributions.hrv.value),43);assert.equal(Math.round(d.recovery.contributions.hrv.baseline),50);
assert.equal(Math.round(d.recovery.contributions.sleepHr.value),58);assert.equal(Math.round(d.recovery.contributions.sleepHr.baseline),55);
assert.equal(Math.round(d.sleep.score),78);assert.equal(Math.round(d.recovery.score),32);
const cues=JSON.parse(fs.readFileSync(new URL('timings.json',import.meta.url)));
for(let i=0;i<cues.length;i++){assert.ok(cues[i].end<=54);assert.ok(cues[i].end>cues[i].start);if(i)assert.ok(cues[i].start>=cues[i-1].end);assert.ok(cues[i].speed<=1.15);}
console.log('Native-derived scores, source records, all displayed metric totals and narration cue bounds pass.');
