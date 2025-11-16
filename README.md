# MNIST Neural Network Visualizer

An interactive React-based 3D visualization of a Multi-Layer Perceptron (MLP) neural network processing MNIST-style handwritten digits in real-time.

![Neural Network Architecture](https://img.shields.io/badge/Architecture-784→64→32→10-blue)
![React](https://img.shields.io/badge/React-18.3-61dafb)
![Three.js](https://img.shields.io/badge/Three.js-0.170-black)

## 🌟 Features

### Interactive Drawing Canvas
- 28×28 pixel grid matching MNIST input dimensions
- Smooth click-and-drag drawing with adjustable brush size
- Real-time grayscale value rendering (0-255)
- Visual grid lines for pixel precision
- One-click clear functionality

### 3D Neural Network Visualization
- **Architecture**: Input (784) → Hidden Layer 1 (64) → Hidden Layer 2 (32) → Output (10)
- **WebGL-based rendering** using Three.js and react-three-fiber
- **Dynamic neuron visualization**:
  - Color-coded activation strength (cool blue → warm coral/red)
  - Real-time updates as you draw
  - Size scaling based on activation intensity
- **Selective edge rendering**:
  - Shows top weighted connections between layers
  - Color-coded weights (warm = positive, cool = negative)
  - Thickness proportional to weight magnitude
- **Interactive camera controls**:
  - Orbit (left-click drag)
  - Pan (right-click drag)
  - Zoom (mouse wheel)

### Real-Time Prediction
- Live probability bar chart for digits 0-9
- Confidence-based color coding (green/orange/slate)
- Highlighted predicted digit with percentage
- Smooth animated transitions

### Neural Network Implementation
- Complete forward propagation in JavaScript
- ReLU activation for hidden layers
- Softmax activation for output layer
- Xavier/Glorot weight initialization
- Debounced updates for optimal performance (50ms)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd react-MLP-visualisation

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173/`

### Building for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── App.jsx                    # Main application component
├── DrawingCanvas.jsx          # 28×28 interactive drawing canvas
├── ProbabilityChart.jsx       # Real-time prediction bar chart
├── NetworkVisualization3D.jsx # 3D neural network visualization
├── neuralNetwork.js           # Forward propagation & weight generation
├── main.jsx                   # Application entry point
└── index.css                  # Global styles
```

## 🧠 Neural Network Architecture

```
Input Layer:    784 neurons (28×28 flattened pixels)
                ↓
Hidden Layer 1: 64 neurons + ReLU activation
                ↓
Hidden Layer 2: 32 neurons + ReLU activation
                ↓
Output Layer:   10 neurons + Softmax activation
                ↓
Probabilities:  [P(0), P(1), ..., P(9)]
```

### Activation Functions

**ReLU (Rectified Linear Unit)**
```
f(x) = max(0, x)
```

**Softmax**
```
f(x_i) = exp(x_i) / Σ exp(x_j)
```

## 🎨 Color Coding

### Neuron Activations
- **Dark Blue** → Low/zero activation
- **Cyan** → Low-medium activation
- **Yellow/Green** → Medium activation
- **Orange** → High activation
- **Red/Coral** → Very high activation

### Weight Connections
- **Warm colors (red/orange)** → Strong positive weights
- **Cool colors (blue/cyan)** → Strong negative weights
- **Transparency** → Near-zero weights

## 🎮 How to Use

1. **Draw a digit** (0-9) on the canvas using your mouse
2. **Watch the network process** your drawing in real-time
3. **Observe activations** propagating through the 3D visualization
4. **View predictions** in the probability chart
5. **Explore the network** by rotating, panning, and zooming the 3D view
6. **Clear and try again** with different digits

## ⚡ Performance Optimizations

- Debounced drawing updates (50ms)
- Selective edge rendering (only top-K connections)
- Efficient neuron positioning algorithms
- Optimized re-rendering with React hooks
- WebGL-accelerated 3D rendering

## 🛠️ Technologies Used

- **React 18.3** - UI framework
- **Three.js** - 3D graphics library
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for react-three-fiber
- **Vite** - Build tool and development server

## 📚 Educational Value

This visualization demonstrates:
- How neural networks process sequential layers of information
- The role of activation functions (ReLU, Softmax)
- Weight connections between neurons
- Forward propagation through a network
- Real-time inference on visual data

## 🔮 Future Enhancements

Potential improvements:
- Load actual pre-trained MNIST weights
- Layer-by-layer stepping mode
- Neuron-level tooltips with exact values
- Export drawings as images
- Multiple model architectures
- Training mode visualization
- Gradient flow visualization (backpropagation)

## 📝 Note

This implementation uses **simulated pre-trained weights** generated via Xavier/Glorot initialization for demonstration purposes. For production use with real MNIST accuracy, train weights using TensorFlow/PyTorch and export to JSON.

## 📄 License

MIT License - feel free to use this project for learning and development!

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 👨‍💻 Author

Created as an educational tool for understanding neural network architectures and visualization techniques.