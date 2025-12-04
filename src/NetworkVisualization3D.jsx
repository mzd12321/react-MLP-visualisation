import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { getTopConnections, normalizeActivations } from './neuralNetwork';

// Color mapping for activations (blue to red gradient)
function getActivationColor(normalizedValue) {
  // normalizedValue is between 0 and 1
  // 0 = dark blue (low activation)
  // 1 = bright coral/red (high activation)

  const t = normalizedValue;

  // Create a color gradient: dark blue -> cyan -> yellow -> orange -> red
  let r, g, b;

  if (t < 0.25) {
    // Dark blue to cyan
    const localT = t / 0.25;
    r = 0.1 + localT * 0.1;
    g = 0.2 + localT * 0.5;
    b = 0.5 + localT * 0.5;
  } else if (t < 0.5) {
    // Cyan to green/yellow
    const localT = (t - 0.25) / 0.25;
    r = 0.2 + localT * 0.6;
    g = 0.7 + localT * 0.2;
    b = 1.0 - localT * 0.5;
  } else if (t < 0.75) {
    // Yellow to orange
    const localT = (t - 0.5) / 0.25;
    r = 0.8 + localT * 0.2;
    g = 0.9 - localT * 0.4;
    b = 0.5 - localT * 0.4;
  } else {
    // Orange to red/coral
    const localT = (t - 0.75) / 0.25;
    r = 1.0;
    g = 0.5 - localT * 0.2;
    b = 0.1 - localT * 0.05;
  }

  return new THREE.Color(r, g, b);
}

// Color mapping for weights
function getWeightColor(weight) {
  const absWeight = Math.abs(weight);
  const normalized = Math.min(absWeight, 1.0);

  if (weight > 0) {
    // Positive weights: yellow to orange to red
    return new THREE.Color(1, 1 - normalized * 0.5, 0.1);
  } else {
    // Negative weights: cyan to blue
    return new THREE.Color(0.1, 0.5 + normalized * 0.5, 1);
  }
}

// Single neuron component
function Neuron({ position, activation, isActive }) {
  const meshRef = useRef();
  const normalizedActivation = Math.max(0, Math.min(1, activation));
  const color = getActivationColor(normalizedActivation);

  const scale = isActive ? 1 + normalizedActivation * 0.3 : 0.8;

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={isActive ? normalizedActivation * 0.5 : 0.1}
        metalness={0.3}
        roughness={0.4}
      />
    </mesh>
  );
}

// Connection line between neurons
function Connection({ start, end, weight, opacity = 0.6, lineThickness = 1 }) {
  const points = useMemo(() => {
    return [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  }, [start, end]);

  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }, [points]);

  const color = getWeightColor(weight);
  const lineWidth = Math.min(Math.abs(weight) * 3 * lineThickness, 2 * lineThickness);

  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial
        color={color}
        linewidth={lineWidth}
        transparent
        opacity={opacity * Math.min(Math.abs(weight), 1)}
      />
    </line>
  );
}

