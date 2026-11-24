"""Extract exact frames from the rendered film; never claim playback from a contact sheet."""
from pathlib import Path
import subprocess,json,sys
from PIL import Image,ImageDraw
video=Path(sys.argv[1]).resolve();out=video.parent/(video.stem+'-qa');out.mkdir(exist_ok=True)
probe=json.loads(subprocess.check_output(['ffprobe','-v','quiet','-show_format','-show_streams','-of','json',str(video)]));(out/'probe.json').write_text(json.dumps(probe,indent=2))
sets={'survey':sorted(set([0,.4,1,2,3,5,7,9,12,15,17,19,21,23,25,27,29,31,32,34,36,38,40,41,43,45,47,49,51,53,53.96]))}
for at in [7.5,16,24,28.5,33,42,46.2,48]:sets[f'cut-{at}']=[at+o for o in [-.4,-.2,-.1,0,.1,.2,.4,.7]]
for name,times in sets.items():
 cols=4;w=480;h=294;sheet=Image.new('RGB',(cols*w,((len(times)+cols-1)//cols)*h),'#101d17');draw=ImageDraw.Draw(sheet)
 for i,t in enumerate(times):
  frame=out/f'{name}-{t:05.2f}.png';subprocess.run(['ffmpeg','-y','-v','error','-ss',str(t),'-i',str(video),'-frames:v','1',str(frame)],check=True)
  im=Image.open(frame);im.thumbnail((w,270));x=i%cols*w;y=i//cols*h;sheet.paste(im,(x,y));draw.text((x+12,y+274),f'{t:.2f}s',fill='#ecf0e1')
 sheet.save(out/f'{name}.jpg',quality=94)
print(out)
