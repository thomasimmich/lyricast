

import './App.css'
import useMicrophone from './hooks/useMicrophone';

function App() {
  const { volume } = useMicrophone();

  // Map volume to size, adjust the scale factor as needed
  const size = Math.min(100 + volume * 2, 200); // Example scaling, adjust as necessary

  return (
    <div className="App">
      <header className="App-header">
        <div
          style={{
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '50%',
            backgroundColor: `rgb(0, ${volume > 0 ? 255 : 0}, 0)`, // Green if there's volume, otherwise black
            transition: 'width 0.2s, height 0.2s, background-color 0.2s', // Smooth transitions for visual changes
          }}
        ></div>
      </header>
    </div>
  );
}

export default App
