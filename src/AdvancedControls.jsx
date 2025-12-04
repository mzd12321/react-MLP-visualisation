import React, { useState } from 'react';

export default function AdvancedControls({
  maxConnections,
  onMaxConnectionsChange,
  weakThreshold,
  onWeakThresholdChange,
  lineThickness,
  onLineThicknessChange,
  brushSize,
  onBrushSizeChange
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      right: '20px',
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      padding: '15px',
      borderRadius: '12px',
      border: '1px solid #444',
      fontSize: '13px',
      color: '#ccc',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
      minWidth: '280px',
      maxWidth: '320px',
      zIndex: 100
    }}>
      {/* Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '14px' }}>
          ⚙️ Erweiterte Einstellungen
        </div>
        <div style={{
          fontSize: '18px',
          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s ease'
        }}>
          ▼
        </div>
      </div>

      {/* Expandable Controls */}
      {isExpanded && (
        <div style={{
          marginTop: '15px',
          paddingTop: '15px',
          borderTop: '1px solid #444'
        }}>
          {/* Max Connections Slider */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#fff',
              fontSize: '12px'
            }}>
              Maximale Verbindungen pro Neuron: <strong>{maxConnections}</strong>
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={maxConnections}
              onChange={(e) => onMaxConnectionsChange(Number(e.target.value))}
              style={{
                width: '100%',
                cursor: 'pointer'
              }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '10px',
              color: '#888',
              marginTop: '4px'
            }}>
              <span>1</span>
              <span>20</span>
            </div>
          </div>

          {/* Weak Connection Threshold */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#fff',
              fontSize: '12px'
            }}>
              Schwache Verbindungen ausblenden: <strong>{weakThreshold.toFixed(2)}</strong>
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={weakThreshold}
              onChange={(e) => onWeakThresholdChange(Number(e.target.value))}
              style={{
                width: '100%',
                cursor: 'pointer'
              }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '10px',
              color: '#888',
              marginTop: '4px'
            }}>
              <span>0.00</span>
              <span>1.00</span>
            </div>
          </div>

          {/* Line Thickness */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#fff',
              fontSize: '12px'
            }}>
              Liniendicke: <strong>{lineThickness.toFixed(1)}</strong>
            </label>
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.5"
              value={lineThickness}
              onChange={(e) => onLineThicknessChange(Number(e.target.value))}
              style={{
                width: '100%',
                cursor: 'pointer'
              }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '10px',
              color: '#888',
              marginTop: '4px'
            }}>
              <span>0.5</span>
              <span>5.0</span>
            </div>
          </div>

          {/* Brush Size */}
          <div style={{ marginBottom: '10px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#fff',
              fontSize: '12px'
            }}>
              Pinselgröße: <strong>{brushSize}</strong>
            </label>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={brushSize}
              onChange={(e) => onBrushSizeChange(Number(e.target.value))}
              style={{
                width: '100%',
                cursor: 'pointer'
              }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '10px',
              color: '#888',
              marginTop: '4px'
            }}>
              <span>1</span>
              <span>5</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
