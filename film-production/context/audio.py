"""Original 100BPM score and bespoke cues, locally generated non-cloned narration."""
from pathlib import Path
import numpy as np,soundfile as sf,json,subprocess,hashlib
from kokoro_onnx import Kokoro
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'public/context';CACHE=ROOT/'.artifacts/tts';CACHE.mkdir(parents=True,exist_ok=True)
SR=24000;D=54;N=SR*D;rng=np.random.default_rng(947)
k=Kokoro(str(Path.home()/'.cache/hyperframes/tts/models/kokoro-v1.0.onnx'),str(Path.home()/'.cache/hyperframes/tts/voices/voices-v1.0.bin'))
cues=[(.8,7,'Your watch records the signals. Nura helps you see how they fit together.'),(7.9,15.5,"Start with today's health score. Then look inside: sleep, activity, cardio fitness, and resting heart rate."),(16.5,23.6,'A single day is a snapshot. The twenty-eight-day view gives you a longer perspective.'),(24.6,32.4,'Open a workout to follow your heart rate, and see how long you spent in each intensity zone.'),(33.6,41.4,'Recovery compares readings with your own baseline. Sleep adds another part of the picture.'),(42.4,47.8,'Move through your history. Put a day beside the weeks that led up to it.'),(49,53.3,"Nura. See what's behind the number.")]
voice=np.zeros(N);timings=[]
for a,b,text in cues:
 speed=.88
 for trial in range(3):
  h=hashlib.sha256(json.dumps([text,'af_heart',speed,'context']).encode()).hexdigest();p=CACHE/(h+'.wav')
  if p.exists():v,sr=sf.read(p)
  else:v,sr=k.create(text,voice='af_heart',speed=speed,lang='en-us',sentence_pause=.3,clause_pause=.14);sf.write(p,v,sr)
  if len(v)/sr<=b-a:break
  speed*=len(v)/sr/(b-a)*1.02
 if speed>1.15 or len(v)/sr>b-a:raise RuntimeError('Rewrite cue rather than rush '+text)
 v=v*.61/max(.01,np.max(np.abs(v)));v[:100]*=np.linspace(0,1,100);v[-100:]*=np.linspace(1,0,100)
 pos=round(a*SR);voice[pos:pos+len(v)]+=v;timings.append({'start':a,'end':a+len(v)/sr,'text':text,'speed':speed});print(a,round(len(v)/sr,2),round(speed,3),flush=True)
# Licensed score: Vastness by Andrew Ev, Mixkit Stock Music Free License.
# Source is never published as standalone music. Only the finished film is distributed.
track=ROOT/'.artifacts/vastness.wav'
if not track.exists():
 subprocess.run(['curl','-fsSL','https://assets.mixkit.co/music/184/184.mp3','-o',str(ROOT/'.artifacts/vastness-andrew-ev.mp3')],check=True)
 subprocess.run(['ffmpeg','-y','-v','error','-i',str(ROOT/'.artifacts/vastness-andrew-ev.mp3'),'-ar',str(SR),'-ac','2',str(track)],check=True)
music,rs=sf.read(track);music=music[6*SR:(6+D)*SR];music=music*.28/max(.01,np.max(np.abs(music)))
fx=np.zeros((N,2));time=np.arange(N)/SR
# Each cut has one designed gesture; not a whoosh on every move.
def add(signal,at,gain=1,pan=0,target=fx):
 pos=round(at*SR)
 if pos<0:return
 n=min(len(signal),len(target)-pos)
 if n>0:target[pos:pos+n,0]+=signal[:n]*gain*np.sqrt((1-pan)/2);target[pos:pos+n,1]+=signal[:n]*gain*np.sqrt((1+pan)/2)
def note(midi,dur):
 t=np.arange(int(dur*SR))/SR;hz=440*2**((midi-69)/12);return np.sin(2*np.pi*hz*t)*(1-np.exp(-t/.01))*np.exp(-t/1.4)*np.clip((dur-t)/.3,0,1)
# Designed ascending brush and a restrained low transient at structural cuts.
for at in [7.5,16,24,33,42,48]:
 tt=np.arange(int(.65*SR))/SR;noise=rng.normal(0,1,len(tt));kernel=np.ones(32)/32;noise=np.convolve(noise,kernel,'same');env=np.sin(np.pi*tt/.65)**2
 add(noise*env,at-.55,.045,-.25,fx)
 tt=np.arange(int(.4*SR))/SR;add(np.sin(2*np.pi*62*tt)*np.exp(-tt*16),at,.035,0,fx)
# Opening and ending harmonics settle with the visual lens.
add(note(81,4),.45,.045,.2,fx);add(note(74,5),48.4,.055,-.2,fx);add(note(81,4.7),48.5,.025,.3,fx)
for delay,gain in [(.14,.22),(.27,.12),(.43,.08)]:
 shift=int(delay*SR);music[shift:,0]+=music[:-shift,1].copy()*gain;music[shift:,1]+=music[:-shift,0].copy()*gain
# Cue-aware ducking, original score is distributed only inside completed film.
gain=np.interp(time,[0,2.5,7.5,32.5,33.3,41.5,42.5,48,51,54],[.42,.72,1,1,.5,.5,1,1.2,1.2,1])
for q in timings:
 down=np.clip((time-(q['start']-.18))/.18,0,1);up=np.clip((time-q['end'])/.4,0,1);gain*=1-.56*np.minimum(down,1-up)
fade=np.clip(time/.7,0,1)*np.clip((D-time)/1.8,0,1)
mix=voice[:,None]+(music*gain[:,None]+fx)*fade[:,None]
sf.write(OUT/'premix.wav',mix,SR,subtype='FLOAT');sf.write(OUT/'voice.wav',voice,SR)
first=subprocess.run(['ffmpeg','-hide_banner','-i',str(OUT/'premix.wav'),'-af','loudnorm=I=-16:TP=-2:LRA=9:print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
m=json.loads(first.stderr[first.stderr.rfind('{'):first.stderr.rfind('}')+1]);norm=f'loudnorm=I=-16:TP=-2:LRA=9:measured_I={m["input_i"]}:measured_TP={m["input_tp"]}:measured_LRA={m["input_lra"]}:measured_thresh={m["input_thresh"]}:offset={m["target_offset"]}:linear=false'
subprocess.run(['ffmpeg','-y','-v','error','-i',str(OUT/'premix.wav'),'-af',norm,'-ar','48000',str(OUT/'mix.wav')],check=True)
(ROOT/'context/timings.json').write_text(json.dumps(timings,indent=2));(ROOT/'context/audio-measurement.json').write_text(json.dumps(m,indent=2))
def stamp(t):
 ms=round(t*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02}.{ms%1000:03}'
vtt='WEBVTT\n\n'+'\n\n'.join(f'{i+1}\n{stamp(q["start"])} --> {stamp(q["end"])}\n{q["text"]}' for i,q in enumerate(timings))+'\n'
(ROOT/'deliverables/nura-context/captions.vtt').write_text(vtt);(ROOT/'deliverables/nura-context/script.txt').write_text('\n\n'.join(x['text'] for x in timings)+'\n')
print('Score and mix completed',flush=True)
