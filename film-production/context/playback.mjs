/** Full native browser playback at 1x and 0.5x; runtime evidence, not a human listening claim. */
import {createRequire} from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
const require=createRequire(new URL('../../package.json',import.meta.url));const {chromium}=require('playwright');
const base=process.env.FILM_REVIEW_URL??'http://127.0.0.1:4394';const file=process.argv[2]??'Nura-Behind-the-Number-Web.mp4';
const out=path.resolve(import.meta.dirname,'../deliverables/nura-context/browser-qa');fs.mkdirSync(out,{recursive:true});
const b=await chromium.launch({headless:true});const p=await b.newPage({viewport:{width:1440,height:1000}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.goto(base);await p.setContent(`<html><head><style>body{margin:0;background:#101d17;min-height:100vh;display:grid;place-items:center}video{width:100%;max-width:1440px;aspect-ratio:16/9}</style></head><body><video controls playsinline muted preload="auto" src="${base}/${file}" crossorigin="anonymous"><track kind="captions" srclang="en" label="English" src="${base}/captions.vtt"></video></body></html>`);
await p.locator('video').evaluate(v=>new Promise((resolve,reject)=>{v.onloadedmetadata=resolve;v.onerror=()=>reject(v.error?.message);if(v.readyState>=1)resolve();}));
const results=[];
for(const rate of [1,.5]){
 await p.locator('video').evaluate(async(v,r)=>{v.currentTime=0;v.playbackRate=r;await v.play();},rate);
 const start=Date.now();await p.waitForFunction(()=>document.querySelector('video').ended,null,{timeout:125000});
 results.push(await p.locator('video').evaluate((v,start)=>({rate:v.playbackRate,duration:v.duration,currentTime:v.currentTime,ended:v.ended,error:v.error?.message??null,frames:v.getVideoPlaybackQuality().totalVideoFrames,dropped:v.getVideoPlaybackQuality().droppedVideoFrames,elapsedMs:Date.now()-start}),start));
 console.log(JSON.stringify(results.at(-1)));
}
for(const [width,height] of [[1440,1000],[390,844]]){
 await p.setViewportSize({width,height});await p.locator('video').evaluate(v=>{v.pause();v.textTracks[0].mode='showing';v.currentTime=12;});await p.waitForFunction(()=>{const v=document.querySelector('video');return Math.abs(v.currentTime-12)<.1&&!v.seeking&&v.textTracks[0].activeCues?.length>0;},null,{timeout:10000});await p.screenshot({path:out+`/captions-${width}.png`});
 const box=await p.locator('video').boundingBox();if(box.width>width+1)throw Error('Responsive overflow');
}
const report={file,errors,results};if(errors.length||results.some(r=>r.error||!r.ended))throw Error('Playback failure');fs.writeFileSync(out+'/results.json',JSON.stringify(report,null,2));await b.close();
