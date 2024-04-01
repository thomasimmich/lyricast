

import './App.css'
import useMicrophone from './hooks/useMicrophone';

function App() {
  const { isAudioActive } = useMicrophone();

  return (
    <div className="App">
      <header className="App-header">
        <div
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundColor: isAudioActive ? 'green' : 'red',
          }}
        ></div>
      </header>
    </div>
  );
}

export default App
