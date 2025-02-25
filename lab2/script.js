function quickSort(arr) {
    if (arr.length < 2) return arr;
    let min = 1;
    let max = arr.length - 1;
    let rand = Math.floor(min + Math.random() * (max + 1 - min));
    let pivot = arr[rand];
    const left = [];
    const right = [];
    arr.splice(arr.indexOf(pivot), 1);
    arr = [pivot].concat(arr);
    for (let i = 1; i < arr.length; i++) {
      if (pivot > arr[i]) {
        left.push(arr[i]);
      } else {
        right.push(arr[i]);
      }
    }
    return quickSort(left).concat(pivot, quickSort(right));
}

//-------------------------------------------------------------------

function merge(left, right) {
    let resultArray = [],
        leftIndex = 0,
        rightIndex = 0;
    while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex] < right[rightIndex]) {
            resultArray.push(left[leftIndex]);
            leftIndex++;
        } else {
            resultArray.push(right[rightIndex]);
            rightIndex++;
        }
    }

    return resultArray
        .concat(left.slice(leftIndex))
        .concat(right.slice(rightIndex));
}

function mergeSort(array) {
    if (array.length === 1) {
        return array;
    }

    const middle = Math.floor(array.length / 2); 
    const left = array.slice(0, middle); 
    const right = array.slice(middle); 

    return merge(
        mergeSort(left), 
        mergeSort(right) 
    );
}

//-------------------------------------------------------------------

function swap(array, index1, index2) {
    [array[index1], array[index2]] = [array[index2], array[index1]];
}

function heapify(array, index, length = array.length) {
    let largest = index,
        left = index * 2 + 1,
        right = index * 2 + 2;

    if (left < length && array[left] > array[largest]) {
        largest = left;
    }
    if (right < length && array[right] > array[largest]) {
        largest = right;
    }

    if (largest !== index) {
        swap(array, index, largest);

        heapify(array, largest, length);
    }

    return array;
}

function heapSort(array) {
    let arr = [...array]; 

    for (let i = Math.floor(arr.length / 2); i >= 0; i--) {
        heapify(arr, i);
    }

    for (let i = arr.length - 1; i > 0; i--) {
        swap(arr, 0, i);
        heapify(arr, 0, i);
    }

    return arr;
}

//-------------------------------------------------------------------

function sortWithBST(array) {
    class Node {
        constructor(data) {
            this.data = data;
            this.left = null;
            this.right = null;
        }
    }

    class BST {
        constructor() {
            this.root = null;
        }

        insert(data) {
            let newNode = new Node(data);
            if (this.root === null) {
                this.root = newNode;
            } else {
                this.insertNode(this.root, newNode);
            }
        }

        insertNode(node, newNode) {
            if (newNode.data < node.data) {
                if (node.left === null) {
                    node.left = newNode;
                } else {
                    this.insertNode(node.left, newNode);
                }
            } else {
                if (node.right === null) {
                    node.right = newNode;
                } else {
                    this.insertNode(node.right, newNode);
                }
            }
        }

        inOrder(node, result) {
            if (node !== null) {
                this.inOrder(node.left, result);
                result.push(node.data);
                this.inOrder(node.right, result);
            }
        }

        getSortedArray() {
            let result = [];
            this.inOrder(this.root, result);
            return result;
        }
    }

    let bst = new BST();
    for (let i = 0; i < array.length; i++) {
        bst.insert(array[i]);
    }
    
    return bst.getSortedArray();
}

//-------------------------------------------------------------------

function measureExecutionTime(sortFunction, array) {
    let start = performance.now();
    sortFunction([...array]); 
    let end = performance.now();
    return end - start;
}

function generateRandomArray(size) {
    return Array.from({ length: size }, () => Math.floor(Math.random() * 1000));
}

const sizes = [100, 500, 1000, 5000, 10000, 20000, 100000];
const results = {
    quickSort: [],
    mergeSort: [],
    heapSort: [],
    sortWithBST: []
};

sizes.forEach(size => {
    const arr = generateRandomArray(size);
    results.quickSort.push(measureExecutionTime(quickSort, arr));
    results.mergeSort.push(measureExecutionTime(mergeSort, arr));
    results.heapSort.push(measureExecutionTime(heapSort, arr));
    results.sortWithBST.push(measureExecutionTime(sortWithBST, arr));
});

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("performanceChart");
    const ctx = canvas.getContext("2d");

    function drawGraph() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const marginLeft = 50;
        const marginBottom = 50;
        const marginTop = 30;
        const marginRight = 20;
        const graphWidth = canvas.width - marginLeft - marginRight;
        const graphHeight = canvas.height - marginBottom - marginTop;
    
        let maxTime = Math.max(...Object.values(results).flat());
        let scaleX = graphWidth / (sizes.length - 1);
        let scaleY = graphHeight / maxTime;
    
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.moveTo(marginLeft, marginTop);
        ctx.lineTo(marginLeft, canvas.height - marginBottom);
        ctx.stroke();
    
        ctx.beginPath();
        ctx.moveTo(marginLeft, canvas.height - marginBottom);
        ctx.lineTo(canvas.width - marginRight, canvas.height - marginBottom);
        ctx.stroke();
    
        ctx.fillStyle = "black";
        ctx.font = "14px Arial";
    
        let stepY = Math.ceil(maxTime / 5);
        for (let i = 0; i <= 5; i++) {
            let yValue = stepY * i;
            let y = canvas.height - marginBottom - yValue * scaleY;
            ctx.fillText(yValue.toFixed(0) + " ms", 5, y);
            
            ctx.beginPath();
            ctx.moveTo(marginLeft - 5, y);
            ctx.lineTo(marginLeft + graphWidth, y);
            ctx.strokeStyle = "#ddd";
            ctx.stroke();
        }
    
        ctx.textAlign = "center";
        sizes.forEach((size, i) => {
            let x = marginLeft + i * scaleX;
            ctx.fillText(size, x, canvas.height - marginBottom + 20);
        });
    
        const colors = { quickSort: "red", mergeSort: "blue", heapSort: "green", sortWithBST: "purple" };
        
        Object.entries(results).forEach(([name, times]) => {
            ctx.beginPath();
            ctx.strokeStyle = colors[name];
            ctx.lineWidth = 2;
            
            times.forEach((time, i) => {
                let x = marginLeft + i * scaleX;
                let y = canvas.height - marginBottom - time * scaleY;
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            ctx.stroke();
        });
    
        ctx.font = "18px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText("Sorting Algorithm Performance", canvas.width / 2, marginTop - 5);
    }
    
    drawGraph();
});

