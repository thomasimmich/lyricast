# Lyrics Analyser

## Overview

The Lyrics Analyser is a powerful tool designed to extract lyrics from YouTube videos, split them into syllables, and map them to the beat of the song. It achieves this by downloading the audio tracks from YouTube videos, isolating the vocals, and utilizing a voice-to-text program to transcribe the lyrics.

## Features

- **YouTube Video to Audio**: Extracts and downloads audio from YouTube videos.
- **Voice Isolation**: Utilizes advanced techniques to isolate the vocals from the audio track, ensuring accurate transcription of the lyrics.
- **Text Transcription**: Converts the isolated vocals into text using a reliable voice-to-text program, enabling easy processing and analysis of the lyrics.
- **Syllable Splitting**: Breaks down the lyrics into syllables, allowing for more granular analysis and insights into the rhythm and structure of the lyrics.
- **Beat Mapping**: Maps the syllables of the lyrics to the beat of the song, providing a synchronized representation of the lyrics with the music.

## Installation

### Requirements

This tool uses spleeter-web https://github.com/JeffreyCA/spleeter-web?tab=readme-ov-file    
Please follow the steps to run the docker images. This enables our server to access the api

``` bash
git clone https://github.com/JeffreyCA/spleeter-web.git
cd spleeter-web
docker-compose -f docker-compose.yml -f docker-compose.prod.yml -f docker-compose.prod.selfhost.yml up
```
Downloading the docker images may take a while.

# Python Script for Syllable Distribution

## Requirements

To run this script, you need Python 3 and the following Python libraries:

- librosa
- scipy
- pyphen

You can install these libraries with pip, the package manager for Python. Open the terminal in Visual Studio Code and run the following commands to install the libraries:

``` bash
pip install librosa
pip install scipy==1.4.1
pip install pyphen
```

Please note that there is a known issue with the latest version of scipy (1.5.0 and above) that causes the script to not work correctly. To avoid this issue, install scipy version 1.4.1 as shown in the above command.

The script reads an audio file and a text file, detects the beats in the audio file, splits the text into syllables, and distributes the syllables across the beats. The result is a list of syllables and their associated beat times, which is output to the console.

### Setup the server

1. Clone the repository from GitHub:
Check out the correct branch

```bash
git clone https://github.com/thomasimmich/lyricast.git
```
Check out the corresponding branch.
Open the server.sln file with visual studio professional 2022.
Make sure that the Docker containers (spleeter-web) are running and run the lyrics analyser.
