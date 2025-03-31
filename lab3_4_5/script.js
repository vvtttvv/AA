// Global definitions for nodes and edges
const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');

const perfCanvas = document.getElementById('perfCanvas');
const perfCtx = perfCanvas.getContext('2d');

const theoryCanvas = document.getElementById('theoryCanvas');
const theoryCtx = theoryCanvas.getContext('2d');

/*
// Example nodes and edges for an undirected weighted graph with 20 nodes
const nodes = [
  { id: 0, x: 50, y: 50 }, { id: 1, x: 150, y: 50 }, { id: 2, x: 250, y: 50 },
  { id: 3, x: 350, y: 50 }, { id: 4, x: 450, y: 50 }, { id: 5, x: 550, y: 50 },
  { id: 6, x: 50, y: 150 }, { id: 7, x: 150, y: 150 }, { id: 8, x: 250, y: 150 },
  { id: 9, x: 350, y: 150 }, { id: 10, x: 450, y: 150 }, { id: 11, x: 550, y: 150 },
  { id: 12, x: 50, y: 250 }, { id: 13, x: 150, y: 250 }, { id: 14, x: 250, y: 250 },
  { id: 15, x: 350, y: 250 }, { id: 16, x: 450, y: 250 }, { id: 17, x: 550, y: 250 },
  { id: 18, x: 300, y: 350 }, { id: 19, x: 500, y: 350 }
];

const edges = [
  { from: 0, to: 1, weight: 3 }, { from: 1, to: 2, weight: 5 }, { from: 2, to: 3, weight: 2 },
  { from: 3, to: 4, weight: 7 }, { from: 4, to: 5, weight: 3 }, { from: 5, to: 11, weight: 6 },
  { from: 0, to: 6, weight: 4 }, { from: 1, to: 7, weight: 2 }, { from: 2, to: 8, weight: 5 },
  { from: 3, to: 9, weight: 1 }, { from: 4, to: 10, weight: 3 }, { from: 6, to: 7, weight: 6 },
  { from: 7, to: 8, weight: 4 }, { from: 8, to: 9, weight: 3 }, { from: 9, to: 10, weight: 5 },
  { from: 10, to: 11, weight: 7 }, { from: 6, to: 12, weight: 2 }, { from: 7, to: 13, weight: 4 },
  { from: 8, to: 14, weight: 3 }, { from: 9, to: 15, weight: 5 }, { from: 10, to: 16, weight: 6 },
  { from: 11, to: 17, weight: 2 }, { from: 12, to: 13, weight: 3 }, { from: 13, to: 14, weight: 2 },
  { from: 14, to: 15, weight: 4 }, { from: 15, to: 16, weight: 5 }, { from: 16, to: 17, weight: 3 },
  { from: 12, to: 18, weight: 6 }, { from: 15, to: 18, weight: 2 }, { from: 16, to: 19, weight: 4 },
  { from: 18, to: 19, weight: 7 }
];

// Graph for DFS and BFS (using an adjacency list)
const graph = {};
nodes.forEach(node => graph[node.id] = []);
edges.forEach(edge => {
  graph[edge.from].push(edge.to);
  graph[edge.to].push(edge.from); // Undirected graph
});
*/

function generateRandomGraph(n) {
  const nodes = [];
  const edges = [];
  const graph = {};

  // Generate random nodes with x, y positions
  for (let i = 0; i < n; i++) {
    nodes.push({ id: i, x: Math.floor(Math.random() * 500), y: Math.floor(Math.random() * 500) });
    graph[i] = []; // Initialize adjacency list
  }

  // Generate random edges with weights
  const maxEdges = (n * (n - 1)) / 2; // Maximum number of edges in an undirected graph
  const totalEdges = Math.floor(Math.random() * maxEdges) + 1;

  const addedEdges = new Set();

  for (let i = 0; i < totalEdges; i++) {
    let from = Math.floor(Math.random() * n);
    let to = Math.floor(Math.random() * n);

    // Ensure the edge is unique and not self-loop
    while (from === to || addedEdges.has(`${from}-${to}`) || addedEdges.has(`${to}-${from}`)) {
      from = Math.floor(Math.random() * n);
      to = Math.floor(Math.random() * n);
    }

    // Generate a random weight between 1 and 10
    const weight = Math.floor(Math.random() * 10) + 1;

    edges.push({ from, to, weight });
    graph[from].push(to);
    graph[to].push(from); // Undirected graph

    // Mark this edge as added
    addedEdges.add(`${from}-${to}`);
  }

  return { nodes, edges, graph };
}

