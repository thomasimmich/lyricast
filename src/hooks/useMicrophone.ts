import { useState } from "react";

const useMicrophone = () => {
  const [, setAudioContext] = useState<AudioContext | null>(null);
  const [volume, setVolume] = useState<number>(1); // Change to volume
  // If pitch === -1 then its too quiet
  const [pitch, setPitch] = useState<number>(0);
  // useEffect(() => {
  //   const getMicrophoneInput = async () => {
  //     try {
  //       const stream = await navigator.mediaDevices.getUserMedia({
  //         audio: true,
  //         video: false,
  //       });
  //       const audioContext = new AudioContext();
  //       const microphone = audioContext.createMediaStreamSource(stream);
  //       const analyser = audioContext.createAnalyser();
  //       microphone.connect(analyser);
  //       analyser.fftSize = 512;
  //       setAudioContext(audioContext);

  //       const volumeBuffer = new Uint8Array(analyser.fftSize);
  //       const pitchBuffer = new Float32Array(analyser.fftSize);

  //       const checkAudio = () => {
  //         analyser.getByteTimeDomainData(volumeBuffer);
  //         setVolume(calculateVolume(volumeBuffer));

  //         analyser.getFloatTimeDomainData(pitchBuffer);
  //         setPitch(calculatePitch(pitchBuffer, audioContext.sampleRate));

  //         requestAnimationFrame(checkAudio);
  //       };

  //       checkAudio();
  //     } catch (error) {
  //       console.error("Error accessing microphone", error);
  //     }
  //   };

  //   getMicrophoneInput();
  // }, []);

  return { volume, pitch };
};

export default useMicrophone;

function calculateVolume(dataArray: Uint8Array): number {
  let sum = 0;
  for (let i = 0; i < dataArray.length; i++) {
    sum += (dataArray[i] - 128) * (dataArray[i] - 128); // Subtract 128 for unsigned 8-bit array
  }
  const average = Math.sqrt(sum / dataArray.length);
  return average;
}

// From https://alexanderell.is/posts/tuner/ currently not working
// Must be called on analyser.getFloatTimeDomainData and audioContext.sampleRate
// From https://github.com/cwilso/PitchDetect/pull/23
// code optimized by ChatGPT 4o
function calculatePitch(buffer: Float32Array, sampleRate: number): number {
  const SIZE = buffer.length;
  const sumOfSquares = buffer.reduce((sum, val) => sum + val * val, 0);
  const rootMeanSquare = Math.sqrt(sumOfSquares / SIZE);

  if (rootMeanSquare < 0.005) {
    // Adjusted threshold
    return -1;
  }

  let r1 = 0;
  let r2 = SIZE - 1;
  const threshold = 0.1; // Adjusted threshold

  for (let i = 0; i < SIZE / 2; i++) {
    if (Math.abs(buffer[i]) < threshold) {
      r1 = i;
      break;
    }
  }

  for (let i = 1; i < SIZE / 2; i++) {
    if (Math.abs(buffer[SIZE - i]) < threshold) {
      r2 = SIZE - i;
      break;
    }
  }

  buffer = buffer.slice(r1, r2);
  const trimmedSize = buffer.length;
  const c = new Array(trimmedSize).fill(0);

  for (let i = 0; i < trimmedSize; i++) {
    for (let j = 0; j < trimmedSize - i; j++) {
      c[i] += buffer[j] * buffer[j + i];
    }
  }

  let d = 0;
  while (c[d] > c[d + 1]) d++;

  let maxValue = -1;
  let maxIndex = -1;
  for (let i = d; i < trimmedSize; i++) {
    if (c[i] > maxValue) {
      maxValue = c[i];
      maxIndex = i;
    }
  }

  if (maxIndex <= 0) {
    return -1; // Handle invalid results
  }

  let T0 = maxIndex;
  const x1 = c[T0 - 1] || 0;
  const x2 = c[T0];
  const x3 = c[T0 + 1] || 0;

  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;

  if (a) {
    T0 = T0 - b / (2 * a);
  }

  return sampleRate / T0;
}
