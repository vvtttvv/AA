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
        
        // Define margins
        const marginLeft = 50;
        const marginBottom = 50;
        const marginTop = 30;
        const marginRight = 20;
        const graphWidth = canvas.width - marginLeft - marginRight;
        const graphHeight = canvas.height - marginBottom - marginTop;
    
        // Find max time for scaling
        let maxTime = Math.max(...Object.values(results).flat());
        let scaleX = graphWidth / (sizes.length - 1);
        let scaleY = graphHeight / maxTime;
    
        // Draw axes
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        
        // Y-axis (Time in ms)
        ctx.beginPath();
        ctx.moveTo(marginLeft, marginTop);
        ctx.lineTo(marginLeft, canvas.height - marginBottom);
        ctx.stroke();
    
        // X-axis (Array sizes)
        ctx.beginPath();
        ctx.moveTo(marginLeft, canvas.height - marginBottom);
        ctx.lineTo(canvas.width - marginRight, canvas.height - marginBottom);
        ctx.stroke();
    
        // Draw grid and labels
        ctx.fillStyle = "black";
        ctx.font = "14px Arial";
    
        // Y-axis labels
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
    
        // X-axis labels (Array sizes)
        ctx.textAlign = "center";
        sizes.forEach((size, i) => {
            let x = marginLeft + i * scaleX;
            ctx.fillText(size, x, canvas.height - marginBottom + 20);
        });
    
        // Draw lines for sorting algorithms
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
    
        // Draw title
        ctx.font = "18px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText("Sorting Algorithm Performance", canvas.width / 2, marginTop - 5);
    }
    
    drawGraph();
});