// Layer of neurons
function NeuronLayer({ neurons, activations, position, label, layerIndex }) {
  const positions = useMemo(() => {
    const count = neurons;
    const positions = [];

    // Arrange neurons in a grid pattern
    const cols = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / cols);
    const spacing = 0.3;

    for (let i = 0; i < count; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = position[0];
      const y = position[1] + (row - rows / 2) * spacing;
      const z = position[2] + (col - cols / 2) * spacing;
      positions.push([x, y, z]);
    }

    return positions;
  }, [neurons, position]);

  const normalizedActivations = useMemo(() => {
    if (!activations || activations.length === 0) {
      return new Array(neurons).fill(0);
    }
    return normalizeActivations(activations);
  }, [activations, neurons]);

  const hasActivations = activations && activations.some(a => a > 0);

  return (
    <group>
      {positions.map((pos, i) => (
        <Neuron
          key={`${layerIndex}-${i}`}
          position={pos}
          activation={normalizedActivations[i] || 0}
          isActive={hasActivations}
        />
      ))}
      <Text
        position={[position[0], position[1] - 3, position[2]]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}

// Network connections between two layers
function LayerConnections({ sourcePositions, targetPositions, connections, lineThickness }) {
  if (!connections || connections.length === 0) return null;

  return (
    <group>
      {connections.map((conn, i) => (
        <Connection
          key={i}
          start={sourcePositions[conn.source]}
          end={targetPositions[conn.target]}
          weight={conn.weight}
          opacity={0.3}
          lineThickness={lineThickness}
        />
      ))}
    </group>
  );
}

// Main network visualization
function NetworkScene({ networkState, weights, maxConnections, weakThreshold, lineThickness }) {
  const layerConfigs = useMemo(() => {
    return [
      { neurons: 784, position: [-8, 0, 0], label: 'Input (784)', layerIndex: 0 },
      { neurons: 64, position: [-3, 0, 0], label: 'Hidden 1 (64)', layerIndex: 1 },
      { neurons: 32, position: [2, 0, 0], label: 'Hidden 2 (32)', layerIndex: 2 },
      { neurons: 10, position: [6, 0, 0], label: 'Output (10)', layerIndex: 3 }
    ];
  }, []);

  // Generate neuron positions for each layer
  const neuronPositions = useMemo(() => {
    return layerConfigs.map(config => {
      const positions = [];
      const cols = Math.ceil(Math.sqrt(config.neurons));
      const rows = Math.ceil(config.neurons / cols);
      const spacing = 0.3;

      for (let i = 0; i < config.neurons; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = config.position[0];
        const y = config.position[1] + (row - rows / 2) * spacing;
        const z = config.position[2] + (col - cols / 2) * spacing;
        positions.push([x, y, z]);
      }

      return positions;
    });
  }, [layerConfigs]);

  // Get activations for each layer
  const activations = useMemo(() => {
    if (!networkState) {
      return [[], [], [], []];
    }
    return [
      networkState.input || [],
      networkState.layer1 || [],
      networkState.layer2 || [],
      networkState.probabilities || []
    ];
  }, [networkState]);

  // Get top connections between layers
  const connections = useMemo(() => {
    if (!networkState || !weights) return [[], [], []];

    const hasData = networkState.input && networkState.input.some(v => v > 0);
    if (!hasData) return [[], [], []];

    // Get connections and filter by weak threshold
    const filterConnections = (conns) => {
      return conns.filter(conn => Math.abs(conn.weight) >= weakThreshold);
    };

    return [
      filterConnections(getTopConnections(weights.layer1.weights, activations[0], activations[1], maxConnections)),
      filterConnections(getTopConnections(weights.layer2.weights, activations[1], activations[2], maxConnections)),
      filterConnections(getTopConnections(weights.output.weights, activations[2], activations[3], maxConnections))
    ];
  }, [networkState, weights, activations, maxConnections, weakThreshold]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} />

      {/* Render connections first (behind neurons) */}
      <LayerConnections
        sourcePositions={neuronPositions[0]}
        targetPositions={neuronPositions[1]}
        connections={connections[0]}
        lineThickness={lineThickness}
      />
      <LayerConnections
        sourcePositions={neuronPositions[1]}
        targetPositions={neuronPositions[2]}
        connections={connections[1]}
        lineThickness={lineThickness}
      />
      <LayerConnections
        sourcePositions={neuronPositions[2]}
        targetPositions={neuronPositions[3]}
        connections={connections[2]}
        lineThickness={lineThickness}
      />

      {/* Render neuron layers */}
      {layerConfigs.map((config, i) => (
        <NeuronLayer
          key={i}
          neurons={config.neurons}
          activations={activations[i]}
          position={config.position}
          label={config.label}
          layerIndex={config.layerIndex}
        />
      ))}

      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.5}
        minDistance={5}
        maxDistance={30}
      />
    </>
  );
}

// Main component export
export default function NetworkVisualization3D({
  networkState,
  weights,
  maxConnections = 8,
  weakThreshold = 0,
  lineThickness = 1
}) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 0, 15], fov: 50 }}
        style={{ background: '#0a0a0a' }}
        gl={{ antialias: true }}
        dpr={window.devicePixelRatio}
      >
        <NetworkScene
          networkState={networkState}
          weights={weights}
          maxConnections={maxConnections}
          weakThreshold={weakThreshold}
          lineThickness={lineThickness}
        />
      </Canvas>

      {/* Legend */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        padding: '15px',
        borderRadius: '12px',
        border: '1px solid #444',
        fontSize: '12px',
        color: '#ccc',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#fff', fontSize: '13px' }}>Controls</div>
        <div>🖱️ Left drag: Rotate</div>
        <div>🖱️ Right drag: Pan</div>
        <div>🖱️ Scroll: Zoom</div>
        <div style={{ marginTop: '6px', fontSize: '11px', color: '#999' }}>📱 Touch: Drag to rotate, pinch to zoom</div>
        <div style={{ marginTop: '10px', fontWeight: 'bold', color: '#fff', fontSize: '13px' }}>Colors</div>
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center', marginTop: '5px' }}>
          <div style={{ width: '20px', height: '12px', background: 'linear-gradient(to right, #1e3a8a, #3b82f6, #06b6d4)', borderRadius: '2px' }}></div>
          <span>Low activation</span>
        </div>
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center', marginTop: '3px' }}>
          <div style={{ width: '20px', height: '12px', background: 'linear-gradient(to right, #eab308, #f97316, #ef4444)', borderRadius: '2px' }}></div>
          <span>High activation</span>
        </div>
      </div>
    </div>
  );
}
