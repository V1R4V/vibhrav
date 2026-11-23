import {chromium} from 'playwright';
import fs from 'node:fs/promises';import path from 'node:path';import crypto from 'node:crypto';
const dir=import.meta.dirname,out=path.resolve(dir,'../../public/nura');await fs.mkdir(out,{recursive:true});
const b=await chromium.launch({headless:true,channel:'chrome'});const c=await b.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:2,colorScheme:'dark',reducedMotion:'reduce',locale:'en-US',timezoneId:'America/Chicago'});
await c.addInitScript(()=>localStorage.setItem('nura-theme','dark'));
const p=await c.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
const manifest={product:'Nura',fictional:true,sourceHead:'878caede',origin:'http://127.0.0.1:3238',source:'/Users/vibhravjha/Code/health-tracker',seed:'seed.mts',validation:'data-validation.json',viewport:{width:1440,height:1000},dpr:2,shots:[],errors};
async function settle(){await p.evaluate(()=>document.fonts.ready);await p.addStyleTag({content:'nextjs-portal{display:none!important}'});await p.waitForTimeout(1500);await p.mouse.move(8,990);}
async function go(route){await p.goto('http://127.0.0.1:3238'+route,{waitUntil:'networkidle'});await settle();}
async function shot(name,purpose){await settle();await p.screenshot({path:out+'/'+name+'.png',animations:'disabled'});const text=await p.locator('body').innerText();await fs.writeFile(dir+'/'+name+'-text.txt',text);const focal=await p.locator('h1,h2,h3,.card').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return {tag:e.tagName,label:e.textContent?.slice(0,140),x:r.x,y:r.y,width:r.width,height:r.height}}).filter(r=>r.width>150&&r.y<1000&&r.y+r.height>0));manifest.shots.push({name,file:'nura/'+name+'.png',route:new URL(p.url()).pathname+new URL(p.url()).search,scrollY:await p.evaluate(()=>window.scrollY),purpose,focal,sha256:crypto.createHash('sha256').update(await fs.readFile(out+'/'+name+'.png')).digest('hex')});await fs.writeFile(dir+'/captures.json',JSON.stringify(manifest,null,2));console.log(name,manifest.shots.at(-1).route,manifest.shots.at(-1).scrollY);}
await go('/');await shot('summary-top','Native unified dashboard top, context only. Not hero sleep-first.');
await p.evaluate(()=>window.scrollTo(0,700));await shot('overview','Summary health overview with daily health contributions and other metrics; native dashboard scroll.');
await p.getByRole('radio',{name:'28 days',exact:true}).click();await shot('overview-28','Same dashboard, actual 28-day tab selected; separate construct from Day.');
await go('/health?range=1m');await shot('health-month','Native period health score, explicitly Month and Oct24–Nov22.');
await p.getByRole('radio',{name:'Day',exact:true}).click();await shot('health-day','Same native health card switched to Day; selected period remains chart scope.');
await p.getByText('Day by day',{exact:true}).scrollIntoViewIfNeeded();await p.evaluate(()=>window.scrollBy(0,-100));await shot('health-trend','Actual daily bars and rolling 28-day score line; no animated invented values.');
await go('/cardio?range=1m');await shot('cardio','Cardio fitness and source-derived trend.');
await go('/strain?range=1m');await shot('strain','Native activity intensity and total period view, not fake zone drilldown.');
await go('/workouts?range=1m');await shot('workouts','Actual workout sessions within the chosen period.');
const link=p.locator('a[href^="/workouts/"]').filter({hasText:'Running'}).first();await link.click();await settle();await shot('workout-detail','Actual linked running session summary; timestamps/duration/HR all from one record.');
await p.getByText('Heart rate',{exact:true}).last().scrollIntoViewIfNeeded();await p.evaluate(()=>window.scrollTo(0,280));await shot('workout-zones','Native workout heart-rate trace and time in zones.');
await go('/');await p.getByRole('button',{name:'Choose a day'}).click();await shot('calendar','Actual historical date picker with daily health-score legend.');
console.log('calendarbuttons',await p.locator('.day-jump button').allTextContents());
await p.locator('.day-jump').getByRole('button',{name:/November 19th, 2026/}).click().catch(async()=>{await p.getByRole('button',{name:'Previous day'}).click();});await settle();await shot('historical-top','Actual historical navigation; native date and past-day wording.');await p.evaluate(()=>window.scrollTo(0,700));await shot('historical-summary','Historical daily summary with four-week context leading up to that selected day.');
await go('/sleep?range=1m');await shot('sleep','Supporting sleep score and actual last-night stages.');
await go('/recovery?range=1m');await shot('recovery','Supporting recovery estimate and own-baseline inputs, distinct from health score.');
await fs.writeFile(dir+'/captures.json',JSON.stringify(manifest,null,2));await b.close();
