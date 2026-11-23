"""Create delivery files only from a reviewed master. Originals are left intact."""
from pathlib import Path
import json, subprocess, sys, textwrap
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
WEB=ROOT.parent/'public/cinematic/films'
SPECS=json.loads((ROOT/'audio/narration.json').read_text())
for slug in sys.argv[1:] or SPECS:
    spec=SPECS[slug];folder=ROOT/'deliverables'/slug;master=folder/'master.mp4'
    target=WEB/f'{slug}-{spec["duration"]}-v3.mp4'
    subprocess.run(['ffmpeg','-y','-v','error','-i',str(master),'-c:v','libx264','-preset','slow','-crf','20','-threads','2','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-movflags','+faststart',str(target)],check=True)
    poster=folder/'poster.png'
    subprocess.run(['ffmpeg','-y','-v','error','-ss','2','-i',str(master),'-frames:v','1',str(poster)],check=True)
    Image.open(poster).save(WEB/f'{slug}-v3-poster.webp',quality=90,method=6)
    vtt=(folder/'captions.vtt').read_text()
    vtt='\n'.join('\n'.join(textwrap.wrap(line,width=64,break_long_words=False,break_on_hyphens=False)) if line and not line.isnumeric() and '-->' not in line and line!='WEBVTT' else line for line in vtt.splitlines())+'\n'
    (WEB/f'{slug}-v3.vtt').write_text(vtt)
    print(slug,target.stat().st_size,flush=True)
