function fibFastDoubling(n) {
  if (n === 0) return [0, 1];
  const [Fk, Fk1] = fibFastDoubling(Math.floor(n / 2));
  const c = Fk * (2 * Fk1 - Fk);
  const d = Fk * Fk + Fk1 * Fk1;
  return n % 2 === 0 ? [c, d] : [d, c + d];
}

function fibonacciFastDoubling(n) {
  return fibFastDoubling(n)[0];
}

//---------------------------------------------------------------------------------------

function fibonacciIterative(n) {
  if (n < 2) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}

//---------------------------------------------------------------------------------------

const memoryStack = new Map([[0, 0], [1, 1]]);
function fibonacciMemo(n, memo = memoryStack) {
  if (memo.has(n)) return memo.get(n);
  for (let i = 2; i <= n; i++) {
    if (!memo.has(i)) {
      memo.set(i, memo.get(i - 1) + memo.get(i - 2));
    }
  }
  return memo.get(n);
}

//--------------------------------------------------------------------------------------------

function fibonacciRecursive(n) {
  if (n < 2) return n;
  return fibonacciRecursive(n - 1) + fibonacciRecursive(n - 2);
}

//----------------------------------------------------------------------------------------------

function fibonacciDP(n) {
  if (n < 2) return n;
  const dp = new Array(n + 1);
  dp[0] = 0;
  dp[1] = 1;
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}

//----------------------------------------------------------------------------------------------

function multiplyMatrix(A, B) {
  return [
    [A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]],
    [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]]
  ];
}
function matrixPower(mat, n) {
  if (n === 1) return mat;
  if (n % 2 === 0) {
    const half = matrixPower(mat, n / 2);
    return multiplyMatrix(half, half);
  } else {
    const half = matrixPower(mat, Math.floor(n / 2));
    const halfSquared = multiplyMatrix(half, half);
    return multiplyMatrix(halfSquared, mat);
  }
}
function fibonacciMatrix(n) {
  if (n === 0) return 0;
  const F = [[1, 1], [1, 0]];
  const result = matrixPower(F, n);
  return result[0][1];
}

//-------------------------------------------------------------------------------

function fibonacciBinet(n) {
  const sqrt5 = Math.sqrt(5);
  const phi = (1 + sqrt5) / 2;
  const psi = (1 - sqrt5) / 2;
  return Math.round((Math.pow(phi, n) - Math.pow(psi, n)) / sqrt5);
}

//---------------------------------------------------------------------------

function measureTime(func, n, runs = 100) {
  func(n);
  const start = performance.now();
  for (let i = 0; i < runs; i++) {
    func(n);
  }
  const end = performance.now();
  return (end - start) / runs;
}

const methods = {
  fastDoubling: {
    name: "Fast Doubling",
    func: fibonacciFastDoubling,
    testNs: [0, 2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000],
    runs: 100,
    canvasId: "chart-fastDoubling"
  },
  iterative: {
    name: "Iterative",
    func: fibonacciIterative,
    testNs: [0, 2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000],
    runs: 100,
    canvasId: "chart-iterative"
  },
  memo: {
    name: "Memoization",
    func: fibonacciMemo,
    testNs: [0, 2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000],
    runs: 100,
    canvasId: "chart-memo"
  },
  recursive: {
    name: "Recursive",
    func: fibonacciRecursive,
    testNs: [0, 2, 4, 8, 10, 12, 15, 18, 20],
    runs: 1,
    canvasId: "chart-recursive"
  },
  dp: {
    name: "Dynamic Programming",
    func: fibonacciDP,
    testNs: [0, 2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000],
    runs: 100,
    canvasId: "chart-dp"
  },
  matrix: {
    name: "Matrix Power",
    func: fibonacciMatrix,
    testNs: [0, 2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000],
    runs: 100,
    canvasId: "chart-matrix"
  },
  binet: {
    name: "Binet Formula",
    func: fibonacciBinet,
    testNs: [0, 2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000],
    runs: 100,
    canvasId: "chart-binet"
  }
};

for (const key in methods) {
  const method = methods[key];
  method.times = method.testNs.map(n => measureTime(method.func, n, method.runs));
  console.log(method.name, method.testNs, method.times);
}


function drawGraphForMethod(canvasId, testNs, times, methodName) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const margin = { top: 20, right: 20, bottom: 40, left: 60 };
  const graphWidth = canvas.width - margin.left - margin.right;
  const graphHeight = canvas.height - margin.top - margin.bottom;

  const maxTime = Math.max(...times);
  const minN = Math.min(...testNs);
  const maxN = Math.max(...testNs);

  const xScale = n => margin.left + ((n - minN) / (maxN - minN || 1)) * graphWidth;
  const yScale = time => margin.top + graphHeight - (time / (maxTime || 1)) * graphHeight;

  ctx.strokeStyle = 'black';
  ctx.beginPath();
  ctx.moveTo(margin.left, margin.top + graphHeight);
  ctx.lineTo(margin.left + graphWidth, margin.top + graphHeight);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(margin.left, margin.top);
  ctx.lineTo(margin.left, margin.top + graphHeight);
  ctx.stroke();

  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  testNs.forEach(n => {
    const x = xScale(n);
    ctx.fillText(n, x, margin.top + graphHeight + 20);
  });

  ctx.textAlign = 'right';
  const numTicks = 5;
  for (let i = 0; i <= numTicks; i++) {
    const timeTick = (i / numTicks) * maxTime;
    const y = yScale(timeTick);
    ctx.fillText(timeTick.toFixed(4), margin.left - 5, y + 5);
  }


  ctx.strokeStyle = 'red';
  ctx.beginPath();
  testNs.forEach((n, i) => {
    const x = xScale(n);
    const y = yScale(times[i]);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  ctx.fillStyle = 'red';
  testNs.forEach((n, i) => {
    const x = xScale(n);
    const y = yScale(times[i]);
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.font = "16px Arial";
  ctx.fillText(methodName, canvas.width / 2, margin.top - 5);
}

for (const key in methods) {
  const method = methods[key];
  drawGraphForMethod(method.canvasId, method.testNs, method.times, method.name);
}