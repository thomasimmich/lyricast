import librosa
import scipy.signal.windows
scipy.signal.hann = scipy.signal.windows.hann
import pyphen


y, sr = librosa.load('C:\\Users\\swnuk\\Downloads\\uschi-drums-and-vocals-vocals-A minor-131bpm-440hz.mp3')
tempo, beat_frames = librosa.beat.beat_track(y=y, sr=sr)

beats_per_measure = 4  # Ändern Sie dies je nach Musikstil
measures = [beat_frames[i:i+beats_per_measure] for i in range(0, len(beat_frames), beats_per_measure)]



print('Estimated tempo: {:.2f} beats per minute'.format(tempo))

# Convert the frame indices of beat events into timestamps
beat_times = librosa.frames_to_time(beat_frames, sr=sr)

dic = pyphen.Pyphen(lang='de')
print('start building syllables')
# Pfad zur Textdatei
file_path = "C:\\Users\\swnuk\\Downloads\\Du hast die Haare schoen.txt"

# Lesen Sie den Text aus der Datei
with open(file_path, 'r', encoding='utf-8') as file:
    text = file.read()

syllables = dic.inserted(text)

print(syllables)
num_syllables = syllables.count('-') + 1