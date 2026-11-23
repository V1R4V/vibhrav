import {writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.dirname(fileURLToPath(import.meta.url));
export const fixedTime='2026-11-20T19:30:00.000Z';
export const today='2026-11-20';
export const subjects=[{id:1,name:'Algorithms',color:'#7c8cff',weeklyGoal:6},{id:2,name:'Computer Systems',color:'#31c8b4',weeklyGoal:4},{id:3,name:'Product Studio',color:'#e9b66b',weeklyGoal:4}];
// A student's five-week coursework log, authored at source-record level.
// Dates, clocks and focus minutes determine every visible aggregate.
const rows=[
['2026-10-19',1,'09:10',50,4,1,'Traced merge sort and compared stable sorting algorithms.'],
['2026-10-19',2,'14:00',40,4,0,'Mapped CPU, memory and I/O paths.'],
['2026-10-20',3,'10:20',75,4,1,'Sketched three navigation flows for the studio prototype.'],
['2026-10-21',1,'09:00',65,5,0,'Solved binary-search boundary cases.'],
['2026-10-22',2,'13:10',55,3,2,'Reviewed process state transitions and context switching.'],
['2026-10-23',3,'10:00',70,4,1,'Tested navigation labels with a classmate.'],
['2026-10-24',1,'11:00',45,4,0,'Practiced stack and queue problems.'],
['2026-10-26',1,'09:15',75,5,0,'Implemented linked-list reversal and cycle detection.'],
['2026-10-26',2,'14:10',45,4,1,'Compared threads and processes.'],
['2026-10-27',3,'10:00',85,4,1,'Built the first interactive prototype.'],
['2026-10-28',1,'09:00',60,4,1,'Used hash maps for frequency counting.'],
['2026-10-28',2,'14:00',50,5,0,'Annotated scheduling examples: FIFO and round robin.'],
['2026-10-29',3,'10:30',65,3,2,'Reworked the empty-state and error-state flows.'],
['2026-10-30',1,'09:10',55,4,0,'Wrote tests for tree traversal helpers.'],
['2026-10-31',2,'11:15',60,4,1,'Worked through deadlock conditions and prevention.'],
['2026-11-02',1,'09:00',70,4,1,'Compared DFS and BFS on adjacency lists.'],
['2026-11-02',2,'14:00',55,5,0,'Reviewed virtual memory and address translation.'],
['2026-11-03',3,'10:15',90,5,0,'Built responsive navigation and keyboard focus states.'],
['2026-11-04',1,'09:15',80,4,1,'Solved shortest-path exercises using Dijkstra.'],
['2026-11-04',2,'14:10',45,4,0,'Worked through page-replacement examples.'],
['2026-11-05',3,'10:00',75,4,1,'Tested the mobile prototype and revised touch targets.'],
['2026-11-06',1,'09:00',60,5,0,'Practiced topological sorting and dependency graphs.'],
['2026-11-07',2,'11:00',65,3,2,'Summarized cache mapping and associativity.'],
['2026-11-09',1,'09:10',85,5,0,'Developed dynamic-programming recurrence relations.'],
['2026-11-09',2,'14:00',50,4,1,'Measured cache locality in small C examples.'],
['2026-11-10',3,'10:00',95,4,1,'Built a reusable input component with validation.'],
['2026-11-11',1,'09:00',70,4,1,'Compared memoization with tabulation.'],
['2026-11-11',2,'14:00',60,5,0,'Reviewed file descriptors and buffered I/O.'],
['2026-11-12',3,'10:30',80,4,1,'Revised the onboarding flow from usability notes.'],
['2026-11-13',1,'09:15',55,4,0,'Solved knapsack variations and checked edge cases.'],
['2026-11-14',2,'11:00',45,4,0,'Prepared a storage hierarchy summary.'],
['2026-11-16',1,'09:00',80,5,0,'Compared BFS and DFS on weighted and unweighted graphs.'],
['2026-11-16',2,'14:00',50,4,1,'Traced a page fault from process to disk.'],
['2026-11-17',3,'10:00',95,5,0,'Implemented the studio prototype settings flow.'],
['2026-11-18',1,'09:00',75,4,1,'Solved three graph traversal exercises; checked complexity.'],
['2026-11-18',2,'14:10',65,4,0,'Compared write-through and write-back cache policies.'],
['2026-11-19',3,'10:00',90,4,1,'Tested keyboard navigation and fixed focus order.'],
['2026-11-19',1,'14:00',50,5,0,'Implemented union-find with path compression.'],
['2026-11-20',1,'09:00',45,5,0,'Reviewed minimum spanning trees and cut properties.'],
['2026-11-20',2,'11:00',35,4,0,'Consolidated notes on memory hierarchy and locality.'],
];
export const sessions=rows.map(([date,sid,start,minutes,focus,distractions,notes],i)=>{
 const subject=subjects.find(s=>s.id===sid);const startedAt=new Date(`${date}T${start}:00-05:00`).getTime()+(date>='2026-11-01'?3600000:0);return {id:startedAt,subjectId:sid,subjectName:subject.name,subjectColor:subject.color,date,duration:minutes,durationSeconds:minutes*60,startedAt,endedAt:startedAt+minutes*60000,focusRating:focus,distractions,notes,mode:i%2===0?'custom':'stopwatch'};
});
// Per-date plan, one week. Algorithms 6h; Computer Systems 4h; Product Studio 4h.
const plan=[[0,1.5,0,1.5,1,1,1],[0,1,0,1,0,1,1],[0,0,1.5,0,1.5,0,1]];
export const planEntries=subjects.flatMap((s,idx)=>plan[idx].map((hours,day)=>({id:`plan-${s.id}-${day}`,subjectId:String(s.id),scope:'once',date:`2026-11-${15+day}`,hours})));
export const fixture={synthetic:true,fixedTime,today,timezone:'America/Chicago',subjects,sessions,planEntries};
await writeFile(path.join(root,'fixture.json'),JSON.stringify(fixture,null,2));
