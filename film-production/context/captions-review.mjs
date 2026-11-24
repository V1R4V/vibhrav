import {createRequire} from 'node:module';import fs from 'node:fs';import path from 'node:path';
const require=createRequire(new URL('../../package.json',import.meta.url));const {chromium}=require('playwright');
const out=path.resolve(import.meta.dirname,'../deliverables/nura-context/browser-qa');const b=await chromium.launch({headless:true});const results=[];
for(const [width,height] of [[1440,1000],[390,844]]){
 const p=await b.newPage({viewport:{width,height}});const media=[];p.on('response',r=>{if(r.url().endsWith('.mp4'))media.push(r.status());});
 await p.goto('http://127.0.0.1:4394');await p.waitForFunction(()=>document.querySelector('video').readyState>=1);
 await p.screenshot({path:out+`/review-${width}.png`});
 await p.locator('video').evaluate(v=>{v.muted=true;v.textTracks[0].mode='showing';v.currentTime=12;});
 await p.waitForFunction(()=>{const v=document.querySelector('video');return Math.abs(v.currentTime-12)<.1&&!v.seeking&&v.textTracks[0].activeCues?.length>0;},null,{timeout:10000});
 await p.locator('video').evaluate(v=>v.play());await p.waitForFunction(()=>document.querySelector('video').currentTime>=12.25);await p.locator('video').evaluate(v=>v.pause());await p.waitForTimeout(450);
 const r=await p.locator('video').evaluate(v=>({time:v.currentTime,error:v.error?.message??null,seekable:[v.seekable.start(0),v.seekable.end(0)],caption:v.textTracks[0].activeCues[0].text}));
 await p.screenshot({path:out+`/captions-${width}.png`});
 results.push({width,...r,mediaStatuses:media,overflow:await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth)});await p.close();
}
console.log(JSON.stringify(results,null,2));fs.writeFileSync(out+'/caption-seek-results.json',JSON.stringify(results,null,2));await b.close();