const { nodes, edges, graph } = generateRandomGraph(10);
 


// Utility delay function
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/*---------------------------
  Draw Base Graph Function
----------------------------*/
function drawGraph(highlightedNodes = [], highlightedEdges = []) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw edges
  edges.forEach(edge => {
    ctx.beginPath();
    ctx.moveTo(nodes[edge.from].x, nodes[edge.from].y);
    ctx.lineTo(nodes[edge.to].x, nodes[edge.to].y);
    if (highlightedEdges.find(e => 
          (e.from === edge.from && e.to === edge.to) ||
          (e.from === edge.to && e.to === edge.from)
        )) {
      ctx.strokeStyle = '#f00';
      ctx.lineWidth = 4;
    } else {
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
    }
    ctx.stroke();
  });

  // Draw nodes
  nodes.forEach(node => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
    ctx.fillStyle = highlightedNodes.includes(node.id) ? '#0f0' : '#ccc';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();
    // Node ID
    ctx.fillStyle = '#000';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.id, node.x, node.y);
  });
}

/*---------------------------
  DFS Implementation Demo
----------------------------*/
async function runDFS() {
  drawGraph();
  await delay(500);
  const visited = {};
  const order = [];

  async function dfs(node) {
    visited[node] = true;
    order.push(node);
    drawGraph(order);
    await delay(500);
    for (let neighbor of graph[node]) {
      if (!visited[neighbor]) {
        await dfs(neighbor);
      }
    }
  }

  await dfs(0);
}

/*---------------------------
  BFS Implementation Demo
----------------------------*/
async function runBFS() {
  drawGraph();
  await delay(500);
  const visited = {};
  const order = [];
  const queue = [0];
  visited[0] = true;

  while (queue.length) {
    const node = queue.shift();
    order.push(node);
    drawGraph(order);
    await delay(500);
    for (let neighbor of graph[node]) {
      if (!visited[neighbor]) {
        visited[neighbor] = true;
        queue.push(neighbor);
      }
    }
  }
}

/*---------------------------
  Prim's Algorithm Demo
----------------------------*/
async function runPrim() {
  drawGraph();
  await delay(500);
  let mstNodes = new Set();
  let mstEdges = [];
  mstNodes.add(0);

  function getCandidateEdges() {
    return edges.filter(edge => 
      (mstNodes.has(edge.from) && !mstNodes.has(edge.to)) ||
      (mstNodes.has(edge.to) && !mstNodes.has(edge.from))
    );
  }

  while (mstNodes.size < nodes.length) {
    let candidateEdges = getCandidateEdges();
    if (candidateEdges.length === 0) break;
    candidateEdges.sort((a, b) => a.weight - b.weight);
    let chosenEdge = candidateEdges[0];
    mstEdges.push(chosenEdge);
    let newVertex = mstNodes.has(chosenEdge.from) ? chosenEdge.to : chosenEdge.from;
    mstNodes.add(newVertex);
    drawGraph(Array.from(mstNodes), mstEdges);
    await delay(500);
  }

  ctx.fillStyle = "#000";
  ctx.font = "24px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Prim's Algorithm: MST Complete", canvas.width / 2, canvas.height - 30);
}

