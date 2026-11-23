import {chromium} from 'playwright';
import fs from 'node:fs/promises';
const snapshot=JSON.parse(await fs.readFile(new URL('./demo-ledger.json',import.meta.url),'utf8'));
const browser=await chromium.launch({headless:true});const context=await browser.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:2,colorScheme:'dark'});const page=await context.newPage();await page.clock.install({time:new Date('2026-11-20T18:00:00-06:00')});
await page.addInitScript(snapshot=>{localStorage.setItem('vyaya.local.v1',JSON.stringify(snapshot));localStorage.setItem('vyaya.theme','dark');localStorage.setItem('vyaya:range','all');sessionStorage.setItem('vyaya.lock.unlocked','1');},snapshot);
await page.goto('http://127.0.0.1:5177/dashboard');await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(4200);
console.log((await page.locator('body').innerText()).slice(0,8000));console.log('fonts',await page.evaluate(()=>[...document.fonts].map(f=>({family:f.family,status:f.status}))));
await page.screenshot({path:'/tmp/vibhrav-film-rebuild/film-production/public/vyaya/inspect-overview.png'});await browser.close();
