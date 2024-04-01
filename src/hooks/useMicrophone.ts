import { useEffect, useState } from 'react';

const useMicrophone = () => {
  const [, setAudioContext] = useState<AudioContext | null>(null);
  const [volume, setVolume] = useState<number>(0); // Change to volume

  useEffect(() => {
    const getMicrophoneInput = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        const audioContext = new AudioContext();
        const microphone = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        microphone.connect(analyser);
        analyser.fftSize = 512;
        setAudioContext(audioContext);

        const dataArray = new Uint8Array(analyser.fftSize);
        const checkAudio = () => {
          analyser.getByteTimeDomainData(dataArray);
          
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += (dataArray[i] - 128) * (dataArray[i] - 128); // Subtract 128 for unsigned 8-bit array
          }
          const average = Math.sqrt(sum / dataArray.length);
          setVolume(average);

          requestAnimationFrame(checkAudio);
        };

        checkAudio();
      } catch (error) {
        console.error('Error accessing microphone', error);
      }
    };

    getMicrophoneInput();
  }, []);

  return { volume };
};

export default useMicrophone;
