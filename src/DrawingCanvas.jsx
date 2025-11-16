import React, { useRef, useEffect, useState } from 'react';

const CANVAS_SIZE = 280; // 28 pixels * 10 scale
const GRID_SIZE = 28;
const PIXEL_SIZE = CANVAS_SIZE / GRID_SIZE;
const BRUSH_SIZE = 2; // Number of pixels the brush affects

export default function DrawingCanvas({ onDrawingChange, clearTrigger }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [pixelData, setPixelData] = useState(() =>
    Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0))
  );

  // Clear canvas when clearTrigger changes
  useEffect(() => {
    const newData = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
    setPixelData(newData);
    drawCanvas(newData);
  }, [clearTrigger]);

  // Draw the canvas based on pixel data
  const drawCanvas = (data) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw pixels
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const value = data[y][x];
        if (value > 0) {
          const intensity = Math.floor(value);
          ctx.fillStyle = `rgb(${255 - intensity}, ${255 - intensity}, ${255 - intensity})`;
          ctx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
        }
      }
    }

    // Draw grid lines
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * PIXEL_SIZE, 0);
      ctx.lineTo(i * PIXEL_SIZE, CANVAS_SIZE);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * PIXEL_SIZE);
      ctx.lineTo(CANVAS_SIZE, i * PIXEL_SIZE);
      ctx.stroke();
    }
  };

  // Initial draw
  useEffect(() => {
    drawCanvas(pixelData);
  }, []);

  // Update canvas when pixel data changes
  useEffect(() => {
    drawCanvas(pixelData);
    onDrawingChange(pixelData);
  }, [pixelData]);

  const getPixelCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / PIXEL_SIZE);
    const y = Math.floor((e.clientY - rect.top) / PIXEL_SIZE);
    return { x, y };
  };

  const drawAtPosition = (x, y) => {
    if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) return;

    setPixelData(prevData => {
      const newData = prevData.map(row => [...row]);

      // Draw with brush size (creates smoother, thicker lines)
      for (let dy = -BRUSH_SIZE; dy <= BRUSH_SIZE; dy++) {
        for (let dx = -BRUSH_SIZE; dx <= BRUSH_SIZE; dx++) {
          const nx = x + dx;
          const ny = y + dy;

          if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE) {
            // Distance from center for smooth falloff
            const distance = Math.sqrt(dx * dx + dy * dy);
            const intensity = Math.max(0, 255 * (1 - distance / (BRUSH_SIZE + 1)));

            // Add to existing value (blend)
            newData[ny][nx] = Math.min(255, newData[ny][nx] + intensity * 0.8);
          }
        }
      }

      return newData;
    });
  };

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const { x, y } = getPixelCoordinates(e);
    drawAtPosition(x, y);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const { x, y } = getPixelCoordinates(e);
    drawAtPosition(x, y);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleMouseLeave = () => {
    setIsDrawing(false);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '10px'
    }}>
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{
          border: '2px solid #444',
          borderRadius: '8px',
          cursor: 'crosshair',
          backgroundColor: '#ffffff',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
        }}
      />
      <div style={{
        fontSize: '12px',
        color: '#aaa',
        textAlign: 'center'
      }}>
        Click and drag to draw a digit (0-9)
      </div>
    </div>
  );
}
