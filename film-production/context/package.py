"""Package only the reviewed film and its editable composition; keep music stems private."""
from pathlib import Path
import json,shutil,zipfile,hashlib,sys
ROOT=Path(__file__).resolve().parents[2]
SOURCE=ROOT/'film-production';FILM=SOURCE/'deliverables/nura-context';DOC=ROOT/'docs/product-films/nura-context'
DEST=Path(sys.argv[1]).expanduser().resolve();DEST.mkdir(parents=True,exist_ok=True)
shutil.copy2(SOURCE/'context/review.html',FILM/'index.html')
files=['Nura-Behind-the-Number-1080p.mp4','Nura-Behind-the-Number-Web.mp4','poster.jpg','captions.vtt','captions.srt','script.txt','index.html']
shutil.copy2(FILM/'Nura-Behind-the-Number-1080p-qa/survey.jpg',DEST/'contact-sheet.jpg')
for name in files:shutil.copy2(FILM/name,DEST/name)
for name in ['qa.md','treatment.md','licenses.md','asset-manifest.json','technical-results.json']:
 if (DOC/name).exists():shutil.copy2(DOC/name,DEST/name)
standalone='''import {Composition,delayRender,continueRender,cancelRender,staticFile} from 'remotion';
import {loadFont} from '@remotion/fonts';
import {NuraContext} from './NuraContext';
const handle=delayRender('Load Nura typography');
loadFont({family:'Inter',url:staticFile('brand/inter.ttf'),weight:'100 900'}).then(()=>continueRender(handle)).catch(cancelRender);
export const RemotionRoot=()=> <Composition id="NuraContext" component={NuraContext} width={1920} height={1080} fps={30} durationInFrames={1620}/>;
'''
readme='''# Nura — Behind the number, editable source

This archive contains only this film, with a standalone composition root.

1. Extract the archive. From film-production/remotion, run npm ci --ignore-scripts.
2. Recover the combined soundtrack from the supplied completed master:
   ffmpeg -i /absolute/path/to/Nura-Behind-the-Number-1080p.mp4 -vn -ar 48000 ../public/context/mix.wav
3. Run npm run dev to open Studio, or:
   npx remotion render src/index.ts NuraContext ../../Nura-Edit.mp4 --gl=angle --concurrency=3 --crf=15

The soundtrack is licensed for use within the film. Do not redistribute music-only files. See docs/product-films/nura-context/licenses.md. Source records are fictional and the displayed calculations originate in Nura's actual engine. These graphics illustrate those records; they are not fabricated application screens.
'''
editable=DEST/'Nura-Editable-Source.zip'
with zipfile.ZipFile(editable,'w',zipfile.ZIP_DEFLATED,compresslevel=7) as z:
 z.writestr('README.md',readme)
 for name in ['package.json','package-lock.json','tsconfig.json','remotion.config.ts','eslint.config.mjs']:
  p=SOURCE/'remotion'/name
  if p.exists():z.write(p,'film-production/remotion/'+name)
 for name in ['index.ts','ContextWorld.tsx','NuraContext.tsx','context-data.json']:z.write(SOURCE/'remotion/src'/name,'film-production/remotion/src/'+name)
 z.writestr('film-production/remotion/src/Root.tsx',standalone)
 for name in ['inter.ttf','inter-OFL.txt','nura-mark.svg']:z.write(SOURCE/'public/brand'/name,'film-production/public/brand/'+name)
 z.write(SOURCE/'public/context/studio_small_09_1k.hdr','film-production/public/context/studio_small_09_1k.hdr')
 for name in ['audio.py','export-data.mts','validate.mjs','inspect-film.py','preview.mjs','review-server.mjs','review.html','timings.json','audio-measurement.json']:
  z.write(SOURCE/'context'/name,'film-production/context/'+name)
 for p in DOC.rglob('*'):
  if p.is_file():z.write(p,'docs/product-films/nura-context/'+str(p.relative_to(DOC)))
manifest={p.name:{'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in DEST.iterdir() if p.is_file() and p.name not in ['delivery-manifest.json','Nura-Behind-the-Number-Delivery.zip']}
(DEST/'delivery-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
with zipfile.ZipFile(DEST/'Nura-Behind-the-Number-Delivery.zip','w',zipfile.ZIP_STORED) as z:
 for p in DEST.iterdir():
  if p.is_file() and p.suffix=='.zip' and p.name!='Nura-Editable-Source.zip':continue
  if p.is_file():z.write(p,p.name)
print(DEST)
print(json.dumps({p.name:p.stat().st_size for p in DEST.iterdir() if p.is_file()},indent=2))
