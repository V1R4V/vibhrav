"""Measured cue synthesis and voice-ducked licensed score; no time-stretching."""
from pathlib import Path
import json,hashlib,sys,subprocess,os,urllib.request
import numpy as np,soundfile as sf
from kokoro_onnx import Kokoro
ROOT=Path(__file__).resolve().parents[1]
SPECS=json.loads((ROOT/'audio/narration.json').read_text())
CACHE=ROOT/'.artifacts/tts';CACHE.mkdir(exist_ok=True,parents=True)
SOURCE=Path(os.environ.get('FILM_MUSIC_DIR',ROOT/'.artifacts/music'));SOURCE.mkdir(exist_ok=True,parents=True)
TRACKS={'nura':175,'studyflow':623,'vyaya':371}
model=Path(os.environ.get('FILM_TTS_DIR',Path.home()/'.cache/hyperframes/tts'));k=Kokoro(str(model/'models/kokoro-v1.0.onnx'),str(model/'voices/voices-v1.0.bin'))
def stamp(t):
 ms=round(t*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02}.{ms%1000:03}'
for slug in sys.argv[1:] or SPECS:
 spec=SPECS[slug];sr=24000;total=spec['duration']*sr;voice=np.zeros(total,np.float32);timings=[]
 if not (SOURCE/spec['music']).exists():
  url={'nura':'https://assets.mixkit.co/music/preview/mixkit-digital-clouds-175.mp3','studyflow':'https://assets.mixkit.co/music/preview/mixkit-deep-urban-623.mp3','vyaya':'https://assets.mixkit.co/music/preview/mixkit-cat-walk-371.mp3'}[slug]
  (SOURCE/spec['music']).write_bytes(urllib.request.urlopen(url).read())
 for i,(at,end,text) in enumerate(spec['cues']):
  speed=.88
  for trial in range(3):
   key=hashlib.sha256(json.dumps([text,spec['voice'],speed]).encode()).hexdigest();p=CACHE/(key+'.wav')
   if p.exists():a,rs=sf.read(p,dtype='float32')
   else:
    a,rs=k.create(text,voice=spec['voice'],speed=speed,lang='en-us',sentence_pause=.30,clause_pause=.14);sf.write(p,a,rs,subtype='FLOAT')
   if len(a)/rs<=end-at:break
   speed=round(speed*len(a)/rs/(end-at)*1.015,3)
  if speed>1.15:raise RuntimeError(f'Rewrite rather than rush {slug} {i}: {speed}')
  if len(a)/rs>end-at+.01:raise RuntimeError(f'Cue overflow {slug} {i}')
  a*=min(1.8,.8/max(.001,np.max(np.abs(a))));n=120;a[:n]*=np.linspace(0,1,n);a[-n:]*=np.linspace(1,0,n)
  voice[round(at*sr):round(at*sr)+len(a)]+=a
  timings.append({'start':at,'end':at+len(a)/rs,'text':text,'speed':speed,'voice':spec['voice']})
  print(slug,i,round(len(a)/rs,2),speed,flush=True)
 out=ROOT/'public/audio';out.mkdir(exist_ok=True,parents=True);vp=out/(slug+'-voice.wav');sf.write(vp,voice,sr)
 # Bed with deliberate excerpt and a soft final cadence; exact cue-aware ducking.
 raw=CACHE/(slug+'-bed.wav')
 subprocess.run(['ffmpeg','-y','-v','error','-ss',str(spec['musicOffset']),'-i',str(SOURCE/spec['music']),'-t',str(spec['duration']),'-ar',str(sr),'-ac','2',str(raw)],check=True)
 music,_=sf.read(raw,dtype='float32',always_2d=True);music=music[:total];music=np.pad(music,((0,total-len(music)),(0,0)));music/=max(.01,np.max(np.abs(music)))
 timeline=np.arange(total)/sr;gain=np.full(total,.11)
 for q in timings:
  # Linear ramps avoid pumping. Voice has precedence, music stays restrained.
  down=np.clip((timeline-(q['start']-.22))/.22,0,1);up=np.clip((timeline-q['end'])/.32,0,1);env=np.minimum(down,1-up);gain*=1-.54*env
 gain*=np.clip(timeline/.6,0,1)*np.clip((spec['duration']-timeline)/1.4,0,1)
 mixed=np.repeat(voice[:,None],2,axis=1)+music*gain[:,None]
 clickfile=CACHE/'click.wav'
 subprocess.run(['ffmpeg','-y','-v','error','-i',str(ROOT/'public/sounds/click.ogg'),'-ar',str(sr),'-ac','2',str(clickfile)],check=True)
 click,_=sf.read(clickfile,dtype='float32',always_2d=True);click*=.055/max(.001,np.max(np.abs(click)))
 for moment in {'nura':[22.93,30.63],'studyflow':[12.5,24.15],'vyaya':[19.4,23.5,26]}[slug]:
  pos=round(moment*sr);mixed[pos:pos+len(click)]+=click
 premix=CACHE/(slug+'-premix.wav');sf.write(premix,mixed,sr,subtype='FLOAT')
 # Two-pass measured normalization; extra AAC headroom is intentional.
 first=subprocess.run(['ffmpeg','-hide_banner','-i',str(premix),'-af','loudnorm=I=-16:TP=-2:LRA=9:print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
 measured=json.loads(first.stderr[first.stderr.rfind('{'):first.stderr.rfind('}')+1])
 normalization=f'loudnorm=I=-16:TP=-2:LRA=9:measured_I={measured["input_i"]}:measured_TP={measured["input_tp"]}:measured_LRA={measured["input_lra"]}:measured_thresh={measured["input_thresh"]}:offset={measured["target_offset"]}:linear=false:print_format=json'
 log=subprocess.run(['ffmpeg','-y','-i',str(premix),'-af',normalization,'-ar','48000',str(out/(slug+'-mix.wav'))],capture_output=True,text=True,check=True)
 (ROOT/'audio'/f'{slug}-mix.log').write_text(first.stderr+'\nSECOND PASS\n'+log.stderr)
 (ROOT/'audio'/f'{slug}-timings.json').write_text(json.dumps(timings,indent=2))
 vtt='WEBVTT\n\n'+'\n\n'.join(f'{i+1}\n{stamp(q["start"])} --> {stamp(q["end"])}\n{q["text"]}' for i,q in enumerate(timings))+'\n'
 (ROOT/'deliverables'/slug).mkdir(exist_ok=True,parents=True)
 (ROOT/'deliverables'/slug/'captions.vtt').write_text(vtt)
 (ROOT/'deliverables'/slug/'script.txt').write_text('\n\n'.join(q['text'] for q in timings)+'\n')
