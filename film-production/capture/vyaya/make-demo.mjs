import fs from 'node:fs';
const dir=import.meta.dirname;
const categories=[
['food-rest','Dining','#3DDC97','everyday'],['food-deliv','Delivery','#2FD3E1','everyday'],['groceries','Groceries','#8B7BF0','everyday'],['shopping','Shopping','#F5A524','everyday'],['transport','Transport','#FF7A70','everyday'],['subs','Subscriptions','#5B8DEF','everyday'],['entertainment','Entertainment','#42E09A','everyday'],['academic','Books & study','#C8BFFF','everyday'],['bills','Bills','#65FDB5','everyday'],['salary','Salary','#3DDC97','everyday'],['tuition','Tuition & fees','#8B7BF0','bag'],['rent','Housing & rent','#8B7BF0','bag'],['support','Education funding','#8B7BF0','bag'],['split','Split repayment','#7A828E','settlement'],['transfer','Account transfer','#7A828E','settlement']].map(([id,name,colour,lane])=>({id,name,colour,lane}));
// Every amount below is fictional integer cents. A single authored ledger drives every screen.
const profiles=[
 {month:'2026-06',salary:[94000,94000],grocery:[5812,6247,7136,4995],dining:[1240,1850,940,2635,1575,820],delivery:[2484,3167],transport:[2340,1465,3100],shopping:[7490,3250],books:3850,fun:[2800,1599]},
 {month:'2026-07',salary:[99000,99000],grocery:[6248,7325,5187,6863],dining:[1450,2425,875,1895,3260,1120],delivery:[3248,2785,3621],transport:[1870,2235,1450],shopping:[9800],books:2400,fun:[4500,1799]},
 {month:'2026-08',salary:[96000,96000],grocery:[7134,8260,5625,6828],dining:[1345,2460,1790,3150,985,2240],delivery:[2674,3815],transport:[3250,1895,2455,1200],shopping:[5490,8750],books:12800,fun:[2499,3200]},
 {month:'2026-09',salary:[92000,92000],grocery:[5840,6375,8420,4928],dining:[1295,1870,1545,2675,960,2140],delivery:[2945,3260,2480],transport:[2165,1740,1250],shopping:[6990,4500],books:6425,fun:[1800,2499]},
 {month:'2026-10',salary:[98000,98000],grocery:[6875,7420,5368,8194],dining:[1495,2235,1980,3240,1185,2760],delivery:[3450,2925,3860],transport:[1840,2650,1520,2295],shopping:[12400,3850],books:3450,fun:[4200,2899]},
 {month:'2026-11',salary:[92500,92500],grocery:[6215,7840,5385],dining:[1375,2480,1690,2195,945],delivery:[2765,3240],transport:[1945,2475,1380],shopping:[8650],books:2895,fun:[2499]},
];
const transactions=[]; let id=0;
const add=(date,merchant,categoryId,amount,lane='everyday',direction='out',extra={})=>transactions.push({id:`film-vy-${String(++id).padStart(3,'0')}`,date,merchant,categoryId,amount,lane,direction,source:'manual',paymentMethod:'Credit Card',...extra});
for(const p of profiles){
 const days=p.month==='2026-11'?[2,8,16]:[2,9,17,25];
 p.salary.forEach((v,i)=>add(`${p.month}-${i===0?'05':'19'}`,'Salary','salary',v,'everyday','in',{paymentMethod:'Bank Transfer'}));
 p.grocery.forEach((v,i)=>add(`${p.month}-${String(days[i]).padStart(2,'0')}`,['Trader Joe’s','Woodman’s','Target','Trader Joe’s'][i],'groceries',v));
 p.dining.forEach((v,i)=>add(`${p.month}-${String([3,6,10,13,17,27][i]).padStart(2,'0')}`,['Campus café','Noodles & Co','Campus café','Ian’s Pizza','Campus café','Noodles & Co'][i],'food-rest',v));
 p.delivery.forEach((v,i)=>add(`${p.month}-${String([7,14,28][i]).padStart(2,'0')}`,['DoorDash','Uber Eats','DoorDash'][i],'food-deliv',v,'everyday','out',{venue:['Noodle House','Green Bowl','Pizzeria'][i]}));
 p.transport.forEach((v,i)=>add(`${p.month}-${String([4,12,18,26][i]).padStart(2,'0')}`,['Uber','Lyft','Metro','Uber'][i],'transport',v,'everyday','out',{paymentMethod:'Debit Card'}));
 p.shopping.forEach((v,i)=>add(`${p.month}-${i===0?'11':'24'}`,['Uniqlo','Amazon'][i],'shopping',v));
 add(`${p.month}-03`,'Spotify','subs',599);add(`${p.month}-10`,'iCloud','subs',299);add(`${p.month}-16`,'Adobe','subs',1999);
 add(`${p.month}-01`,'Phone plan','bills',3500,'everyday','out',{paymentMethod:'Bank Transfer'});add(`${p.month}-15`,'Internet','bills',4500,'everyday','out',{paymentMethod:'Bank Transfer'});
 add(`${p.month}-12`,'Bookstore','academic',p.books);
 p.fun.forEach((v,i)=>add(`${p.month}-${i===0?'18':'29'}`,['Cinema','Steam'][i],'entertainment',v));
 add(`${p.month}-01`,'Education fund','support',95000,'bag','in',{counterparty:'Education fund',paymentMethod:'Bank Transfer'});
 add(`${p.month}-02`,'Housing office','rent',95000,'bag','out',{purpose:'Housing & rent',paymentMethod:'Bank Transfer'});
 if(p.month==='2026-08'){
  add(`${p.month}-18`,'Education fund','support',1280000,'bag','in',{counterparty:'Education fund',paymentMethod:'Bank Transfer'});
  add(`${p.month}-20`,'University tuition','tuition',1280000,'bag','out',{purpose:'Tuition & fees',paymentMethod:'Bank Transfer'});
 }
 add(`${p.month}-17`,'Shared meal repayment','split',p.month==='2026-11'?2195:1850,'settlement','in',{paymentMethod:'Zelle'});
 add(`${p.month}-19`,'Account transfer','transfer',10000,'settlement','out',{paymentMethod:'Bank Transfer'});
}
// The newest row is the interaction demonstrated in the film; amount/category/payment remain visible.
add('2026-11-20','Campus café','food-rest',525,'everyday','out',{paymentMethod:'Debit Card',note:'Coffee after the studio session'});
const snapshot={categories,transactions,venues:[{id:'noodle-house',name:'Noodle House'},{id:'green-bowl',name:'Green Bowl'},{id:'pizzeria',name:'Pizzeria'}]};
fs.writeFileSync(dir+'/demo-ledger.json',JSON.stringify(snapshot,null,2));
const sum=x=>x.reduce((a,t)=>a+t.amount,0);
const report={fictional:true,date:'2026-11-20',rows:transactions.length,checks:{allPositiveIntegerCents:transactions.every(t=>Number.isSafeInteger(t.amount)&&t.amount>0),uniqueIds:new Set(transactions.map(t=>t.id)).size===transactions.length,allCategoriesResolve:transactions.every(t=>categories.some(c=>c.id===t.categoryId&&c.lane===t.lane)),noFutureRows:transactions.every(t=>t.date<='2026-11-20'),noPersonalNames:!JSON.stringify(snapshot).match(/Vibhrav|Jha|@/),settlementsExcludedFromEveryday:true},lanes:{},months:[],categoryTotals:{}};
for(const lane of ['everyday','bag','settlement']){const tx=transactions.filter(t=>t.lane===lane);report.lanes[lane]={rows:tx.length,inflowCents:sum(tx.filter(t=>t.direction==='in')),outflowCents:sum(tx.filter(t=>t.direction==='out'))};report.lanes[lane].netCents=report.lanes[lane].inflowCents-report.lanes[lane].outflowCents;}
for(const p of profiles){const tx=transactions.filter(t=>t.date.startsWith(p.month)&&t.lane==='everyday');report.months.push({month:p.month,inflowCents:sum(tx.filter(t=>t.direction==='in')),outflowCents:sum(tx.filter(t=>t.direction==='out')),partial:p.month==='2026-11'});}
for(const c of categories.filter(c=>c.lane==='everyday'&&c.id!=='salary'))report.categoryTotals[c.name]=sum(transactions.filter(t=>t.categoryId===c.id&&t.direction==='out'));
report.checks.categoryTotalsEqualEverydayOutflow=Object.values(report.categoryTotals).reduce((a,n)=>a+n,0)===report.lanes.everyday.outflowCents;
report.checks.bagClosedLoop=report.lanes.bag.netCents===0;
report.checks.monthlyTotalsEqualEverydayOutflow=report.months.reduce((a,m)=>a+m.outflowCents,0)===report.lanes.everyday.outflowCents;
fs.writeFileSync(dir+'/data-validation.json',JSON.stringify(report,null,2));
if(Object.values(report.checks).some(x=>!x))throw Error('Dataset invalid');console.log(JSON.stringify(report,null,2));