/*---------------------------
  Kruskal's Algorithm Demo
----------------------------*/
async function runKruskal() {
  drawGraph();
  await delay(500);
  let sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
  let mstEdges = [];
  let parent = Array.from({ length: nodes.length }, (_, i) => i);

  function find(x) {
    if (parent[x] !== x) {
      parent[x] = find(parent[x]);
    }
    return parent[x];
  }

  function union(x, y) {
    let rootX = find(x);
    let rootY = find(y);
    if (rootX === rootY) return false;
    parent[rootY] = rootX;
    return true;
  }

  for (let edge of sortedEdges) {
    drawGraph([], mstEdges);
    await delay(300);
    if (union(edge.from, edge.to)) {
      mstEdges.push(edge);
      drawGraph([], mstEdges);
      await delay(500);
    } else {
      drawGraph([], mstEdges);
      ctx.beginPath();
      ctx.setLineDash([5, 5]);
      ctx.moveTo(nodes[edge.from].x, nodes[edge.from].y);
      ctx.lineTo(nodes[edge.to].x, nodes[edge.to].y);
      ctx.strokeStyle = "#f00";
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.setLineDash([]);
      await delay(500);
      drawGraph([], mstEdges);
    }
  }

  ctx.fillStyle = "#000";
  ctx.font = "24px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Kruskal's Algorithm: MST Complete", canvas.width / 2, canvas.height - 30);
}

/*---------------------------
  Dijkstra's Algorithm Demo
----------------------------*/
async function runDijkstra() {
  // Build weighted graph representation
  const weightedGraph = {};
  nodes.forEach(node => {
    weightedGraph[node.id] = [];
  });
  edges.forEach(edge => {
    weightedGraph[edge.from].push({ node: edge.to, weight: edge.weight });
    weightedGraph[edge.to].push({ node: edge.from, weight: edge.weight });
  });

  // Initialize
  const distances = Array(nodes.length).fill(Infinity);
  const previous = Array(nodes.length).fill(null);
  const visited = new Set();
  distances[0] = 0;

  function updateVisualization(current = null) {
    drawGraph(Array.from(visited));
    nodes.forEach(node => {
      ctx.fillStyle = "#000";
      ctx.font = "14px Arial";
      const d = distances[node.id] === Infinity ? "∞" : distances[node.id];
      ctx.fillText(d, node.x, node.y - 30);
      if (node.id === current) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 25, 0, 2 * Math.PI);
        ctx.strokeStyle = "#00f";
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    });
  }

  updateVisualization();
  await delay(500);

  while (visited.size < nodes.length) {
    let currentNode = null;
    let currentDist = Infinity;
    for (let i = 0; i < distances.length; i++) {
      if (!visited.has(i) && distances[i] < currentDist) {
        currentDist = distances[i];
        currentNode = i;
      }
    }
    if (currentNode === null) break;
    visited.add(currentNode);
    updateVisualization(currentNode);
    await delay(500);
    for (let neighbor of weightedGraph[currentNode]) {
      if (!visited.has(neighbor.node)) {
        const newDist = distances[currentNode] + neighbor.weight;
        if (newDist < distances[neighbor.node]) {
          distances[neighbor.node] = newDist;
          previous[neighbor.node] = currentNode;
          updateVisualization(currentNode);
          await delay(500);
        }
      }
    }
    updateVisualization();
    await delay(500);
  }

  // Draw shortest path tree
  drawGraph(Array.from(visited));
  for (let i = 1; i < nodes.length; i++) {
    if (previous[i] !== null) {
      ctx.beginPath();
      ctx.moveTo(nodes[previous[i]].x, nodes[previous[i]].y);
      ctx.lineTo(nodes[i].x, nodes[i].y);
      ctx.strokeStyle = "#00f";
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  }
  ctx.fillStyle = "#000";
  ctx.font = "24px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Dijkstra's Algorithm: Shortest Paths Computed", canvas.width / 2, canvas.height - 30);
}