//-------------------------------------------------------------------
 
const visualizationCanvas = document.getElementById('visualizationCanvas');
visualizationCanvas.width = 800;
visualizationCanvas.height = 200;
document.body.insertBefore(visualizationCanvas, document.getElementById('visualization_section'));
const vizCtx = visualizationCanvas.getContext('2d');

let isSorting = false;
let currentArray = [];
let animationDelay = 50;  
function drawVisualization(array, highlights = {}) {
    vizCtx.clearRect(0, 0, visualizationCanvas.width, visualizationCanvas.height);
    const barWidth = visualizationCanvas.width / array.length;
    const maxHeight = Math.max(...array);
    const scale = visualizationCanvas.height / maxHeight;

    array.forEach((value, i) => {
        vizCtx.fillStyle = highlights[i] || '#2196f3';
        vizCtx.fillRect(
            i * barWidth,
            visualizationCanvas.height - value * scale,
            barWidth - 1,
            value * scale
        );
    });
}
 
async function quickSortVisualization(arr, low = 0, high = arr.length - 1) {
    if (low < high) {
        const pi = await partitionVisualization(arr, low, high);
        await quickSortVisualization(arr, low, pi - 1);
        await quickSortVisualization(arr, pi + 1, high);
    }
}

async function partitionVisualization(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
            drawVisualization(arr, { [i]: '#ff5722', [j]: '#4caf50' });
            await new Promise(resolve => setTimeout(resolve, animationDelay));
        }
    }
    
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    drawVisualization(arr, { [i + 1]: '#ff5722', [high]: '#4caf50' });
    await new Promise(resolve => setTimeout(resolve, animationDelay));
    return i + 1;
}
 
async function mergeSortVisualization(array) {
    if (array.length <= 1) return array;

    const middle = Math.floor(array.length / 2);
    const left = await mergeSortVisualization(array.slice(0, middle));
    const right = await mergeSortVisualization(array.slice(middle));
    
    return mergeVisualization(left, right);
}

async function mergeVisualization(left, right) {
    let result = [];
    let li = 0, ri = 0;
    
    while (li < left.length && ri < right.length) {
        if (left[li] < right[ri]) {
            result.push(left[li++]);
        } else {
            result.push(right[ri++]);
        }
        currentArray = [...result, ...left.slice(li), ...right.slice(ri)];
        drawVisualization(currentArray, { [result.length - 1]: '#ff5722' });
        await new Promise(resolve => setTimeout(resolve, animationDelay));
    }
    
    return result.concat(left.slice(li)).concat(right.slice(ri));
}
 
async function heapSortVisualization(array) {
    let arr = [...array];
    const n = arr.length;

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapifyVisualization(arr, n, i);
    }

    for (let i = n - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        drawVisualization(arr, { 0: '#ff5722', [i]: '#4caf50' });
        await new Promise(resolve => setTimeout(resolve, animationDelay));
        await heapifyVisualization(arr, i, 0);
    }
    return arr;
}

async function heapifyVisualization(arr, n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;

    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        drawVisualization(arr, { [i]: '#ff5722', [largest]: '#4caf50' });
        await new Promise(resolve => setTimeout(resolve, animationDelay));
        await heapifyVisualization(arr, n, largest);
    }
}
 
function createVisualizationControls() {
    const controls = document.getElementById('viz_controls');
    controls.style.margin = '20px';
    
    const algorithms = {
        'Quick Sort': quickSortVisualization,
        'Merge Sort': mergeSortVisualization,
        'Heap Sort': heapSortVisualization,
        'BST Sort': async () => {
            const sorted = sortWithBST(currentArray);
            for (let i = 0; i < sorted.length; i++) {
                currentArray[i] = sorted[i];
                drawVisualization(currentArray, { [i]: '#ff5722' });
                await new Promise(resolve => setTimeout(resolve, animationDelay));
            }
        }
    };

    Object.entries(algorithms).forEach(([name, func]) => {
        const btn = document.createElement('button');
        btn.textContent = name;
        btn.style.margin = '0 10px';
        btn.addEventListener('click', async () => {
            if (isSorting) return;
            isSorting = true;
            currentArray = generateRandomArray(50);
            drawVisualization(currentArray);
            await func(currentArray);
            isSorting = false;
        });
        controls.appendChild(btn);
    });

    document.body.insertBefore(controls, visualizationCanvas);
}
 
createVisualizationControls();