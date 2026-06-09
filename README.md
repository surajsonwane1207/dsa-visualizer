# DSA Lab — Interactive Data Structures & Algorithms Visualizer

DSA Lab is a premium, high-performance interactive playground built with **React 18** and **Vanilla CSS** to help visualize foundational computer science data structures and algorithms. 

Access the live dashboard locally at: **[http://localhost:5173/](http://localhost:5173/)**

---

## 🚀 Key Modules & Interactive Features

### 1. 📊 Sorting Algorithms Visualizer
* **Algorithms**: Bubble Sort, Selection Sort, Insertion Sort, Quick Sort, and Merge Sort.
* **Controls**: Dynamic array size slider (10 to 80 elements), speed adjustment, and a randomized array generator.
* **Color States**:
  * **Violet**: Default elements.
  * **Yellow**: Elements being compared.
  * **Red**: Elements being swapped/overwritten.
  * **Green**: Elements in their final sorted position.

### 2. 🧭 Pathfinding Visualizer
* **Algorithms**: Dijkstra's Algorithm, A* Search (Manhattan Distance Heuristic), Breadth-First Search (BFS), and Depth-First Search (DFS).
* **Interactive Grid**: A 18x36 grid supporting real-time wall construction via dragging.
* **Draggable Pivots**: Drag and drop the **Start Node** (Green) and **Target Node** (Red) dynamically to recalculate paths.
* **Path Expansion**: Animates the exploratory wave (Blue/Purple) and traces the shortest path (Pink).

### 3. 🔗 Linked List Visualizer
* **Structure**: Singly Linked List.
* **Operations**: Insert (Head/Tail/Index), Delete (Head/Tail/Index), and Search.
* **Step Logs**: Prints step-by-step console logs (e.g. `"Scanning node at index 1..."`) mapping the traversal pointer live.

### 4. 🥞 Stack & Queue Visualizer
* **Stack (LIFO)**: Represented inside a vertical container open at the top. Labeled top element indicator.
* **Queue (FIFO)**: Represented inside a horizontal pipe. Labeled front and rear element indicators.
* **Operations**: Push/Pop/Peek/Clear for Stack; Enqueue/Dequeue/Peek/Clear for Queue.

### 5. 🌿 Binary Search Tree (BST)
* **SVG Rendering**: Node positions and dashed parent pointers are dynamically computed recursively.
* **Operations**: Insert, Delete, Search, and Traversals (Inorder, Preorder, Postorder).
* **Safety Capping**: Constrains max tree height to 4 levels to prevent overlapping nodes.

---

## 📈 Complexity Cheat Sheet

| Algorithm / Data Structure | Time Complexity (Average) | Space Complexity | Guarantees Shortest Path? | Stable? |
| :--- | :--- | :--- | :--- | :--- |
| **Bubble Sort** | $O(N^2)$ | $O(1)$ | — | Yes |
| **Selection Sort** | $O(N^2)$ | $O(1)$ | — | No |
| **Insertion Sort** | $O(N^2)$ | $O(1)$ | — | Yes |
| **Quick Sort** | $O(N \log N)$ | $O(\log N)$ | — | No |
| **Merge Sort** | $O(N \log N)$ | $O(N)$ | — | Yes |
| **Dijkstra** | $O((V + E) \log V)$ | $O(V)$ | Yes | — |
| **A\* Search** | $O(E \log V)$ | $O(V)$ | Yes | — |
| **BFS (Grid)** | $O(V + E)$ | $O(V)$ | Yes (Unweighted) | — |
| **DFS (Grid)** | $O(V + E)$ | $O(V)$ | No | — |
| **Linked List** | Access: $O(N)$, Search: $O(N)$ | $O(N)$ | — | — |
| **BST** | Insert/Search/Delete: $O(\log N)$ | $O(N)$ | — | — |

---

## 🛠️ Installation & Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the local development server**:
   ```bash
   npm run dev
   ```

3. **Compile a production build**:
   ```bash
   npm run build
   ```
