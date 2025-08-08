import sys
from resemblyzer import preprocess_wav, VoiceEncoder
from pathlib import Path
import numpy as np
import whisper

wav_path = Path(sys.argv[1])
model = whisper.load_model("small")
result = model.transcribe(str(wav_path))

# Dummy diarization for 2 speakers
wav = preprocess_wav(wav_path)
encoder = VoiceEncoder()
_, cont_embeds, _ = encoder.embed_utterance(wav, return_partials=True)
split_point = len(cont_embeds)//2
print("Speaker 1:", result['text'][:len(result['text'])//2])
print("Speaker 2:", result['text'][len(result['text'])//2:])
