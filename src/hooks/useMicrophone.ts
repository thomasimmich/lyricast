import { data } from "autoprefixer";
import { useEffect, useState } from "react";

const useMicrophone = () => {
  const [, setAudioContext] = useState<AudioContext | null>(null);
  const [volume, setVolume] = useState<number>(0); // Change to volume
  // If pitch === -1 then its too quiet
  const [pitch, setPitch] = useState<number>(0);
  useEffect(() => {
    const getMicrophoneInput = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        const audioContext = new AudioContext();
        const microphone = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        microphone.connect(analyser);
        analyser.fftSize = 512;
        setAudioContext(audioContext);

        const volumeBuffer = new Uint8Array(analyser.fftSize);
        const pitchBuffer = new Float32Array(analyser.fftSize);
        
        const checkAudio = () => {
          analyser.getByteTimeDomainData(volumeBuffer);
          setVolume(calculateVolume(volumeBuffer));

          analyser.getFloatTimeDomainData(pitchBuffer);
          setPitch(calculatePitch(pitchBuffer, audioContext.sampleRate))

          requestAnimationFrame(checkAudio);
        };

        checkAudio();
      } catch (error) {
        console.error("Error accessing microphone", error);
      }
    };

    getMicrophoneInput();
  }, []);

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
function calculatePitch(buffer: Float32Array, sampleRate: number): number {
  // Perform a quick root-mean-square to see if we have enough signal
  let SIZE = buffer.length;
  let sumOfSquares = 0;
  for (let i = 0; i < SIZE; i++) {
    const val = buffer[i];
    sumOfSquares += val * val;
  }
  const rootMeanSquare = Math.sqrt(sumOfSquares / SIZE)
  if (rootMeanSquare < 0.01) {
    return -1;
  }

  // Find a range in the buffer where the values are below a given threshold.
  let r1 = 0;
  let r2 = SIZE - 1;
  const threshold = 0.2;

  // Walk up for r1
  for (let i = 0; i < SIZE / 2; i++) {
    if (Math.abs(buffer[i]) < threshold) {
      r1 = i;
      break;
    }
  }

  // Walk down for r2
  for (let i = 1; i < SIZE / 2; i++) {
    if (Math.abs(buffer[SIZE - i]) < threshold) {
      r2 = SIZE - i;
      break;
    }
  }

  // Trim the buffer to these ranges and update SIZE.
  buffer = buffer.slice(r1, r2);
  SIZE = buffer.length

  // Create a new array of the sums of offsets to do the autocorrelation
  const c = new Array(SIZE).fill(0);
  // For each potential offset, calculate the sum of each buffer value times its offset value
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE - i; j++) {
      c[i] = c[i] + buffer[j] * buffer[j+i]
    }
  }

  // Find the last index where that value is greater than the next one (the dip)
  let d = 0;
  while (c[d] > c[d+1]) {
    d++;
  }

  // Iterate from that index through the end and find the maximum sum
  let maxValue = -1;
  let maxIndex = -1;
  for (let i = d; i < SIZE; i++) {
    if (c[i] > maxValue) {
      maxValue = c[i];
      maxIndex = i;
    }
  }

  let T0 = maxIndex;

  // Not as sure about this part, don't @ me
  // From the original author:
  // interpolation is parabolic interpolation. It helps with precision. We suppose that a parabola pass through the
  // three points that comprise the peak. 'a' and 'b' are the unknowns from the linear equation system and b/(2a) is
  // the "error" in the abscissa. Well x1,x2,x3 should be y1,y2,y3 because they are the ordinates.
  const x1 = c[T0 - 1];
  const x2 = c[T0];
  const x3 = c[T0 + 1]

  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2
  if (a) {
    T0 = T0 - b / (2 * a);
  }

  return sampleRate/T0;
}
