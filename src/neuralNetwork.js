// Neural Network Forward Propagation and Weight Generation

// Generate random weights using Xavier/Glorot initialization
function generateWeights(inputSize, outputSize) {
  const limit = Math.sqrt(6 / (inputSize + outputSize));
  const weights = [];
  for (let i = 0; i < outputSize; i++) {
    const row = [];
    for (let j = 0; j < inputSize; j++) {
      row.push((Math.random() * 2 - 1) * limit);
    }
    weights.push(row);
  }
  return weights;
}

function generateBiases(size) {
  return new Array(size).fill(0).map(() => (Math.random() - 0.5) * 0.1);
}

// Initialize network weights for 784 -> 64 -> 32 -> 10
export function initializeWeights() {
  return {
    layer1: {
      weights: generateWeights(784, 64),
      biases: generateBiases(64)
    },
    layer2: {
      weights: generateWeights(64, 32),
      biases: generateBiases(32)
    },
    output: {
      weights: generateWeights(32, 10),
      biases: generateBiases(10)
    }
  };
}

// Activation functions
export function relu(x) {
  return Math.max(0, x);
}

export function softmax(logits) {
  const maxLogit = Math.max(...logits);
  const exps = logits.map(x => Math.exp(x - maxLogit)); // Subtract max for numerical stability
  const sumExps = exps.reduce((a, b) => a + b, 0);
  return exps.map(x => x / sumExps);
}

// Dense layer forward pass
function denseLayer(input, weights, biases, activation = null) {
  const output = [];
  const activations = [];

  for (let i = 0; i < weights.length; i++) {
    let sum = biases[i];
    for (let j = 0; j < input.length; j++) {
      sum += weights[i][j] * input[j];
    }
    output.push(sum);
    activations.push(activation ? activation(sum) : sum);
  }

  return { preActivation: output, activation: activations };
}

// Full forward propagation
export function forwardPass(input, weights) {
  // Flatten and normalize input (28x28 -> 784, divide by 255)
  const flattened = input.flat().map(x => x / 255);

  // Layer 1: 784 -> 64 with ReLU
  const layer1Result = denseLayer(flattened, weights.layer1.weights, weights.layer1.biases, relu);

  // Layer 2: 64 -> 32 with ReLU
  const layer2Result = denseLayer(layer1Result.activation, weights.layer2.weights, weights.layer2.biases, relu);

  // Output layer: 32 -> 10 (logits)
  const outputResult = denseLayer(layer2Result.activation, weights.output.weights, weights.output.biases);

  // Apply softmax to get probabilities
  const probabilities = softmax(outputResult.activation);

  return {
    input: flattened,
    layer1: layer1Result.activation,
    layer2: layer2Result.activation,
    logits: outputResult.activation,
    probabilities: probabilities,
    prediction: probabilities.indexOf(Math.max(...probabilities))
  };
}

// Get top connections for visualization (to avoid drawing too many edges)
export function getTopConnections(weights, sourceActivations, targetActivations, topK = 5) {
  const connections = [];

  for (let target = 0; target < weights.length; target++) {
    const weightMagnitudes = weights[target].map((w, source) => ({
      source,
      target,
      weight: w,
      magnitude: Math.abs(w),
      sourceActivation: sourceActivations[source],
      targetActivation: targetActivations[target]
    }));

    // Sort by magnitude and take top K
    weightMagnitudes.sort((a, b) => b.magnitude - a.magnitude);
    connections.push(...weightMagnitudes.slice(0, topK));
  }

  return connections;
}

// Normalize activations for color mapping
export function normalizeActivations(activations) {
  const max = Math.max(...activations);
  const min = Math.min(...activations);
  const range = max - min;

  if (range === 0) return activations.map(() => 0.5);

  return activations.map(a => (a - min) / range);
}
