import { useEffect, useState } from 'react';

const useMicrophone = () => {
  const [, setAudioContext] = useState<AudioContext | null>(null);
  const [isAudioActive, setIsAudioActive] = useState<boolean>(false);

  useEffect(() => {
    const getMicrophoneInput = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        const audioContext = new AudioContext();
        const microphone = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        microphone.connect(analyser);
        analyser.fftSize = 2048;
        setAudioContext(audioContext);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const checkAudio = () => {
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          setIsAudioActive(sum > 0);
          requestAnimationFrame(checkAudio);
        };

        checkAudio();
      } catch (error) {
        console.error('Error accessing microphone', error);
      }
    };

    getMicrophoneInput();
  }, []);

  return { isAudioActive };
};

export default useMicrophone;
