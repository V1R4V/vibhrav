"""Decode exact timeline samples into labeled contact and transition sheets."""
import pathlib,json,subprocess,sys
from PIL import Image,ImageDraw
ROOT=pathlib.Path(__file__).resolve().parents[1]
slug=sys.argv[1];video=pathlib.Path(sys.argv[2]);tag=sys.argv[3] if len(sys.argv)>3 else 'final'
trans={'nura':[4,10,16,21,22.93,25.33,28,30.63,34,37.2,41], 'studyflow':[4,10,12.5,15,16.5,18,24,24.4,31,34.5,38], 'vyaya':[4,10,12,15,18,19.4,21,23.5,26,29]}
OUT=ROOT/'qa'/slug/tag;OUT.mkdir(exist_ok=True,parents=True)
probe=json.loads(subprocess.check_output(['ffprobe','-v','quiet','-show_format','-show_streams','-of','json',str(video)]));dur=float(probe['format']['duration'])
for mode,times,cols in [('survey',sorted(set([0,.1,1,2]+list(range(3,int(dur),3))+[dur-.1])),4),('transitions', sorted(set(max(0,min(dur-.1,t+o)) for t in trans[slug] for o in [-.3,-.1,0,.1,.3,.6,1.])),5)]:
 tilew=480;tileh=295;rows=(len(times)+cols-1)//cols;sheet=Image.new('RGB',(cols*tilew,rows*tileh),'#202020');d=ImageDraw.Draw(sheet)
 for i,t in enumerate(times):
  f=OUT/f'{mode}-{t:06.2f}.png'
  subprocess.run(['ffmpeg','-y','-v','error','-ss',str(t),'-i',str(video),'-frames:v','1','-vf','scale=480:-1',str(f)],check=True)
  sheet.paste(Image.open(f),(i%cols*tilew,i//cols*tileh));d.text((i%cols*tilew+10,i//cols*tileh+275),f'{slug} {t:.2f}s',fill='white')
 for y in range(0,sheet.height,tileh*5):sheet.crop((0,y,sheet.width,min(sheet.height,y+tileh*5))).save(OUT/f'{mode}-sheet-{y//(tileh*5)}.jpg',quality=93)
(OUT/'probe.json').write_text(json.dumps(probe,indent=2));print(str(OUT))