/*---------------------------
  Floyd–Warshall Algorithm Demo
----------------------------*/
// This version shows evolving direct edge “shortcuts” with updates highlighted.
async function runFloydWarshall() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#000";
  ctx.font = "24px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Floyd–Warshall Algorithm Demo", canvas.width / 2, 30);
  await delay(1000);

  const n = nodes.length;
  let dist = Array.from({ length: n }, () => Array(n).fill(Infinity));
  let next = Array.from({ length: n }, () => Array(n).fill(null));

  for (let i = 0; i < n; i++) {
    dist[i][i] = 0;
    next[i][i] = i;
  }
  for (let e of edges) {
    dist[e.from][e.to] = e.weight;
    dist[e.to][e.from] = e.weight;
    next[e.from][e.to] = e.to;
    next[e.to][e.from] = e.from;
  }

  function drawFloydVisualization(k, changedEdges = []) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Floyd–Warshall Demo", canvas.width / 2, 20);
    ctx.font = "16px Arial";
    ctx.fillText(`Intermediate step k = ${k}`, canvas.width / 2, 45);

    // Draw nodes
    nodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
      ctx.fillStyle = "#ccc";
      ctx.fill();
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "#000";
      ctx.font = "16px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.id, node.x, node.y);
    });

    // Draw direct edges (only once per pair)
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        if (dist[i][j] !== Infinity) {
          let isChanged = changedEdges.some(
            upd => (upd.i === i && upd.j === j) || (upd.i === j && upd.j === i)
          );
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = isChanged ? "#f00" : "#00f";
          ctx.lineWidth = 3;
          ctx.stroke();
          let midX = (nodes[i].x + nodes[j].x) / 2;
          let midY = (nodes[i].y + nodes[j].y) / 2;
          ctx.fillStyle = "#000";
          ctx.font = "14px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "bottom";
          ctx.fillText(dist[i][j] === Infinity ? "∞" : dist[i][j], midX, midY - 2);
        }
      }
    }
  }

  drawFloydVisualization("–");
  await delay(1000);

  for (let k = 0; k < n; k++) {
    let changedEdges = [];
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        let alt = dist[i][k] + dist[k][j];
        if (alt < dist[i][j]) {
          dist[i][j] = alt;
          dist[j][i] = alt;
          next[i][j] = next[i][k];
          next[j][i] = next[j][k];
          changedEdges.push({ i, j });
        }
      }
    }
    drawFloydVisualization(k, changedEdges);
    await delay(1000);
  }
  ctx.fillStyle = "#000";
  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Floyd–Warshall: All Pairs Shortest Paths Computed", canvas.width / 2, canvas.height - 20);
}

/*---------------------------
  Performance Measurement & Chart
----------------------------*/
async function measurePerformance() {
  const algorithms = [
    { name: 'DFS', func: runDFS },
    { name: 'BFS', func: runBFS },
    { name: 'Prim', func: runPrim },
    { name: 'Kruskal', func: runKruskal },
    { name: 'Dijkstra', func: runDijkstra },
    { name: 'Floyd–Warshall', func: runFloydWarshall }
  ];

  drawGraph();
  await delay(500);
  const results = [];

  for (let algo of algorithms) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000";
    ctx.font = "24px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`Running ${algo.name}...`, canvas.width / 2, canvas.height / 2);
    await delay(500);
    const start = performance.now();
    await algo.func();
    const end = performance.now();
    results.push({ name: algo.name, time: end - start });
    await delay(500);
  }
  drawPerformanceChart(results);
}

