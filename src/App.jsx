import React, { useState, useEffect, useCallback, useRef } from 'react';
import DrawingCanvas from './DrawingCanvas';
import ProbabilityChart from './ProbabilityChart';
import NetworkVisualization3D from './NetworkVisualization3D';
import { initializeWeights, forwardPass } from './neuralNetwork';

function App() {
  const [weights] = useState(() => initializeWeights());
  const [networkState, setNetworkState] = useState(null);
  const [clearTrigger, setClearTrigger] = useState(0);
  const debounceTimer = useRef(null);

  // Handle drawing changes with debouncing
  const handleDrawingChange = useCallback((pixelData) => {
    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer for debounced update
    debounceTimer.current = setTimeout(() => {
      // Check if there's any drawing
      const hasDrawing = pixelData.some(row => row.some(pixel => pixel > 0));

      if (hasDrawing) {
        // Perform forward pass
        const result = forwardPass(pixelData, weights);
        setNetworkState(result);
      } else {
        // Clear network state if canvas is empty
        setNetworkState(null);
      }
    }, 50); // 50ms debounce
  }, [weights]);

  // Handle clear button
  const handleClear = () => {
    setClearTrigger(prev => prev + 1);
    setNetworkState(null);
  };

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#1a1a1a',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        backgroundColor: '#2a2a2a',
        borderBottom: '2px solid #444',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          marginBottom: '8px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          MNIST Neural Network Visualizer
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#aaa',
          marginBottom: '5px'
        }}>
          Interactive 3D visualization of a Multi-Layer Perceptron processing handwritten digits
        </p>
        <p style={{
          fontSize: '12px',
          color: '#888',
          fontFamily: 'monospace'
        }}>
          Architecture: 784 → 64 (ReLU) → 32 (ReLU) → 10 (Softmax)
        </p>
      </div>

      {/* Top Section: Canvas and Chart */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        padding: '20px',
        height: '45%',
        minHeight: '350px'
      }}>
        {/* Left: Drawing Canvas */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#2a2a2a',
          borderRadius: '12px',
          padding: '20px',
          border: '2px solid #444',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '15px',
            color: '#fff'
          }}>
            Draw a Digit (0-9)
          </h2>
          <DrawingCanvas
            onDrawingChange={handleDrawingChange}
            clearTrigger={clearTrigger}
          />
          <button
            onClick={handleClear}
            style={{
              marginTop: '15px',
              padding: '10px 24px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#dc2626';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#ef4444';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
            }}
          >
            Clear Canvas
          </button>
        </div>

        {/* Right: Probability Chart */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#2a2a2a',
          borderRadius: '12px',
          padding: '20px',
          border: '2px solid #444',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
          overflow: 'auto'
        }}>
          {networkState ? (
            <ProbabilityChart
              probabilities={networkState.probabilities}
              prediction={networkState.prediction}
            />
          ) : (
            <div style={{
              textAlign: 'center',
              color: '#666',
              padding: '40px'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>✏️</div>
              <p style={{ fontSize: '16px' }}>Draw a digit to see predictions</p>
              <p style={{ fontSize: '12px', marginTop: '10px', color: '#555' }}>
                The network will analyze your drawing in real-time
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section: 3D Network Visualization */}
      <div style={{
        flex: 1,
        padding: '0 20px 20px 20px',
        minHeight: '400px'
      }}>
        <div style={{
          height: '100%',
          backgroundColor: '#2a2a2a',
          borderRadius: '12px',
          border: '2px solid #444',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: '15px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: '10px 20px',
            borderRadius: '8px',
            border: '1px solid #444'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#fff',
              textAlign: 'center'
            }}>
              3D Neural Network Visualization
            </h3>
            <p style={{
              fontSize: '11px',
              color: '#aaa',
              textAlign: 'center',
              marginTop: '4px'
            }}>
              {networkState
                ? 'Neural network is processing your drawing'
                : 'Waiting for input...'}
            </p>
          </div>
          <NetworkVisualization3D
            networkState={networkState}
            weights={weights}
          />
        </div>
      </div>

      {/* Instructions Overlay */}
      <div style={{
        position: 'absolute',
        top: '100px',
        right: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: '15px',
        borderRadius: '8px',
        border: '1px solid #444',
        maxWidth: '250px',
        fontSize: '12px',
        color: '#ccc',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '10px', color: '#fff', fontSize: '14px' }}>
          ℹ️ How to Use
        </div>
        <ul style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
          <li>Draw a digit (0-9) on the canvas</li>
          <li>Watch the network process in real-time</li>
          <li>View activations in the 3D visualization</li>
          <li>Check prediction probabilities</li>
          <li>Rotate/pan/zoom the 3D view</li>
        </ul>
        <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #444', fontSize: '11px', color: '#888' }}>
          <strong>Note:</strong> This uses simulated pre-trained weights for demonstration purposes.
        </div>
      </div>
    </div>
  );
}

export default App;
