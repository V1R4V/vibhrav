/** Actual browser decode/playback and portfolio integration; no human listening claim. */
import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const out=path.join(root,'qa/browser');await fs.mkdir(out,{recursive:true});
const origin=process.env.FILM_QA_ORIGIN||'http://127.0.0.1:4350';
const short=process.env.FILM_QA_SHORT==='1';
const specs={nura:{duration:46,transitions:[4,10,16,21,22.93,25.33,28,30.63,34,37.2,41]},studyflow:{duration:44,transitions:[4,10,12.5,15,16.5,18,24,31,34.5,38]},vyaya:{duration:34,transitions:[4,10,12,15,19.4,21,23.5,26,29]}};
const b=await chromium.launch({channel:'chrome',headless:true});
const context=await b.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
const results={origin,mode:short?'production smoke':'full normal playback and every listed transition at half speed',films:{},errors:[]};
try{
for(const [slug,spec]of Object.entries(specs)){
 const p=await context.newPage();const requests=[];p.on('pageerror',e=>results.errors.push({slug,error:e.message}));p.on('request',r=>{if(r.url().includes('.mp4'))requests.push(r.url());});
 await p.goto(origin+'/films/'+slug,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);assert.equal(requests.length,0,'No movie loading before viewer intent');
 const video=p.locator(`[data-film-player="${slug}"] video`);await p.screenshot({path:path.join(out,slug+'-poster-desktop.png')});
 await p.getByRole('button',{name:new RegExp('Watch '+(slug==='studyflow'?'StudyFlow':slug==='nura'?'Nura':'Vyaya')+' film')}).click();await p.waitForFunction(()=>document.querySelector('video').currentTime>.1);
 const native=await video.evaluate(v=>({duration:v.duration,muted:v.muted,controls:v.controls,preload:v.preload,src:v.currentSrc,playsInline:v.playsInline}));assert(Math.abs(native.duration-spec.duration)<.05);assert(native.controls&&native.playsInline&&native.preload==='none');
 const range=await context.request.get(native.src,{headers:{Range:'bytes=0-1023'}});assert.equal(range.status(),206);assert.match(range.headers()['content-range'],/^bytes 0-1023\//);
 await video.evaluate(v=>{v.pause();v.textTracks[0].mode='showing';v.currentTime=2;});await p.waitForFunction(()=>document.querySelector('video').textTracks[0].cues?.length>0);await p.waitForTimeout(200);
 const captions=await video.evaluate(v=>({cues:v.textTracks[0].cues.length,active:Array.from(v.textTracks[0].activeCues||[]).map(q=>q.text)}));assert(captions.active.length>0);await p.screenshot({path:path.join(out,slug+'-captions-desktop.png')});
 const fullAxe=await new AxeBuilder({page:p}).analyze();
 // Baseline6e129082 has these same two wordmark labels. Keep the full scan,
 // record them, and fail on any new rule/target rather than changing unrelated UI.
 const unexpected=fullAxe.violations.filter(v=>v.id!=='label-content-name-mismatch'||v.nodes.some(n=>!n.target.every(t=>['.cinematic-wordmark','.footer-signature'].includes(t))));
 assert.equal(unexpected.length,0,JSON.stringify(unexpected));
 const axe=await new AxeBuilder({page:p}).include(`[data-film-player="${slug}"]`).analyze();assert.equal(axe.violations.length,0,JSON.stringify(axe.violations));
 let playback=null;const half=[];
 if(!short){
  await video.evaluate(v=>{v.currentTime=0;v.playbackRate=1;v.textTracks[0].mode='hidden';v.__waits=[];v.onwaiting=()=>v.__waits.push(v.currentTime);});
  await video.evaluate(v=>v.play());await p.waitForFunction(()=>document.querySelector('video').ended,{},{timeout:(spec.duration+20)*1000});
  playback=await video.evaluate(v=>({ended:v.ended,time:v.currentTime,quality:v.getVideoPlaybackQuality().toJSON?.()||{totalVideoFrames:v.getVideoPlaybackQuality().totalVideoFrames,droppedVideoFrames:v.getVideoPlaybackQuality().droppedVideoFrames},waiting:v.__waits}));
  for(const t of spec.transitions){await video.evaluate((v,t)=>{v.currentTime=t-.2;v.playbackRate=.5;},t);await p.waitForFunction(()=>!document.querySelector('video').seeking);await video.evaluate(v=>v.play());await p.waitForTimeout(2400);half.push(await video.evaluate(v=>({time:v.currentTime,error:v.error?.message||null})));await video.evaluate(v=>v.pause());}
 }
 await p.setViewportSize({width:390,height:844});await video.evaluate(v=>{v.pause();v.currentTime=2;});await p.screenshot({path:path.join(out,slug+'-mobile.png')});const box=await video.boundingBox();assert(box.x>=0&&box.x+box.width<=390);assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 results.films[slug]={native,requestsAfterIntent:requests.length,rangeStatus:range.status(),captions,axeViolations:axe.violations.length,preexistingPageViolations:fullAxe.violations,playback,halfSpeedTransitions:half,mobileBounds:box};await fs.writeFile(path.join(out,short?'production-report.json':'report.json'),JSON.stringify(results,null,2));console.log(slug,'PASS',flush());await p.close();
}
const p=await context.newPage();await p.setViewportSize({width:390,height:844});await p.goto(origin+'/#product-films',{waitUntil:'networkidle'});const trigger=p.getByRole('button',{name:/Watch Nura film/}).first();await trigger.scrollIntoViewIfNeeded();await trigger.focus();const before=await p.evaluate(()=>scrollY);await trigger.click();await p.getByRole('dialog',{name:/Nura film/}).waitFor();await p.waitForFunction(()=>document.querySelector('[role="dialog"] video').currentTime>0);await p.screenshot({path:path.join(out,'shelf-dialog-mobile.png')});await p.keyboard.press('Escape');assert.equal(await p.getByRole('dialog').count(),0);assert(await trigger.evaluate(e=>e===document.activeElement));assert(Math.abs(await p.evaluate(()=>scrollY)-before)<2);assert.equal(await p.locator('video').count(),0);results.dialog={closed:true,focusRestored:true,videoUnmounted:true};await p.close();assert.equal(results.errors.length,0);await fs.writeFile(path.join(out,short?'production-report.json':'report.json'),JSON.stringify(results,null,2));
}finally{await b.close();}
function flush(){return '';}