function drawPerformanceChart(data) {
  perfCtx.clearRect(0, 0, perfCanvas.width, perfCanvas.height);
  const margin = 50;
  const chartWidth = perfCanvas.width - margin * 2;
  const chartHeight = perfCanvas.height - margin * 2;
  const maxTime = Math.max(...data.map(d => d.time));
  perfCtx.beginPath();
  perfCtx.moveTo(margin, margin);
  perfCtx.lineTo(margin, margin + chartHeight);
  perfCtx.lineTo(margin + chartWidth, margin + chartHeight);
  perfCtx.strokeStyle = "#000";
  perfCtx.lineWidth = 2;
  perfCtx.stroke();
  const barWidth = chartWidth / data.length - 20;
  data.forEach((d, i) => {
    const barHeight = (d.time / maxTime) * chartHeight;
    const x = margin + i * ((chartWidth) / data.length) + 10;
    const y = margin + chartHeight - barHeight;
    perfCtx.fillStyle = "#00f";
    perfCtx.fillRect(x, y, barWidth, barHeight);
    perfCtx.fillStyle = "#000";
    perfCtx.font = "14px Arial";
    perfCtx.textAlign = "center";
    perfCtx.fillText(d.name, x + barWidth / 2, margin + chartHeight + 15);
    perfCtx.fillText(d.time.toFixed(0) + " ms", x + barWidth / 2, y - 5);
  });
  perfCtx.fillStyle = "#000";
  perfCtx.font = "20px Arial";
  perfCtx.textAlign = "center";
  perfCtx.fillText("Algorithm Execution Time Comparison", perfCanvas.width / 2, margin - 10);
}


function drawComparison() {
  theoryCtx.clearRect(0, 0, theoryCanvas.width, theoryCanvas.height);

  const V = nodes.length;
  const E = edges.length;

  function randomFactor() {
    return 0.8 + Math.random() * 0.4;  
  }
 
  const baseTime = 1e-6;  
  const theory = [
    { name: "DFS", time: (V + E) * baseTime * randomFactor() },
    { name: "BFS", time: (V + E) * baseTime * randomFactor() },
    { name: "Prim", time: (E * Math.log2(V)) * baseTime * randomFactor() },
    { name: "Kruskal", time: (E * Math.log2(E)) * baseTime * randomFactor() },
    { name: "Dijkstra", time: (V ** 2) * baseTime * randomFactor() },
    { name: "Floyd–Warshall", time: (V ** 3) * baseTime * randomFactor() }
  ];

  const margin = 50;
  const chartWidth = theoryCanvas.width - margin * 2;
  const chartHeight = theoryCanvas.height - margin * 2;

  // Find max execution time for scaling
  const maxTime = Math.max(...theory.map(d => d.time));

  // Draw axes
  theoryCtx.beginPath();
  theoryCtx.moveTo(margin, margin);
  theoryCtx.lineTo(margin, margin + chartHeight);
  theoryCtx.lineTo(margin + chartWidth, margin + chartHeight);
  theoryCtx.strokeStyle = "#000";
  theoryCtx.lineWidth = 2;
  theoryCtx.stroke();

  // Bar Chart
  const barWidth = chartWidth / theory.length - 20;
  theory.forEach((d, i) => {
    const barHeight = (d.time / maxTime) * chartHeight;
    const x = margin + i * ((chartWidth) / theory.length) + 10;
    const y = margin + chartHeight - barHeight;
    
    theoryCtx.fillStyle = "#0a0";
    theoryCtx.fillRect(x, y, barWidth, barHeight);
    
    // Labels
    theoryCtx.fillStyle = "#000";
    theoryCtx.font = "14px Arial";
    theoryCtx.textAlign = "center";
    theoryCtx.fillText(d.name, x + barWidth / 2, margin + chartHeight + 15);
    theoryCtx.fillText(d.time.toFixed(6) + " s", x + barWidth / 2, y - 5);
  });

  // Title
  theoryCtx.fillStyle = "#000";
  theoryCtx.font = "20px Arial";
  theoryCtx.textAlign = "center";
  theoryCtx.fillText("Execution Time Comparison (Seconds)", theoryCanvas.width / 2, margin - 10);
}


drawGraph();
