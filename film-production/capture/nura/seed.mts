/** Fictional Apple-Watch-like records, scored by the actual Nura engine. No personal records. */
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const app = process.env.NURA_SOURCE ?? '/tmp/nura-brag-capture-20261121';
const {Collector} = await import(pathToFileURL(path.join(app,'packages/engine/src/derive/collect.ts')).href);
const {buildDataset} = await import(pathToFileURL(path.join(app,'packages/engine/src/derive/dataset.ts')).href);
const {addDays,zonedMidnight} = await import(pathToFileURL(path.join(app,'packages/engine/src/time.ts')).href);
const TZ='America/Chicago', FIRST='2026-03-16',N=252,MIN=60000;
const c = new Collector(TZ),source='Fictional Watch — film seed 2026-11',device='watch';
const missing = new Set([48,109,170]);
const events:any[]=[]; const record = (e:any)=>{events.push(e);c.add(e)};
const sample=(metric:string,value:number,start:number,kind='discrete',unit='count')=>record({type:'sample',sample:{metric,kind,value,start,end:start,source,device,unit}});
const nights:any[]=[];
for(let i=0;i<N;i++){
 const date=addDays(FIRST,i),base=zonedMidnight(date,TZ),weekday=new Date(date+'T12:00:00Z').getUTCDay();
 if(missing.has(i))continue;
 const phase=Math.sin(i*.19),strainLag=(i%7===3||i%7===6)?1:0;
 const bedM=22*60+35+Math.round(17*Math.sin(i*.41))+(weekday===6?35:0);
 const duration=465+Math.round(22*Math.cos(i*.23))-(strainLag?15:0);
 const begin=zonedMidnight(addDays(date,-1),TZ)+bedM*MIN;
 const stageKinds=['core','deep','core','rem','awake','core','deep','rem','core','awake','core','rem'];
 const lengths=[45,43,59,27,5+i%4,65,27,32,61,5+(i%3),0,34];
 lengths[10]=duration-lengths.reduce((a,b)=>a+b,0);
 let at=begin;const segs:any[]=[];
 for(let j=0;j<stageKinds.length;j++){const segment={start:at,end:at+lengths[j]*MIN,stage:stageKinds[j],source,device};record({type:'sleep',segment});segs.push(segment);at=segment.end;}
 nights.push({date,start:begin,end:at,baseHr:55-2.5*phase+strainLag*1.5,segs});
 // Sleep-derived raw respiratory, oxygen and temperature readings, never synthetic score values.
 for(let j=0;j<12;j++){
  const t=begin+(30+j*32)*MIN;
  sample('respiratoryRate',14.2+.25*phase+.18*Math.sin(j*1.4),t,'discrete','count/min');
  sample('spo2',97.2+.3*Math.sin(i*.37+j*.4),t,'discrete','%');
  sample('wristTemp',36.3+.07*phase+.04*Math.cos(j*.8),t,'discrete','degC');
  // Input SDNN windows; no beat intervals are invented to pretend RMSSD is measured.
  record({type:'hrv',reading:{start:t,end:t+MIN,sdnnMs:48+6.5*phase+1.8*Math.sin(j*.77)-strainLag*2,beats:[],source,device}});
 }
 const workoutSpec = weekday===1?{activity:'running',duration:36+(i%4)*2,kind:'easy'}:weekday===2?{activity:'traditionalStrengthTraining',duration:48+(i%3)*3,kind:'strength'}:weekday===4?{activity:'running',duration:44+(i%3)*2,kind:'interval'}:weekday===6?{activity:'cycling',duration:64+(i%4)*4,kind:'endurance'}:weekday===0?{activity:'walking',duration:32+(i%3)*4,kind:'walk'}:null;
 const start=base+(weekday===6?9*60+15:17*60+35)*MIN;
 const end=workoutSpec?start+workoutSpec.duration*MIN:0;
 const rest=58+Math.round(1.4*Math.cos(i*.16));
 for(let m=0;m<24*60;m+=5){
  const t=base+m*MIN;if(m>=22*60)continue;if(workoutSpec&&t>=start&&t<=end)continue;
  const night=nights.findLast((n)=>t>=n.start&&t<n.end);
  const hr=night?night.baseHr+2.2*Math.sin((t-night.start)/MIN*.03):m<8*60?58+2*Math.sin(m*.1):67+8*Math.sin(m*.009)+3*Math.cos(m*.19+i);
  sample('heartRate',Math.round(hr*10)/10,t,'discrete','count/min');
 }
 if(workoutSpec){
  const duration=workoutSpec.duration;
  const kcal=Math.round(duration*({easy:9.7,interval:11.2,strength:6,endurance:8.3,walk:4.1}[workoutSpec.kind]??7));
  const dist=workoutSpec.activity==='running'?duration/(workoutSpec.kind==='interval'?5.75:6.35):workoutSpec.activity==='cycling'?duration*.34:workoutSpec.activity==='walking'?duration*.083:null;
  record({type:'workout',workout:{activity:workoutSpec.activity,start,end,durationMin:duration,source,device,stats:{activeEnergy:{sum:kcal,unit:'kcal'},...(dist?{distance:{sum:dist,unit:'km'}}:{})}}});
  for(let m=0;m<duration;m+=.25){
   const warm=Math.min(1,m/6,(duration-m)/4);
   const target=workoutSpec.kind==='easy'?140+3*Math.sin(m*.6):workoutSpec.kind==='interval'?((Math.floor((m-6)/3)%2===0)?171:140)+3*Math.sin(m*.8):workoutSpec.kind==='strength'?113+16*Math.sin(m*.7)**2:workoutSpec.kind==='endurance'?143+9*Math.sin(m*.11):110+5*Math.sin(m*.17);
   sample('heartRate',Math.round((rest+(target-rest)*Math.max(0,warm))*10)/10,start+m*MIN,'discrete','count/min');
  }
  if(workoutSpec.kind==='strength')sample('workoutEffort',5+(i%3)*.5,start,'discrete','count');
 }
 const walkSteps=5700+Math.round(1500*Math.sin(i*.43));
 const workoutSteps=workoutSpec?.activity==='running'?Math.round(workoutSpec.duration*156):workoutSpec?.activity==='walking'?Math.round(workoutSpec.duration*105):0;
 const totals:any={steps:walkSteps+workoutSteps,distanceWalkRun:(walkSteps*.00072)+(workoutSpec?.activity==='running'?workoutSpec.duration/6.1:workoutSteps*.00072),flights:7+i%8,activeEnergy:260+(workoutSpec?Math.round(workoutSpec.duration*7):0),basalEnergy:1740+Math.round(12*Math.sin(i*.2)),exerciseMin:workoutSpec?.duration??0,standMin:640+i%80,daylightMin:24+i%37};
 for(const [metric,value]of Object.entries(totals))sample(metric,value as number,base+20*60*MIN,'cumulative');
 sample('restingHeartRate',rest,base+10*60*MIN,'discrete','count/min');
 sample('walkingHeartRate',91+2*Math.sin(i*.2),base+12*60*MIN,'discrete','count/min');
 sample('weight',72.4-.0015*i+.2*Math.sin(i*.1),base+8*60*MIN,'discrete','kg');
 if(workoutSpec?.activity==='running')sample('vo2max',43.5+i*.009+Math.sin(i*.21)*.3,end+MIN,'discrete','mL/kg/min');
 if(workoutSpec&&workoutSpec.kind!=='strength')sample('cardioRecovery',27+2*Math.sin(i*.15),end+MIN,'discrete','count/min');
}
// Night samples from the evening before FIRST are necessary for a complete first night.
for(const n of nights)for(let t=n.start;t<n.end;t+=5*MIN){if(t>=zonedMidnight(n.date,TZ))continue;sample('heartRate',Math.round((n.baseHr+2*Math.sin((t-n.start)/MIN*.03))*10)/10,t,'discrete','count/min');}
const ds=buildDataset(c,{birthDate:'1994-03-18',sex:'male',timeZone:TZ},{fromDate:FIRST});
ds.generatedAt='2026-11-22T23:59:00Z';
const out=process.env.NURA_SEED_OUT??path.join(app,'data/film-rebuild-dataset.json');
fs.writeFileSync(out,JSON.stringify(ds));
fs.writeFileSync(path.join(path.dirname(out),'film-rebuild-inputs.json'),JSON.stringify({fictional:true,first:FIRST,count:N,missingDays:[...missing].map(i=>addDays(FIRST,i)),events}));
console.log(JSON.stringify({file:out,days:ds.days.length,workouts:ds.workouts.length,last:ds.days.at(-1),lastWorkout:ds.workouts.at(-1)},null,2));
