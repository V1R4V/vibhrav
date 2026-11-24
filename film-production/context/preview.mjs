import {openBrowser,selectComposition,renderStill} from '../remotion/node_modules/@remotion/renderer/dist/esm/index.mjs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const serveUrl=root+'/remotion/build';
const browser=await openBrowser('chrome',{chromiumOptions:{gl:'angle'}});
try{
 const composition=await selectComposition({serveUrl,id:'NuraContext',puppeteerInstance:browser});
 for(const frame of process.argv.slice(2).map(Number)){
  const output=root+`/deliverables/nura-context/refined-${frame}.png`;
  await renderStill({serveUrl,composition,puppeteerInstance:browser,frame,output,chromiumOptions:{gl:'angle'},logLevel:'error'});console.log(output);
 }
}finally{await browser.close({silent:true});}
