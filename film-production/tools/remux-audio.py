"""Replace the final mix without recompressing or changing any picture packet."""
from pathlib import Path
import hashlib,json,subprocess,sys
ROOT=Path(__file__).resolve().parents[1];SPECS=json.loads((ROOT/'audio/narration.json').read_text())
log={}
def picture_hash(file):
 return subprocess.check_output(['ffmpeg','-v','error','-i',str(file),'-map','0:v:0','-c','copy','-f','hash','-hash','sha256','-'],text=True).strip()
for slug in sys.argv[1:] or SPECS:
 folder=ROOT/'deliverables'/slug;master=folder/'master.mp4';web=ROOT.parent/f'public/cinematic/films/{slug}-{SPECS[slug]["duration"]}-v3.mp4'
 log[slug]=[]
 for file in [master,web]:
  if not file.exists():continue
  before=picture_hash(file);temp=file.with_name(file.stem+'-audio-final.mp4')
  subprocess.run(['ffmpeg','-y','-v','error','-i',str(file),'-i',str(ROOT/f'public/audio/{slug}-mix.wav'),'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','320k' if file==master else '192k','-shortest','-movflags','+faststart',str(temp)],check=True)
  assert picture_hash(temp)==before,'Picture packets changed';temp.replace(file)
  log[slug].append({'file':str(file.relative_to(ROOT.parent)),'picturePacketsSHA256':before,'pictureUnchanged':True})
 print(slug,'remuxed',flush=True)
(ROOT/'qa/audio-remux.json').write_text(json.dumps(log,indent=2))
