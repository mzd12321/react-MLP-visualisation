import React from 'react';

export default function ProbabilityChart({ probabilities, prediction }) {
  const getBarColor = (probability, index) => {
    const isPrediction = index === prediction;

    if (isPrediction) {
      return '#10b981'; // Green for prediction
    }

    if (probability > 0.5) {
      return '#f59e0b'; // Orange for high probability
    } else if (probability > 0.1) {
      return '#6366f1'; // Indigo for medium
    } else {
      return '#475569'; // Slate for low
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      padding: '20px',
      backgroundColor: '#2a2a2a',
      borderRadius: '12px',
      border: '2px solid #444',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
      height: 'fit-content',
      maxHeight: '100%'
    }}>
      <h3 style={{
        fontSize: '16px',
        fontWeight: 'bold',
        marginBottom: '10px',
        color: '#fff',
        textAlign: 'center'
      }}>
        Prediction Probabilities
      </h3>

      {probabilities && probabilities.map((prob, index) => {
        const percentage = (prob * 100).toFixed(1);
        const isPrediction = index === prediction;

        return (
          <div key={index} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '14px'
          }}>
            <div style={{
              width: '30px',
              fontWeight: isPrediction ? 'bold' : 'normal',
              color: isPrediction ? '#10b981' : '#ccc',
              fontSize: isPrediction ? '18px' : '14px'
            }}>
              {index}
            </div>

            <div style={{
              flex: 1,
              backgroundColor: '#1a1a1a',
              borderRadius: '4px',
              overflow: 'hidden',
              height: isPrediction ? '28px' : '24px',
              position: 'relative',
              border: isPrediction ? '2px solid #10b981' : '1px solid #444',
              transition: 'all 0.3s ease'
            }}>
              <div
                style={{
                  width: `${percentage}%`,
                  height: '100%',
                  backgroundColor: getBarColor(prob, index),
                  transition: 'width 0.3s ease, background-color 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingRight: '8px'
                }}
              >
                {percentage > 5 && (
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 'bold',
                    color: '#fff',
                    textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                  }}>
                    {percentage}%
                  </span>
                )}
              </div>
              {percentage <= 5 && percentage > 0 && (
                <div style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '11px',
                  color: '#888'
                }}>
                  {percentage}%
                </div>
              )}
            </div>
          </div>
        );
      })}

      {prediction !== null && prediction !== undefined && (
        <div style={{
          marginTop: '15px',
          padding: '12px',
          backgroundColor: '#10b98120',
          border: '2px solid #10b981',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '4px' }}>
            Predicted Digit
          </div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#10b981' }}>
            {prediction}
          </div>
          <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
            Confidence: {(probabilities[prediction] * 100).toFixed(1)}%
          </div>
        </div>
      )}
    </div>
  );
}
