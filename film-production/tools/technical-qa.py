"""Decode release exports, measure audio, and validate timed captions."""
import hashlib,json,pathlib,re,subprocess,sys
ROOT=pathlib.Path(__file__).resolve().parents[1]
WEB=ROOT.parent/'public/cinematic/films'
SPECS=json.loads((ROOT/'audio/narration.json').read_text())
OUT=ROOT/'qa/technical';OUT.mkdir(parents=True,exist_ok=True)
report={}
for slug in sys.argv[1:] or SPECS:
    spec=SPECS[slug];file=WEB/f'{slug}-{spec["duration"]}-v3.mp4'
    probe=json.loads(subprocess.check_output(['ffprobe','-v','quiet','-show_format','-show_streams','-of','json',str(file)]))
    video=next(s for s in probe['streams'] if s['codec_type']=='video');audio=next(s for s in probe['streams'] if s['codec_type']=='audio')
    assert (video['width'],video['height'],video['r_frame_rate'],video['pix_fmt'])==(1920,1080,'30/1','yuv420p')
    assert int(video['nb_frames'])==spec['duration']*30
    assert abs(float(video['duration'])-spec['duration'])<.04
    assert abs(float(audio['duration'])-float(video['duration']))<.05
    vtt=(WEB/f'{slug}-v3.vtt').read_text();blocks=vtt.strip().split('\n\n')[1:]
    timings=json.loads((ROOT/f'audio/{slug}-timings.json').read_text());assert len(blocks)==len(timings)
    def seconds(stamp):
        h,m,s=map(float,stamp.split(':'));return h*3600+m*60+s
    previous=0
    for block,cue in zip(blocks,timings):
        lines=block.splitlines();start,end=map(seconds,lines[1].split(' --> '))
        assert previous<=start<end<=spec['duration'];previous=end
        assert abs(start-cue['start'])<.002 and abs(end-cue['end'])<.002
        assert ' '.join(lines[2:])==cue['text']
    decoded=subprocess.run(['ffmpeg','-hide_banner','-xerror','-threads','2','-i',str(file),'-vf','blackdetect=d=0.1:pix_th=0.02:pic_th=0.999','-af','loudnorm=I=-16:TP=-1.5:LRA=9:print_format=json','-f','null','-'],text=True,capture_output=True,check=True)
    (OUT/f'{slug}-decode.log').write_text(decoded.stderr)
    assert 'black_start:' not in decoded.stderr,'Unexpected black interval'
    loudness=json.loads(decoded.stderr[decoded.stderr.rfind('{'):decoded.stderr.rfind('}')+1])
    assert -17<=float(loudness['input_i'])<=-15
    assert float(loudness['input_tp'])<=-1.0,'AAC true peak too high'
    report[slug]={'passed':True,'bytes':file.stat().st_size,'sha256':hashlib.sha256(file.read_bytes()).hexdigest(),'video':video,'audio':audio,'captionCues':len(timings),'loudness':loudness,'fullDecode':'passed, no black intervals >=100ms','limitations':'Automated playback/metrics and decoded-frame review do not substitute for human full-film listening.'}
    (OUT/'report.json').write_text(json.dumps(report,indent=2));print(slug,'PASS',loudness['input_i'],loudness['input_tp'],flush=True)
