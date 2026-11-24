/** Recompute from the approved fictional capture environment, never from a live account. */
import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
const app=process.env.NURA_SOURCE??'/tmp/nura-brag-capture-20261121';
const {dailyHealth,healthScore,window28,healthSeries}=await import(pathToFileURL(path.join(app,'apps/web/src/lib/health.ts')).href);
const source=JSON.parse(fs.readFileSync(path.join(app,'data/film-rebuild-dataset.json'),'utf8'));
const ctx={workouts:source.workouts,age:source.profile.age,sex:source.profile.sex};
const day=source.days.at(-1),workout=source.workouts.find((w:any)=>w.date==='2026-11-19'&&w.activity==='running');
const data={date:day.date,daily:dailyHealth(source.days,source.days.length-1,ctx),trailing28:healthScore(window28(source.days,day.date),ctx,source.days),series:healthSeries(source.days,source.days.slice(-28),ctx),workout,night:day.night,recovery:day.recovery,sleep:day.sleep};
fs.writeFileSync(new URL('../remotion/src/context-data.json',import.meta.url),JSON.stringify(data,null,2));
console.log({daily:data.daily?.score,trailing:data.trailing28?.score,series:data.series.length,workout:workout.durationMin});
