# 🚀 Pathfinding Visualizer: An Interactive Algorithm Sandbox

> A high-performance, interactive web application designed to visualize classic pathfinding algorithms in real-time. Built with a focus on clean architecture and smooth user experience.

### 🔗 [Live Demo: Experience the Visualization Here](https://toudaimori.github.io/pathfinding-visualizer/)

---

## ✨ Key Features

* **Interactive Grid System**: A 20x40 dynamic grid where users can draw walls and obstacles in real-time.
* **Drag-and-Drop Nodes**: Intuitive manipulation of "Start" and "Target" points.
* **Dual Algorithm Support**:
* **Dijkstra's Algorithm**: The father of pathfinding; guarantees the shortest path.
* **A* (A-Star) Search**: An optimized heuristic-based search that finds the path significantly faster.


* **Procedural Maze Generation**: Implements the **Recursive Division** algorithm to generate complex, solvable mazes instantly.
* **Real-time Speed Control**: Adjust the visualization tempo from 1ms to 50ms to study algorithm behavior in detail.
* **Responsive & Modern UI**: A sleek dark-mode aesthetic built with Tailwind CSS v4.

---

## 🧠 Algorithms Explored

| Algorithm | Type | Description |
| --- | --- | --- |
| **Dijkstra** | Uninformed | Explores all directions equally. Guarantees the shortest path. |
| **A* (A-Star)** | Informed | Uses heuristics to prioritize nodes closer to the goal. Much faster than Dijkstra. |
| **Recursive Division** | Maze Gen | A "divide and conquer" approach to creating wall patterns. |

---

## 🛠️ Technical Implementation

This project follows **Clean Architecture** principles to ensure the code is maintainable and scalable:

1. **Logic-UI Separation**: Algorithm logic (Dijkstra, A*, Maze) is strictly decoupled from React components, allowing for easy testing and updates.
2. **Efficient State Updates**: Optimized React state management to handle high-frequency grid updates during animations without sacrificing 60fps performance.
3. **Type Safety**: 100% TypeScript implementation for robust data structures and bug prevention.

---

## 🚀 Getting Started

To run this project locally, follow these steps:

1. **Clone the repository:**

  ```bash
  git clone https://github.com/toudaimori/pathfinding-visualizer.git
  ```

2. **Install dependencies:**

  ```bash
  npm install
  ```


3. **Launch the development server:**

  ```bash
  npm run dev
  ```

---

## 📝 License

This project is open-source and available under the MIT License.
