"""Extract source-keyed evidence; originals are only read."""
import json, pathlib, subprocess, hashlib
from PIL import Image, ImageDraw
ROOT = pathlib.Path(__file__).resolve().parents[2]
SOURCE = pathlib.Path('/Users/vibhravjha/Code/2Personal_Projects/Portfolios/Portfolio Website/.artifacts/brag-v2-2026-11-22')
OUT = ROOT / 'docs/product-films/old-film-evidence'
OUT.mkdir(parents=True, exist_ok=True)
manifest={}
for slug, folder in [('nura','explainer'),('studyflow','explainer'),('vyaya','film')]:
 p=SOURCE/slug/folder; video=p/'brag.mp4'
 probe=json.loads(subprocess.check_output(['ffprobe','-v','quiet','-show_format','-show_streams','-of','json',str(video)]))
 timeline=json.loads((p/'timeline.json').read_text()) if (p/'timeline.json').exists() else {'scenes':[{'id':k,'start':a,'end':b} for k,a,b in [('intro',0,4),('tracking',4.15,9.05),('flow',9.35,13.05),('entry',13.15,18.1),('lanes',18.3,23.05),('outro',23.25,26.1)]]}
 dur=min(float(probe['format']['duration']),float(next(s for s in probe['streams'] if s['codec_type']=='video').get('duration',probe['format']['duration'])))
 manifest[slug]={'path':str(video),'sha256':hashlib.sha256(video.read_bytes()).hexdigest(),'probe':probe,'timeline':timeline}
 times=sorted(set([0,.1,1,2,3,dur-.1]+[min(dur-.05,max(0,float(s['start'])+o)) for s in timeline['scenes'] for o in [-.3,-.1,0,.1,.3,.6,1.2,2]]))
 sheet=Image.new('RGB',(1920,295*((len(times)+3)//4)),'#171717');d=ImageDraw.Draw(sheet)
 for i,t in enumerate(times):
  f=OUT/f'{slug}-{t:05.2f}.jpg'
  if not f.exists(): subprocess.run(['ffmpeg','-y','-v','error','-ss',str(t),'-i',str(video),'-frames:v','1','-vf','scale=480:-1',str(f)],check=True)
  sheet.paste(Image.open(f),(i%4*480,i//4*295));d.text((i%4*480+10,i//4*295+274),f'{slug} {t:.2f}s',fill='white')
 # Split sheets to readable section-sized files.
 for y in range(0,sheet.height,1770):sheet.crop((0,y,1920,min(sheet.height,y+1770))).save(OUT/f'{slug}-transitions-{y//1770}.jpg')
 (OUT/f'{slug}-probe.json').write_text(json.dumps(probe,indent=2))
print('Extracted', {k:len(v['timeline']['scenes']) for k,v in manifest.items()})
(OUT/'originals.json').write_text(json.dumps(manifest,indent=2))
