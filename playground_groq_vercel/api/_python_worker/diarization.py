import sys
import librosa
import numpy as np

file_path = sys.argv[1]
y, sr = librosa.load(file_path, sr=None)
duration = librosa.get_duration(y=y, sr=sr)
print(f"Simulated diarization for file {file_path}: {duration:.2f} seconds, 2 speakers detected.")