/** Local-only review server with byte-range delivery for native video seeking. */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(process.argv[2]??new URL('../deliverables/nura-context',import.meta.url).pathname);
const port=Number(process.env.FILM_REVIEW_PORT??4394);
const types={'.mp4':'video/mp4','.vtt':'text/vtt; charset=utf-8','.html':'text/html; charset=utf-8','.jpg':'image/jpeg','.srt':'application/x-subrip','.txt':'text/plain; charset=utf-8','.json':'application/json','.zip':'application/zip'};
http.createServer((req,res)=>{
 try{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405).end();return;}
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
  if(path.relative(root,file).startsWith('..')){res.writeHead(403).end();return;}
  const stat=fs.statSync(file);if(!stat.isFile()){res.writeHead(404).end();return;}
  const headers={'Content-Type':types[path.extname(file)]??'application/octet-stream','Accept-Ranges':'bytes','Cache-Control':'no-store'};
  let start=0,end=stat.size-1,status=200;
  if(req.headers.range){
   const m=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
   if(!m||(!m[1]&&!m[2])){res.writeHead(416,{'Content-Range':`bytes */${stat.size}`}).end();return;}
   if(!m[1])start=Math.max(0,stat.size-Number(m[2]));
   else {start=Number(m[1]);if(m[2])end=Math.min(end,Number(m[2]));}
   if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>end||start>=stat.size){res.writeHead(416,{'Content-Range':`bytes */${stat.size}`}).end();return;}
   status=206;headers['Content-Range']=`bytes ${start}-${end}/${stat.size}`;
  }
  headers['Content-Length']=end-start+1;res.writeHead(status,headers);
  if(req.method==='HEAD'){res.end();return;}
  const stream=fs.createReadStream(file,{start,end});stream.on('error',()=>res.destroy());res.on('close',()=>stream.destroy());stream.pipe(res);
 }catch{res.writeHead(404).end();}
}).listen(port,'127.0.0.1',()=>console.log(`Nura review: http://127.0.0.1:${port}`));
