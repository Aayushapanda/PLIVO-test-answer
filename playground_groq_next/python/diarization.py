#!/usr/bin/env python3
import sys, wave, json, os

if len(sys.argv) < 2:
    print(json.dumps({'error':'no file'}))
    sys.exit(0)

path = sys.argv[1]
if not os.path.exists(path):
    print(json.dumps({'error':'file not found'}))
    sys.exit(0)

try:
    wf = wave.open(path, 'rb')
    frames = wf.getnframes()
    rate = wf.getframerate()
    duration = frames / float(rate)
    wf.close()
except Exception:
    # fallback: unknown duration
    duration = 0.0

# simulate two speakers alternating every 5 seconds
segs = []
t = 0.0
speaker = 1
while t < duration:
    seg_end = min(duration, t + 5.0)
    segs.append({'speaker': f'speaker_{speaker}', 'start': round(t,2), 'end': round(seg_end,2)})
    t = seg_end
    speaker = 2 if speaker == 1 else 1

output = {'duration': round(duration,2), 'segments': segs}
print(json.dumps(output))
