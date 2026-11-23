import {chromium} from 'playwright';
import fs from 'node:fs/promises';import path from 'node:path';import crypto from 'node:crypto';
const dir=import.meta.dirname,out=path.resolve(dir,'../../public/vyaya');await fs.mkdir(out,{recursive:true});await fs.mkdir(dir+'/fonts',{recursive:true});
const final=JSON.parse(await fs.readFile(dir+'/demo-ledger.json','utf8'));
const before={...final,transactions:final.transactions.filter(t=>t.id!==final.transactions.at(-1).id)};
const browser=await chromium.launch({headless:true});const context=await browser.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:2,colorScheme:'dark',locale:'en-US',timezoneId:'America/Chicago'});
await context.route('**/*',async route=>{const u=new URL(route.request().url());if(['127.0.0.1','localhost'].includes(u.hostname)||u.protocol==='data:')return route.continue();if(['fonts.googleapis.com','fonts.gstatic.com'].includes(u.hostname)){const file=dir+'/fonts/'+crypto.createHash('sha256').update(u.href).digest('hex')+(u.hostname==='fonts.googleapis.com'?'.css':'.woff2');try{const body=await fs.readFile(file);return route.fulfill({body,contentType:u.hostname==='fonts.googleapis.com'?'text/css':'font/woff2'});}catch{}const response=await route.fetch();await fs.writeFile(file,await response.body());return route.fulfill({response});}return route.abort();});
const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.clock.install({time:new Date('2026-11-20T18:00:00-06:00')});
await page.addInitScript(snapshot=>{if(!localStorage.getItem('film-seeded')){localStorage.setItem('vyaya.local.v1',JSON.stringify(snapshot));localStorage.setItem('film-seeded','1');}localStorage.setItem('vyaya.theme','dark');localStorage.setItem('vyaya:range','all');sessionStorage.setItem('vyaya.lock.unlocked','1');},before);
const manifest={product:'Vyaya',captureDate:'2026-11-20',fictional:true,viewport:{width:1440,height:1000},dpr:2,pixels:{width:2880,height:2000},sourceApp:'/tmp/vyaya-brag-v2-capture-20261122',dataset:'capture/vyaya/demo-ledger.json',dateFrozen:'2026-11-20T18:00:00-06:00',shots:[],errors};
async function settle(){await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(2100);await page.mouse.move(10,990);}
async function shot(name,purpose,focalSelector,state='before-entry'){
 await settle();const text=await page.locator('body').innerText();const box=focalSelector?await page.locator(focalSelector).first().boundingBox():null;const all=await page.locator('h1,h2,h3,[role="dialog"],svg').evaluateAll(els=>els.map(el=>{const r=el.getBoundingClientRect();return{tag:el.tagName,label:(el.textContent||el.getAttribute('aria-label')||'').slice(0,80),x:r.x,y:r.y,width:r.width,height:r.height};}).filter(r=>r.width>0&&r.height>0&&r.y<1000&&r.y+r.height>0));
 await page.screenshot({path:out+'/'+name+'.png',animations:'disabled'});await fs.writeFile(dir+'/'+name+'-text.txt',text);
 manifest.shots.push({file:'vyaya/'+name+'.png',route:new URL(page.url()).pathname,purpose,state,focalCSS:box,visibleElements:all,sha256:crypto.createHash('sha256').update(await fs.readFile(out+'/'+name+'.png')).digest('hex')});await fs.writeFile(dir+'/capture-manifest.json',JSON.stringify(manifest,null,2));
 console.log(name,new URL(page.url()).pathname,box);
}
await page.goto('http://127.0.0.1:5177/dashboard');await settle();
await page.getByText('−$5,005.45',{exact:true}).waitFor();await shot('overview','Earned vs spent and monthly net, only Everyday; all-time June–November, current month explicitly partial.','main');
await page.goto('http://127.0.0.1:5177/chart/flow');await shot('spending-flow','Salary flows into exact spending categories and not-spent balance; native chart view.','main');
await page.goto('http://127.0.0.1:5177/chart/categories');await shot('category-mix','Native category pie paired with ranked list.','main');
await page.goto('http://127.0.0.1:5177/item/category/groceries');await shot('category-groceries','Native category drilldown to underlying merchants and logged transactions.','main');
await page.goto('http://127.0.0.1:5177/logs');await shot('ledger','Actual transaction ledger, dates/categories/payments.','main');
await page.goto('http://127.0.0.1:5177/dashboard');await page.getByRole('radio',{name:'Fees & Funding',exact:true}).click();await shot('fees-funding','Second lane isolates education funding and tuition/rent; $18,500 in/out, $0 gap.','main');
await page.getByRole('radio',{name:'Settlements',exact:true}).click();await shot('settlements','Third lane records repayments/transfers, explicitly excluded from earned/spent.','main');
await page.getByRole('radio',{name:'Everyday',exact:true}).click();await page.getByRole('button',{name:'Add transaction',exact:true}).click();await shot('entry-empty','Real native transaction sheet opened via Add transaction.','[role="dialog"]');
console.log('inputcontrols',await page.locator('input').evaluateAll(els=>els.map(el=>({placeholder:el.placeholder,label:el.getAttribute('aria-label'),type:el.type}))));
console.log((await page.locator('[role="dialog"]').innerText()).slice(0,6000));
await fs.writeFile(dir+'/entry-dom.html',await page.locator('[role="dialog"]').evaluate(el=>el.outerHTML));
await fs.writeFile(dir+'/capture-manifest.json',JSON.stringify(manifest,null,2));await browser.close();
