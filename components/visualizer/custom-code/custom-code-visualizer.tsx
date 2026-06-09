"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Code,
  Terminal,
  PlayCircle,
  AlertCircle,
  Info,
  CheckCircle2,
  Gauge,
  Keyboard,
} from "lucide-react"

// ─── Templates ──────────────────────────────────────────────────────
const TEMPLATES: Record<string, { label: string; group: string; code: string; inputs: InputDef[] }> = {
  stack: {
    label: "Stack",
    group: "Data Structures",
    inputs: [{ id: "values", label: "Values (comma-separated)", placeholder: "10, 20, 30, 40, 50", default: "10, 20, 30, 40, 50" }],
    code: `// Stack Visualizer
function run() {
  const stack = new Stack();
  const values = INPUT.values;

  for (let i = 0; i < values.length; i++) {
    stack.push(values[i]);
  }

  stack.pop();
  stack.pop();
  stack.push(99);
}
`,
  },
  queue: {
    label: "Queue",
    group: "Data Structures",
    inputs: [{ id: "values", label: "Values (comma-separated)", placeholder: "A, B, C, D, E", default: "A, B, C, D, E" }],
    code: `// Queue Visualizer
function run() {
  const queue = new Queue();
  const values = INPUT.values;

  for (let i = 0; i < values.length; i++) {
    queue.enqueue(values[i]);
  }

  queue.dequeue();
  queue.dequeue();
  queue.enqueue("Z");
}
`,
  },
  linkedList: {
    label: "Linked List",
    group: "Data Structures",
    inputs: [{ id: "values", label: "Values (comma-separated)", placeholder: "10, 20, 30, 40", default: "10, 20, 30, 40" }],
    code: `// Linked List Visualizer
function run() {
  const list = new LinkedList();
  const values = INPUT.values;

  for (let i = 0; i < values.length; i++) {
    list.insertAtEnd(values[i]);
  }

  list.insertAtHead(5);
  list.delete(values[1]);
  list.insertAtEnd(99);
}
`,
  },
  doublyLinkedList: {
    label: "Doubly Linked List",
    group: "Data Structures",
    inputs: [{ id: "values", label: "Values (comma-separated)", placeholder: "10, 20, 30, 40", default: "10, 20, 30, 40" }],
    code: `// Doubly Linked List Visualizer
function run() {
  const list = new DoublyLinkedList();
  const values = INPUT.values;

  for (let i = 0; i < values.length; i++) {
    list.insertAtEnd(values[i]);
  }

  list.insertAtHead(5);
  list.delete(values[1]);
}
`,
  },
  bst: {
    label: "Binary Search Tree",
    group: "Data Structures",
    inputs: [{ id: "values", label: "Values (comma-separated numbers)", placeholder: "50, 30, 70, 20, 40, 60, 80", default: "50, 30, 70, 20, 40, 60, 80" }],
    code: `// BST Visualizer
function run() {
  const bst = new BST();
  const values = INPUT.values;

  for (let i = 0; i < values.length; i++) {
    bst.insert(values[i]);
  }

  bst.delete(values[1]);
}
`,
  },
  avlTree: {
    label: "AVL Tree",
    group: "Data Structures",
    inputs: [{ id: "values", label: "Values (comma-separated numbers)", placeholder: "30, 20, 10, 25, 40, 50", default: "30, 20, 10, 25, 40, 50" }],
    code: `// AVL Tree Visualizer (Self-Balancing BST)
function run() {
  const avl = new AVLTree();
  const values = INPUT.values;

  for (let i = 0; i < values.length; i++) {
    avl.insert(values[i]);
  }
}
`,
  },
  minHeap: {
    label: "Min Heap",
    group: "Data Structures",
    inputs: [{ id: "values", label: "Values (comma-separated numbers)", placeholder: "40, 20, 30, 10, 50, 15", default: "40, 20, 30, 10, 50, 15" }],
    code: `// Min Heap Visualizer
function run() {
  const heap = new MinHeap();
  const values = INPUT.values;

  for (let i = 0; i < values.length; i++) {
    heap.insert(values[i]);
  }

  heap.extractMin();
  heap.insert(5);
}
`,
  },
  maxHeap: {
    label: "Max Heap",
    group: "Data Structures",
    inputs: [{ id: "values", label: "Values (comma-separated numbers)", placeholder: "10, 20, 15, 30, 40, 5", default: "10, 20, 15, 30, 40, 5" }],
    code: `// Max Heap Visualizer
function run() {
  const heap = new MaxHeap();
  const values = INPUT.values;

  for (let i = 0; i < values.length; i++) {
    heap.insert(values[i]);
  }

  heap.extractMax();
  heap.insert(99);
}
`,
  },
  graph: {
    label: "Graph (Adjacency)",
    group: "Data Structures",
    inputs: [
      { id: "nodes", label: "Nodes (comma-separated)", placeholder: "A, B, C, D, E", default: "A, B, C, D, E" },
      { id: "edges", label: "Edges (from-to-weight, semicolon-separated)", placeholder: "A-B-4; A-C-2; B-D-3; C-D-1; D-E-5", default: "A-B-4; A-C-2; B-D-3; C-D-1; D-E-5" },
    ],
    code: `// Graph Visualizer
function run() {
  const graph = new Graph();
  const nodes = INPUT.nodes;
  const edges = INPUT.edges;

  for (let i = 0; i < nodes.length; i++) {
    graph.addNode(nodes[i]);
  }

  for (let i = 0; i < edges.length; i++) {
    const e = edges[i];
    graph.addEdge(e.from, e.to, e.weight);
  }
}
`,
  },
  dijkstra: {
    label: "Dijkstra's Algorithm",
    group: "Algorithms",
    inputs: [
      { id: "nodes", label: "Nodes (comma-separated)", placeholder: "A, B, C, D, E", default: "A, B, C, D, E" },
      { id: "edges", label: "Edges (from-to-weight; ...)", placeholder: "A-B-4; A-C-2; B-D-3; C-D-1; C-E-6; D-E-2", default: "A-B-4; A-C-2; B-D-3; C-D-1; C-E-6; D-E-2" },
      { id: "start", label: "Start Node", placeholder: "A", default: "A" },
      { id: "end", label: "End Node", placeholder: "E", default: "E" },
    ],
    code: `// Dijkstra's Shortest Path
function run() {
  const graph = new Graph();
  const nodes = INPUT.nodes;
  const edges = INPUT.edges;

  for (let i = 0; i < nodes.length; i++) {
    graph.addNode(nodes[i]);
  }

  for (let i = 0; i < edges.length; i++) {
    const e = edges[i];
    graph.addEdge(e.from, e.to, e.weight);
  }

  graph.dijkstra(INPUT.start, INPUT.end);
}
`,
  },
  bfs: {
    label: "BFS Traversal",
    group: "Algorithms",
    inputs: [
      { id: "nodes", label: "Nodes (comma-separated)", placeholder: "A, B, C, D, E, F", default: "A, B, C, D, E, F" },
      { id: "edges", label: "Edges (from-to; ...)", placeholder: "A-B; A-C; B-D; B-E; C-F", default: "A-B; A-C; B-D; B-E; C-F" },
      { id: "start", label: "Start Node", placeholder: "A", default: "A" },
    ],
    code: `// BFS (Breadth-First Search)
function run() {
  const graph = new Graph();
  const nodes = INPUT.nodes;
  const edges = INPUT.edges;

  for (let i = 0; i < nodes.length; i++) {
    graph.addNode(nodes[i]);
  }

  for (let i = 0; i < edges.length; i++) {
    const e = edges[i];
    graph.addEdge(e.from, e.to, 1);
  }

  graph.bfs(INPUT.start);
}
`,
  },
  dfs: {
    label: "DFS Traversal",
    group: "Algorithms",
    inputs: [
      { id: "nodes", label: "Nodes (comma-separated)", placeholder: "A, B, C, D, E, F", default: "A, B, C, D, E, F" },
      { id: "edges", label: "Edges (from-to; ...)", placeholder: "A-B; A-C; B-D; B-E; C-F", default: "A-B; A-C; B-D; B-E; C-F" },
      { id: "start", label: "Start Node", placeholder: "A", default: "A" },
    ],
    code: `// DFS (Depth-First Search)
function run() {
  const graph = new Graph();
  const nodes = INPUT.nodes;
  const edges = INPUT.edges;

  for (let i = 0; i < nodes.length; i++) {
    graph.addNode(nodes[i]);
  }

  for (let i = 0; i < edges.length; i++) {
    const e = edges[i];
    graph.addEdge(e.from, e.to, 1);
  }

  graph.dfs(INPUT.start);
}
`,
  },
  bubbleSort: {
    label: "Bubble Sort",
    group: "Algorithms",
    inputs: [{ id: "values", label: "Values (comma-separated numbers)", placeholder: "64, 34, 25, 12, 22, 11, 90", default: "64, 34, 25, 12, 22, 11, 90" }],
    code: `// Bubble Sort Visualizer
function run() {
  const arr = new ArrayDS(INPUT.values);

  const n = arr.length();
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      arr.compare(j, j + 1);
      if (arr.get(j) > arr.get(j + 1)) {
        arr.swap(j, j + 1);
      }
    }
  }
}
`,
  },
  selectionSort: {
    label: "Selection Sort",
    group: "Algorithms",
    inputs: [{ id: "values", label: "Values (comma-separated numbers)", placeholder: "64, 25, 12, 22, 11", default: "64, 25, 12, 22, 11" }],
    code: `// Selection Sort Visualizer
function run() {
  const arr = new ArrayDS(INPUT.values);

  const n = arr.length();
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      arr.compare(minIdx, j);
      if (arr.get(j) < arr.get(minIdx)) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      arr.swap(i, minIdx);
    }
  }
}
`,
  },
  insertionSort: {
    label: "Insertion Sort",
    group: "Algorithms",
    inputs: [{ id: "values", label: "Values (comma-separated numbers)", placeholder: "12, 11, 13, 5, 6", default: "12, 11, 13, 5, 6" }],
    code: `// Insertion Sort Visualizer
function run() {
  const arr = new ArrayDS(INPUT.values);

  const n = arr.length();
  for (let i = 1; i < n; i++) {
    const key = arr.get(i);
    let j = i - 1;
    while (j >= 0 && arr.get(j) > key) {
      arr.set(j + 1, arr.get(j));
      j = j - 1;
    }
    arr.set(j + 1, key);
  }
}
`,
  },
  linearSearch: {
    label: "Linear Search",
    group: "Algorithms",
    inputs: [
      { id: "values", label: "Array (comma-separated)", placeholder: "10, 23, 45, 7, 32, 18, 56", default: "10, 23, 45, 7, 32, 18, 56" },
      { id: "target", label: "Search Target", placeholder: "32", default: "32" },
    ],
    code: `// Linear Search Visualizer
function run() {
  const arr = new ArrayDS(INPUT.values);
  const target = INPUT.target;

  for (let i = 0; i < arr.length(); i++) {
    arr.highlight(i);
    if (arr.get(i) == target) {
      arr.found(i, target);
      return;
    }
  }
  arr.notFound(target);
}
`,
  },
  binarySearch: {
    label: "Binary Search",
    group: "Algorithms",
    inputs: [
      { id: "values", label: "Sorted Array (comma-separated)", placeholder: "2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91", default: "2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91" },
      { id: "target", label: "Search Target", placeholder: "23", default: "23" },
    ],
    code: `// Binary Search Visualizer
function run() {
  const arr = new ArrayDS(INPUT.values);
  const target = INPUT.target;
  let low = 0;
  let high = arr.length() - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    arr.highlight(mid);

    if (arr.get(mid) == target) {
      arr.found(mid, target);
      return;
    } else if (arr.get(mid) < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  arr.notFound(target);
}
`,
  },
  infixToPostfix: {
    label: "Infix to Postfix",
    group: "Algorithms",
    inputs: [{ id: "expr", label: "Infix Expression", placeholder: "A + B * C - (D / E)", default: "A + B * C - (D / E)" }],
    code: `// Infix to Postfix Conversion
function run() {
  const converter = new InfixToPostfix();

  converter.convert(INPUT.expr);
}
`,
  },
  huffman: {
    label: "Huffman Encoding",
    group: "Algorithms",
    inputs: [{ id: "text", label: "Text to encode", placeholder: "hello world", default: "hello world" }],
    code: `// Huffman Encoding Visualizer
function run() {
  const huffman = new HuffmanEncoder();

  huffman.encode(INPUT.text);
}
`,
  },
  fibonacci: {
    label: "Fibonacci (DP)",
    group: "Dynamic Programming",
    inputs: [{ id: "n", label: "n (Fibonacci number index)", placeholder: "6", default: "6" }],
    code: `// Fibonacci (DP)
function run() {
  const n = INPUT.n;
  const dp = new ArrayDS(Array(n + 1).fill(0));
  
  dp.set(0, 0);
  if (n > 0) {
    dp.set(1, 1);
    for (let i = 2; i <= n; i++) {
      dp.compare(i - 1, i - 2);
      dp.set(i, dp.get(i - 1) + dp.get(i - 2));
    }
  }
}
`,
  },
  knapsack: {
    label: "0/1 Knapsack (DP)",
    group: "Dynamic Programming",
    inputs: [
      { id: "weights", label: "Weights (comma-separated)", placeholder: "1, 2, 3, 5", default: "1, 2, 3, 5" },
      { id: "values", label: "Values (comma-separated)", placeholder: "1, 6, 18, 22", default: "1, 6, 18, 22" },
      { id: "capacity", label: "Capacity", placeholder: "7", default: "7" }
    ],
    code: `// 0/1 Knapsack (DP)
function run() {
  const weights = INPUT.weights;
  const values = INPUT.values;
  const W = INPUT.capacity;
  const n = weights.length;
  
  const dp = new DPTable(n + 1, W + 1, 0, "Knapsack DP Table");
  
  const rowHeaders = ["0 (None)"];
  for (let i = 1; i <= n; i++) {
    rowHeaders.push(\`Item \${i} (w=\${weights[i-1]}, v=\${values[i-1]})\`);
  }
  const colHeaders = Array.from({length: W + 1}, (_, i) => \`W=\${i}\`);
  dp.setHeaders(rowHeaders, colHeaders);
  
  for (let i = 1; i <= n; i++) {
    const w = weights[i - 1];
    const v = values[i - 1];
    for (let j = 0; j <= W; j++) {
      if (w <= j) {
        dp.highlight(i - 1, j - w);
        dp.highlight(i - 1, j);
        const valWith = v + dp.get(i - 1, j - w);
        const valWithout = dp.get(i - 1, j);
        dp.set(i, j, Math.max(valWith, valWithout));
      } else {
        dp.highlight(i - 1, j);
        dp.set(i, j, dp.get(i - 1, j));
      }
    }
  }
}
`,
  },
  lcs: {
    label: "Longest Common Subsequence",
    group: "Dynamic Programming",
    inputs: [
      { id: "text1", label: "Text 1", placeholder: "stone", default: "stone" },
      { id: "text2", label: "Text 2", placeholder: "longest", default: "longest" }
    ],
    code: `// Longest Common Subsequence (DP)
function run() {
  const s1 = INPUT.text1;
  const s2 = INPUT.text2;
  const m = s1.length;
  const n = s2.length;
  
  const dp = new DPTable(m + 1, n + 1, 0, "LCS DP Table");
  
  const rowHeaders = ["-", ...s1.split("")];
  const colHeaders = ["-", ...s2.split("")];
  dp.setHeaders(rowHeaders, colHeaders);
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp.highlight(i - 1, j - 1);
        dp.set(i, j, dp.get(i - 1, j - 1) + 1);
      } else {
        dp.highlight(i - 1, j);
        dp.highlight(i, j - 1);
        dp.set(i, j, Math.max(dp.get(i - 1, j), dp.get(i, j - 1)));
      }
    }
  }
}
`,
  },
  mergeSort: {
    label: "Merge Sort",
    group: "Algorithms",
    inputs: [{ id: "values", label: "Values (comma-separated numbers)", placeholder: "38, 27, 43, 3, 9, 82, 10", default: "38, 27, 43, 3, 9, 82, 10" }],
    code: `// Merge Sort Visualizer
function run() {
  const arr = new ArrayDS(INPUT.values);
  
  function mergeSort(l, r) {
    if (l >= r) return;
    const m = Math.floor((l + r) / 2);
    mergeSort(l, m);
    mergeSort(m + 1, r);
    merge(l, m, r);
  }
  
  function merge(l, m, r) {
    const temp = [];
    let i = l, j = m + 1;
    while (i <= m && j <= r) {
      arr.compare(i, j);
      if (arr.get(i) <= arr.get(j)) {
        temp.push(arr.get(i));
        i++;
      } else {
        temp.push(arr.get(j));
        j++;
      }
    }
    while (i <= m) {
      temp.push(arr.get(i));
      i++;
    }
    while (j <= r) {
      temp.push(arr.get(j));
      j++;
    }
    
    for (let k = 0; k < temp.length; k++) {
      arr.set(l + k, temp[k]);
    }
  }
  
  mergeSort(0, arr.length() - 1);
}
`,
  },
  quickSort: {
    label: "Quick Sort",
    group: "Algorithms",
    inputs: [{ id: "values", label: "Values (comma-separated numbers)", placeholder: "10, 80, 30, 90, 40, 50, 70", default: "10, 80, 30, 90, 40, 50, 70" }],
    code: `// Quick Sort Visualizer
function run() {
  const arr = new ArrayDS(INPUT.values);
  
  function quickSort(low, high) {
    if (low < high) {
      const pi = partition(low, high);
      quickSort(low, pi - 1);
      quickSort(pi + 1, high);
    }
  }
  
  function partition(low, high) {
    const pivot = arr.get(high);
    arr.highlight(high);
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
      arr.compare(j, high);
      if (arr.get(j) < pivot) {
        i++;
        arr.swap(i, j);
      }
    }
    arr.swap(i + 1, high);
    return i + 1;
  }
  
  quickSort(0, arr.length() - 1);
}
`,
  },
}

interface InputDef {
  id: string
  label: string
  placeholder: string
  default: string
}

// ─── Types ──────────────────────────────────────────────────────────
interface Step {
  lineNumber: number
  dataStructures: DSState[]
  message: string
}

type DSState =
  | { id: string; type: "Stack"; items: any[] }
  | { id: string; type: "Queue"; items: any[] }
  | { id: string; type: "LinkedList"; nodes: { id: string; value: any }[]; doubly?: boolean }
  | { id: string; type: "BST"; root: BSTNodeState | null; label?: string }
  | { id: string; type: "Heap"; items: number[]; heapType: string; root: BSTNodeState | null }
  | { id: string; type: "Graph"; nodes: GNodeState[]; edges: GEdgeState[]; highlights?: string[]; pathEdges?: string[] }
  | { id: string; type: "Array"; items: any[]; highlights?: number[]; found?: number; label?: string }
  | { id: string; type: "InfixState"; stack: string[]; output: string[]; input: string; pos: number }
  | { id: string; type: "HuffmanState"; codes: Record<string, string>; freqs: Record<string, number>; message: string }
  | { id: string; type: "DPTable"; rows: number; cols: number; data: any[][]; highlights?: [number, number][]; rowHeaders?: string[]; colHeaders?: string[]; label?: string }

interface BSTNodeState {
  id: string; value: any; left: BSTNodeState | null; right: BSTNodeState | null; height?: number
}
interface GNodeState { id: string; label: string; dist?: number; visited?: boolean }
interface GEdgeState { from: string; to: string; weight: number }

// ─── Main Component ─────────────────────────────────────────────────
export function CustomCodeVisualizer() {
  const [templateType, setTemplateType] = useState("stack")
  const [code, setCode] = useState(TEMPLATES.stack.code)
  const [steps, setSteps] = useState<Step[]>([])
  const [currentStepIndex, setCurrentStepIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(800)
  const [error, setError] = useState<string | null>(null)
  const [activeDsTabId, setActiveDsTabId] = useState<string | null>(null)
  const [inputValues, setInputValues] = useState<Record<string, string>>({})

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const gutterRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const stepsRef = useRef<Step[]>([])

  useEffect(() => { stepsRef.current = steps }, [steps])

  // Load prefill template from localStorage if exists
  useEffect(() => {
    try {
      const prefill = localStorage.getItem("sys_custom_code_template")
      if (prefill && TEMPLATES[prefill]) {
        setTemplateType(prefill)
        setCode(TEMPLATES[prefill].code)
        localStorage.removeItem("sys_custom_code_template")
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  // Initialize input defaults
  useEffect(() => {
    const tmpl = TEMPLATES[templateType]
    if (tmpl) {
      const defaults: Record<string, string> = {}
      tmpl.inputs.forEach(inp => { defaults[inp.id] = inp.default })
      setInputValues(defaults)
    }
  }, [templateType])

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (gutterRef.current) gutterRef.current.scrollTop = e.currentTarget.scrollTop
  }

  const handleTemplateChange = (val: string) => {
    setTemplateType(val)
    setCode(TEMPLATES[val].code)
    resetExecution()
  }

  const resetExecution = () => {
    setSteps([]); setCurrentStepIndex(-1); setError(null); setIsPlaying(false); setActiveDsTabId(null)
  }

  // ─── Parse user inputs ────────────────────────────────────────────
  const parseInputs = (): Record<string, any> => {
    const result: Record<string, any> = {}
    const tmpl = TEMPLATES[templateType]
    for (const inp of tmpl.inputs) {
      const raw = (inputValues[inp.id] ?? inp.default).trim()
      if (inp.id === "values" || inp.id === "nodes" || inp.id === "weights") {
        result[inp.id] = raw.split(",").map(v => {
          const t = v.trim()
          const n = Number(t)
          return isNaN(n) ? t : n
        })
      } else if (inp.id === "edges") {
        result[inp.id] = raw.split(";").map(e => {
          const parts = e.trim().split("-")
          return { from: parts[0]?.trim(), to: parts[1]?.trim(), weight: Number(parts[2]?.trim()) || 1 }
        }).filter(e => e.from && e.to)
      } else if (inp.id === "target" || inp.id === "n" || inp.id === "capacity") {
        const n = Number(raw)
        result[inp.id] = isNaN(n) ? raw : n
      } else {
        result[inp.id] = raw
      }
    }
    return result
  }

  // ─── Instrumenter ─────────────────────────────────────────────────
  const instrumentCode = (src: string): string => {
    return src.split("\n").map((line, idx) => {
      const ln = idx + 1; const t = line.trim()
      if (!t || t.startsWith("//") || t.startsWith("/*") || t.startsWith("*") || t === "{" || t === "}") return line
      if (/^\b(else|catch|finally)\b/.test(t)) { return t.includes("{") ? line.replace("{", `{ __trace(${ln});`) : line }
      if (/^\b(function|if|for|while|switch)\b/.test(t)) { return t.includes("{") ? line.replace("{", `{ __trace(${ln});`) : line }
      return line + ` __trace(${ln});`
    }).join("\n")
  }

  // ─── Compile & Run ────────────────────────────────────────────────
  const handleRun = () => {
    setError(null); setIsPlaying(false)
    try {
      const localSteps: Step[] = []
      const dsInstances: any[] = []
      let lastAction = ""
      const registerDS = (i: any) => dsInstances.push(i)
      const logAction = (m: string) => { lastAction = m }

      const trace = (lineNum: number) => {
        if (localSteps.length > 800) throw new Error("Step limit exceeded (800). Possible infinite loop.")
        const snap = dsInstances.map(d => cloneDS(d)).filter(Boolean) as DSState[]
        localSteps.push({ lineNumber: lineNum, dataStructures: snap, message: lastAction || `Line ${lineNum}` })
        lastAction = ""
      }

      // ── Stack ─────────────────────────────────────────────────
      class Stack {
        items: any[] = []; id = uid("stk"); type = "Stack" as const
        constructor() { registerDS(this) }
        push(v: any) { this.items.push(v); logAction(`Push ${v}`) }
        pop() { if (!this.items.length) { logAction("Pop: empty"); return undefined }; const v = this.items.pop(); logAction(`Pop ${v}`); return v }
        peek() { return this.items[this.items.length - 1] }
        isEmpty() { return !this.items.length }
        size() { return this.items.length }
        toArray() { return [...this.items] }
      }

      // ── Queue ─────────────────────────────────────────────────
      class Queue {
        items: any[] = []; id = uid("que"); type = "Queue" as const
        constructor() { registerDS(this) }
        enqueue(v: any) { this.items.push(v); logAction(`Enqueue ${v}`) }
        dequeue() { if (!this.items.length) { logAction("Dequeue: empty"); return undefined }; const v = this.items.shift(); logAction(`Dequeue ${v}`); return v }
        front() { return this.items[0] }
        isEmpty() { return !this.items.length }
        size() { return this.items.length }
      }

      // ── Linked List ───────────────────────────────────────────
      class LLNode { id = uid("n"); value: any; next: LLNode | null = null; constructor(v: any) { this.value = v } }
      class LinkedList {
        head: LLNode | null = null; id = uid("ll"); type = "LinkedList" as const
        constructor() { registerDS(this) }
        insertAtEnd(v: any) { const n = new LLNode(v); if (!this.head) this.head = n; else { let c = this.head; while (c.next) c = c.next; c.next = n }; logAction(`Insert ${v} at end`) }
        insertAtHead(v: any) { const n = new LLNode(v); n.next = this.head; this.head = n; logAction(`Insert ${v} at head`) }
        delete(v: any) { if (!this.head) { logAction(`Delete ${v}: empty`); return }; if (this.head.value === v) { this.head = this.head.next; logAction(`Delete ${v}`); return }; let c = this.head; while (c.next && c.next.value !== v) c = c.next; if (c.next) { c.next = c.next.next; logAction(`Delete ${v}`) } else logAction(`${v} not found`) }
      }

      // ── Doubly Linked List ────────────────────────────────────
      class DLLNode { id = uid("dn"); value: any; next: DLLNode | null = null; prev: DLLNode | null = null; constructor(v: any) { this.value = v } }
      class DoublyLinkedList {
        head: DLLNode | null = null; id = uid("dll"); type = "LinkedList" as const; doubly = true
        constructor() { registerDS(this) }
        insertAtEnd(v: any) { const n = new DLLNode(v); if (!this.head) this.head = n; else { let c = this.head; while (c.next) c = c.next; c.next = n; n.prev = c }; logAction(`Insert ${v} at end`) }
        insertAtHead(v: any) { const n = new DLLNode(v); n.next = this.head; if (this.head) this.head.prev = n; this.head = n; logAction(`Insert ${v} at head`) }
        delete(v: any) { if (!this.head) return; let c: DLLNode | null = this.head; while (c && c.value !== v) c = c.next; if (!c) return; if (c.prev) c.prev.next = c.next; else this.head = c.next; if (c.next) c.next.prev = c.prev; logAction(`Delete ${v}`) }
      }

      // ── BST ───────────────────────────────────────────────────
      class BNode { id = uid("b"); value: any; left: BNode | null = null; right: BNode | null = null; constructor(v: any) { this.value = v } }
      class BST {
        root: BNode | null = null; id = uid("bst"); type = "BST" as const
        constructor() { registerDS(this) }
        insert(v: any) { const n = new BNode(v); if (!this.root) { this.root = n; logAction(`Insert root ${v}`); return }; let c = this.root; while (true) { if (v < c.value) { if (!c.left) { c.left = n; logAction(`Insert ${v} left of ${c.value}`); break }; c = c.left } else { if (!c.right) { c.right = n; logAction(`Insert ${v} right of ${c.value}`); break }; c = c.right } } }
        delete(v: any) { const del = (n: BNode | null, val: any): BNode | null => { if (!n) return null; if (val < n.value) { n.left = del(n.left, val); return n }; if (val > n.value) { n.right = del(n.right, val); return n }; if (!n.left && !n.right) return null; if (!n.left) return n.right; if (!n.right) return n.left; let m = n.right; while (m.left) m = m.left; n.value = m.value; n.right = del(n.right, m.value); return n }; this.root = del(this.root, v); logAction(`Delete ${v}`) }
        search(v: any) { let c = this.root; while (c) { if (v === c.value) { logAction(`Found ${v}`); return true }; c = v < c.value ? c.left : c.right }; logAction(`${v} not found`); return false }
      }

      // ── AVL Tree ──────────────────────────────────────────────
      class AVLNode { id = uid("av"); value: any; left: AVLNode | null = null; right: AVLNode | null = null; height = 1; constructor(v: any) { this.value = v } }
      class AVLTree {
        root: AVLNode | null = null; id = uid("avl"); type = "BST" as const; label = "AVL Tree"
        constructor() { registerDS(this) }
        _h(n: AVLNode | null): number { return n ? n.height : 0 }
        _uh(n: AVLNode) { n.height = 1 + Math.max(this._h(n.left), this._h(n.right)) }
        _bf(n: AVLNode | null): number { return n ? this._h(n.left) - this._h(n.right) : 0 }
        _rr(y: AVLNode): AVLNode { const x = y.left!; y.left = x.right; x.right = y; this._uh(y); this._uh(x); logAction(`Right rotation at ${y.value}`); return x }
        _lr(x: AVLNode): AVLNode { const y = x.right!; x.right = y.left; y.left = x; this._uh(x); this._uh(y); logAction(`Left rotation at ${x.value}`); return y }
        _ins(n: AVLNode | null, v: any): AVLNode {
          if (!n) return new AVLNode(v)
          if (v < n.value) n.left = this._ins(n.left, v); else n.right = this._ins(n.right, v)
          this._uh(n); const b = this._bf(n)
          if (b > 1 && v < n.left!.value) return this._rr(n)
          if (b < -1 && v >= n.right!.value) return this._lr(n)
          if (b > 1 && v >= n.left!.value) { n.left = this._lr(n.left!); return this._rr(n) }
          if (b < -1 && v < n.right!.value) { n.right = this._rr(n.right!); return this._lr(n) }
          return n
        }
        insert(v: any) { this.root = this._ins(this.root, v); logAction(`Insert ${v} into AVL`) }
      }

      // ── Heap ──────────────────────────────────────────────────
      class HeapBase {
        items: number[] = []; id: string; type = "Heap" as const; heapType: string
        constructor(ht: string) { this.heapType = ht; this.id = uid("heap"); registerDS(this) }
        _cmp(a: number, b: number): boolean { return this.heapType === "min" ? a < b : a > b }
        _up(i: number) { let p = Math.floor((i - 1) / 2); while (i > 0 && this._cmp(this.items[i], this.items[p])) { [this.items[i], this.items[p]] = [this.items[p], this.items[i]]; i = p; p = Math.floor((i - 1) / 2) } }
        _down(i: number) { const n = this.items.length; let best = i; const l = 2 * i + 1; const r = 2 * i + 2; if (l < n && this._cmp(this.items[l], this.items[best])) best = l; if (r < n && this._cmp(this.items[r], this.items[best])) best = r; if (best !== i) { [this.items[i], this.items[best]] = [this.items[best], this.items[i]]; this._down(best) } }
        _toTree(i: number = 0): BSTNodeState | null { if (i >= this.items.length) return null; return { id: `hn-${i}`, value: this.items[i], left: this._toTree(2 * i + 1), right: this._toTree(2 * i + 2) } }
        insert(v: number) { this.items.push(v); this._up(this.items.length - 1); logAction(`Insert ${v} into ${this.heapType} heap`) }
        extractMin() { return this._extract("min") }
        extractMax() { return this._extract("max") }
        _extract(label: string) { if (!this.items.length) { logAction(`Extract from empty heap`); return undefined }; const v = this.items[0]; this.items[0] = this.items[this.items.length - 1]; this.items.pop(); this._down(0); logAction(`Extract${label === "min" ? "Min" : "Max"} ${v}`); return v }
        peek() { return this.items[0] }
        size() { return this.items.length }
      }
      class MinHeap extends HeapBase { constructor() { super("min") } }
      class MaxHeap extends HeapBase { constructor() { super("max") } }

      // ── Graph ─────────────────────────────────────────────────
      class GraphDS {
        _nodes: Map<string, { label: string; dist: number; visited: boolean }> = new Map()
        _edges: GEdgeState[] = []; id = uid("gr"); type = "Graph" as const
        _highlights: string[] = []; _pathEdges: string[] = []
        constructor() { registerDS(this) }
        addNode(label: string) { this._nodes.set(label, { label, dist: Infinity, visited: false }); logAction(`Add node ${label}`) }
        addEdge(from: string, to: string, weight: number = 1) { this._edges.push({ from, to, weight }); this._edges.push({ from: to, to: from, weight }); logAction(`Add edge ${from}↔${to} (w=${weight})`) }
        _neighbors(id: string) { return this._edges.filter(e => e.from === id).map(e => ({ node: e.to, weight: e.weight })) }
        dijkstra(start: string, end: string) {
          const dist: Record<string, number> = {}; const prev: Record<string, string | null> = {}; const unvisited = new Set<string>()
          this._nodes.forEach((_, k) => { dist[k] = k === start ? 0 : Infinity; prev[k] = null; unvisited.add(k) })
          this._nodes.forEach((v, k) => { v.dist = dist[k] })
          logAction(`Init Dijkstra from ${start}`)
          let current: string | null = start
          while (current && unvisited.size) {
            const nd = this._nodes.get(current)!; nd.visited = true; unvisited.delete(current); this._highlights = [current]
            if (current === end) { logAction(`Reached ${end} dist=${dist[end]}`); break }
            for (const { node: nb, weight } of this._neighbors(current)) {
              if (unvisited.has(nb)) { const alt = dist[current] + weight; if (alt < dist[nb]) { dist[nb] = alt; prev[nb] = current; this._nodes.get(nb)!.dist = alt } }
            }
            logAction(`Visit ${current} — update neighbors`)
            let mn = Infinity; let nxt: string | null = null; for (const u of unvisited) { if (dist[u] < mn) { mn = dist[u]; nxt = u } }; current = nxt
          }
          const path: string[] = []; let p: string | null = end; while (p) { path.unshift(p); p = prev[p] }
          this._pathEdges = []; for (let i = 0; i < path.length - 1; i++) this._pathEdges.push(`${path[i]}-${path[i + 1]}`)
          this._highlights = path
          logAction(`Shortest path: ${path.join(" → ")} (dist=${dist[end]})`)
        }
        bfs(start: string) {
          const visited = new Set<string>(); const queue: string[] = [start]; visited.add(start); const nd = this._nodes.get(start); if (nd) nd.visited = true
          logAction(`BFS start from ${start}`)
          while (queue.length) {
            const curr = queue.shift()!; this._highlights = [curr]; logAction(`Visit ${curr}`)
            for (const { node: nb } of this._neighbors(curr)) { if (!visited.has(nb)) { visited.add(nb); queue.push(nb); const n = this._nodes.get(nb); if (n) n.visited = true } }
          }
          logAction("BFS complete")
        }
        dfs(start: string) {
          const visited = new Set<string>()
          const visit = (curr: string) => {
            visited.add(curr); const nd = this._nodes.get(curr); if (nd) nd.visited = true; this._highlights = [curr]; logAction(`Visit ${curr}`)
            for (const { node: nb } of this._neighbors(curr)) { if (!visited.has(nb)) visit(nb) }
          }
          logAction(`DFS start from ${start}`); visit(start); logAction("DFS complete")
        }
      }

      // ── Array DS ──────────────────────────────────────────────
      class ArrayDS {
        items: any[]; id = uid("arr"); type = "Array" as const; _hl: number[] = []; _found = -1; _label = ""
        constructor(values: any[]) { this.items = [...values]; registerDS(this) }
        length() { return this.items.length }
        get(i: number) { return this.items[i] }
        set(i: number, v: any) { this.items[i] = v; logAction(`Set [${i}] = ${v}`) }
        swap(i: number, j: number) { [this.items[i], this.items[j]] = [this.items[j], this.items[i]]; this._hl = [i, j]; logAction(`Swap [${i}]↔[${j}]: ${this.items[i]}, ${this.items[j]}`) }
        compare(i: number, j: number) { this._hl = [i, j]; logAction(`Compare [${i}]=${this.items[i]} vs [${j}]=${this.items[j]}`) }
        highlight(i: number) { this._hl = [i]; logAction(`Check [${i}] = ${this.items[i]}`) }
        found(i: number, v: any) { this._found = i; logAction(`Found ${v} at index ${i}`) }
        notFound(v: any) { this._found = -1; logAction(`${v} not found`) }
      }

      // ── Infix to Postfix ──────────────────────────────────────
      class InfixToPostfix {
        id = uid("inf"); type = "InfixState" as const; _stack: string[] = []; _output: string[] = []; _input = ""; _pos = 0
        constructor() { registerDS(this) }
        _prec(op: string): number { if (op === '+' || op === '-') return 1; if (op === '*' || op === '/') return 2; if (op === '^') return 3; return 0 }
        convert(expr: string) {
          this._input = expr; const tokens = expr.replace(/\s+/g, "").split("")
          for (let i = 0; i < tokens.length; i++) {
            const ch = tokens[i]; this._pos = i
            if (/[a-zA-Z0-9]/.test(ch)) { this._output.push(ch); logAction(`Operand ${ch} → output`) }
            else if (ch === "(") { this._stack.push(ch); logAction(`Push ( to stack`) }
            else if (ch === ")") { while (this._stack.length && this._stack[this._stack.length - 1] !== "(") { this._output.push(this._stack.pop()!) }; this._stack.pop(); logAction(`Pop until ( → output`) }
            else { while (this._stack.length && this._prec(this._stack[this._stack.length - 1]) >= this._prec(ch)) { this._output.push(this._stack.pop()!) }; this._stack.push(ch); logAction(`Operator ${ch}`) }
          }
          while (this._stack.length) { this._output.push(this._stack.pop()!) }
          logAction(`Result: ${this._output.join(" ")}`)
        }
      }

      // ── Huffman ───────────────────────────────────────────────
      class HuffmanEncoder {
        id = uid("huf"); type = "HuffmanState" as const; _codes: Record<string, string> = {}; _freqs: Record<string, number> = {}; _msg = ""
        constructor() { registerDS(this) }
        encode(text: string) {
          const freq: Record<string, number> = {}; for (const ch of text) freq[ch] = (freq[ch] || 0) + 1; this._freqs = freq; logAction(`Frequency count: ${Object.entries(freq).map(([k, v]) => `'${k}'=${v}`).join(", ")}`)
          interface HN { ch: string | null; freq: number; left: HN | null; right: HN | null }
          let pq: HN[] = Object.entries(freq).map(([ch, f]) => ({ ch, freq: f, left: null, right: null })).sort((a, b) => a.freq - b.freq)
          while (pq.length > 1) { const l = pq.shift()!; const r = pq.shift()!; const p: HN = { ch: null, freq: l.freq + r.freq, left: l, right: r }; pq.push(p); pq.sort((a, b) => a.freq - b.freq); logAction(`Merge freq ${l.freq} + ${r.freq} = ${p.freq}`) }
          const codes: Record<string, string> = {}
          const assign = (n: HN, code: string) => { if (n.ch) { codes[n.ch] = code || "0"; return }; if (n.left) assign(n.left, code + "0"); if (n.right) assign(n.right, code + "1") }
          if (pq.length) assign(pq[0], "")
          this._codes = codes; logAction(`Codes: ${Object.entries(codes).map(([k, v]) => `'${k}'=${v}`).join(", ")}`)
          const encoded = text.split("").map(ch => codes[ch]).join(""); logAction(`Encoded: ${encoded} (${encoded.length} bits vs ${text.length * 8} bits orig)`)
        }
      }

      // ── DP Table ──────────────────────────────────────────────
      class DPTable {
        rows: number; cols: number; data: any[][]; id = uid("dpt"); type = "DPTable" as const
        _hl: [number, number][] = []; _rowHeaders?: string[]; _colHeaders?: string[]; _label = ""
        constructor(rows: number, cols: number, defaultValue: any = 0, label: string = "DP Table") {
          this.rows = rows; this.cols = cols; this.data = Array.from({ length: rows }, () => Array(cols).fill(defaultValue))
          this._label = label; registerDS(this)
        }
        set(r: number, c: number, val: any) {
          if (r >= 0 && r < this.rows && c >= 0 && c < this.cols) { this.data[r][c] = val; this._hl = [[r, c]]; logAction(`Set DP[${r}][${c}] = ${val}`) }
        }
        get(r: number, c: number) { return r >= 0 && r < this.rows && c >= 0 && c < this.cols ? this.data[r][c] : undefined }
        highlight(r: number, c: number) { this._hl = [[r, c]]; logAction(`Highlight DP[${r}][${c}]`) }
        setHeaders(rowHeaders: string[], colHeaders: string[]) { this._rowHeaders = rowHeaders; this._colHeaders = colHeaders }
      }

      const INPUT = parseInputs()
      const instrumented = instrumentCode(code)
      const fn = new Function("Stack", "Queue", "LinkedList", "DoublyLinkedList", "BST", "AVLTree", "MinHeap", "MaxHeap", "Graph", "ArrayDS", "InfixToPostfix", "HuffmanEncoder", "DPTable", "INPUT", "__trace", `
        ${instrumented}
        if (typeof run === 'function') run();
        else throw new Error("Define a run() function.");
      `)
      fn(Stack, Queue, LinkedList, DoublyLinkedList, BST, AVLTree, MinHeap, MaxHeap, GraphDS, ArrayDS, InfixToPostfix, HuffmanEncoder, DPTable, INPUT, trace)

      if (!localSteps.length) throw new Error("No steps recorded.")
      setSteps(localSteps); setCurrentStepIndex(0)
      const first = localSteps[0]?.dataStructures[0]; if (first) setActiveDsTabId(first.id)
    } catch (e: any) { setError(e.message || "Error"); setSteps([]); setCurrentStepIndex(-1) }
  }

  function uid(prefix: string) { return prefix + "-" + Math.random().toString(36).slice(2, 8) }

  function cloneDS(ds: any): DSState | null {
    if (ds.type === "Stack") return { id: ds.id, type: "Stack", items: [...ds.items] }
    if (ds.type === "Queue") return { id: ds.id, type: "Queue", items: [...ds.items] }
    if (ds.type === "LinkedList") {
      const nodes: { id: string; value: any }[] = []; let c = ds.head; while (c) { nodes.push({ id: c.id, value: c.value }); c = c.next }
      return { id: ds.id, type: "LinkedList", nodes, doubly: !!ds.doubly }
    }
    if (ds.type === "BST") {
      const cl = (n: any): BSTNodeState | null => n ? { id: n.id, value: n.value, left: cl(n.left), right: cl(n.right), height: n.height } : null
      return { id: ds.id, type: "BST", root: cl(ds.root), label: ds.label }
    }
    if (ds.type === "Heap") {
      const cl = (n: any): BSTNodeState | null => n ? { id: n.id, value: n.value, left: cl(n.left), right: cl(n.right) } : null
      return { id: ds.id, type: "Heap", items: [...ds.items], heapType: ds.heapType, root: ds._toTree() }
    }
    if (ds.type === "Graph") {
      const nodes: GNodeState[] = []; ds._nodes.forEach((v: any, k: string) => nodes.push({ id: k, label: v.label, dist: v.dist, visited: v.visited }))
      return { id: ds.id, type: "Graph", nodes, edges: [...ds._edges], highlights: [...(ds._highlights || [])], pathEdges: [...(ds._pathEdges || [])] }
    }
    if (ds.type === "Array") return { id: ds.id, type: "Array", items: [...ds.items], highlights: [...(ds._hl || [])], found: ds._found, label: ds._label }
    if (ds.type === "InfixState") return { id: ds.id, type: "InfixState", stack: [...ds._stack], output: [...ds._output], input: ds._input, pos: ds._pos }
    if (ds.type === "HuffmanState") return { id: ds.id, type: "HuffmanState", codes: { ...ds._codes }, freqs: { ...ds._freqs }, message: ds._msg }
    if (ds.type === "DPTable") {
      return {
        id: ds.id,
        type: "DPTable",
        rows: ds.rows,
        cols: ds.cols,
        data: ds.data.map((row: any[]) => [...row]),
        highlights: ds._hl ? [...ds._hl] : [],
        rowHeaders: ds._rowHeaders ? [...ds._rowHeaders] : undefined,
        colHeaders: ds._colHeaders ? [...ds._colHeaders] : undefined,
        label: ds._label
      }
    }
    return null
  }

  // ── Stepper ───────────────────────────────────────────────────────
  const stepNext = useCallback(() => {
    setCurrentStepIndex(prev => { const s = stepsRef.current; if (prev < s.length - 1) return prev + 1; setIsPlaying(false); return prev })
  }, [])
  const stepPrev = () => setCurrentStepIndex(p => Math.max(0, p - 1))
  const stepReset = () => { setCurrentStepIndex(0); setIsPlaying(false) }

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (isPlaying && steps.length > 0) timerRef.current = setInterval(stepNext, speed)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [isPlaying, speed, stepNext, steps.length])

  // ── Derived ───────────────────────────────────────────────────────
  const totalLines = code.split("\n").length
  const currentStep = currentStepIndex >= 0 && currentStepIndex < steps.length ? steps[currentStepIndex] : null
  const dsList = currentStep?.dataStructures ?? []
  const activeDS = dsList.find(d => d.id === activeDsTabId) ?? dsList[0]
  const progressPct = steps.length > 1 ? (currentStepIndex / (steps.length - 1)) * 100 : 0
  const tmpl = TEMPLATES[templateType]

  // Group templates
  const groups: Record<string, { key: string; label: string }[]> = {}
  Object.entries(TEMPLATES).forEach(([key, val]) => {
    if (!groups[val.group]) groups[val.group] = []
    groups[val.group].push({ key, label: val.label })
  })

  // ═════════════════════════════════════════════════════════════════
  //  SVG RENDERERS
  // ═════════════════════════════════════════════════════════════════

  const renderStack = (s: Extract<DSState, { type: "Stack" }>) => {
    const items = s.items; const boxH = 42; const boxW = 120; const gap = 4
    const svgH = Math.max((items.length + 1) * (boxH + gap) + 80, 280)
    return (
      <svg viewBox={`0 0 460 ${svgH}`} className="w-full max-h-[380px]" preserveAspectRatio="xMidYMid meet">
        <line x1="155" y1="20" x2="155" y2={svgH - 20} stroke="hsl(var(--muted-foreground))" strokeWidth="2.5" opacity="0.15" />
        <line x1="305" y1="20" x2="305" y2={svgH - 20} stroke="hsl(var(--muted-foreground))" strokeWidth="2.5" opacity="0.15" />
        <line x1="155" y1={svgH - 20} x2="305" y2={svgH - 20} stroke="hsl(var(--muted-foreground))" strokeWidth="2.5" opacity="0.15" />
        {!items.length ? <text x="230" y={svgH / 2} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="13" fontFamily="monospace">Empty</text> :
          items.map((val: any, i: number) => { const isTop = i === items.length - 1; const y = svgH - 30 - (i + 1) * (boxH + gap); return (
            <g key={i}><rect x={230 - boxW / 2} y={y} width={boxW} height={boxH} rx="5" fill={isTop ? "hsl(var(--primary))" : "hsl(var(--muted))"} stroke={isTop ? "hsl(var(--primary))" : "hsl(var(--border))"} strokeWidth="1.5" />
              <text x="230" y={y + boxH / 2 + 5} textAnchor="middle" fill={isTop ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))"} fontSize="14" fontWeight="bold" fontFamily="monospace">{String(val)}</text>
              <text x="145" y={y + boxH / 2 + 4} textAnchor="end" fill="hsl(var(--muted-foreground))" fontSize="10" fontFamily="monospace">[{i}]</text>
              {isTop && <><line x1="315" y1={y + boxH / 2} x2="340" y2={y + boxH / 2} stroke="hsl(var(--primary))" strokeWidth="2" markerEnd="url(#arrP)" /><text x="348" y={y + boxH / 2 + 4} fill="hsl(var(--primary))" fontSize="12" fontWeight="bold" fontFamily="monospace">top</text></>}
            </g>)})}
        <defs><marker id="arrP" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="hsl(var(--primary))" /></marker></defs>
      </svg>)
  }

  const renderQueue = (q: Extract<DSState, { type: "Queue" }>) => {
    const items = q.items; const bW = 60; const bH = 60; const gap = 10
    const svgW = Math.max(items.length * (bW + gap) + 200, 400)
    return (
      <svg viewBox={`0 0 ${svgW} 220`} className="w-full max-h-[260px]" preserveAspectRatio="xMidYMid meet">
        <line x1="50" y1="55" x2={svgW - 50} y2="55" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" opacity="0.12" />
        <line x1="50" y1={55 + bH + 12} x2={svgW - 50} y2={55 + bH + 12} stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" opacity="0.12" />
        {!items.length ? <text x={svgW / 2} y="92" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="13" fontFamily="monospace">Empty</text> :
          items.map((val: any, i: number) => { const x = 80 + i * (bW + gap); return (
            <g key={i}><rect x={x} y="62" width={bW} height={bH} rx="6" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1.5" />
              <text x={x + bW / 2} y="98" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="14" fontWeight="bold" fontFamily="monospace">{String(val)}</text>
              <text x={x + bW / 2} y="50" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="9" fontFamily="monospace">[{i}]</text>
              {i === 0 && <><line x1={x + bW / 2} y1="158" x2={x + bW / 2} y2="128" stroke="hsl(var(--primary))" strokeWidth="2" markerEnd="url(#aF)" /><text x={x + bW / 2} y="172" textAnchor="middle" fill="hsl(var(--primary))" fontSize="10" fontWeight="bold" fontFamily="monospace">front</text></>}
              {i === items.length - 1 && <><line x1={x + bW / 2} y1={i === 0 ? 188 : 158} x2={x + bW / 2} y2="128" stroke="#10b981" strokeWidth="2" markerEnd="url(#aR)" /><text x={x + bW / 2} y={i === 0 ? 202 : 172} textAnchor="middle" fill="#10b981" fontSize="10" fontWeight="bold" fontFamily="monospace">rear</text></>}
            </g>)})}
        <defs><marker id="aF" viewBox="0 0 10 10" refX="5" refY="10" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 10L5 0L10 10z" fill="hsl(var(--primary))" /></marker><marker id="aR" viewBox="0 0 10 10" refX="5" refY="10" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 10L5 0L10 10z" fill="#10b981" /></marker></defs>
      </svg>)
  }

  const renderLinkedList = (ll: Extract<DSState, { type: "LinkedList" }>) => {
    const nodes = ll.nodes; const nW = 80; const pW = 22; const fW = nW + pW; const aL = 36
    const svgW = Math.max(nodes.length * (fW + aL) + 140, 400)
    return (
      <svg viewBox={`0 0 ${svgW} 200`} className="w-full max-h-[260px]" preserveAspectRatio="xMidYMid meet">
        {!nodes.length ? <text x={svgW / 2} y="100" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="13" fontFamily="monospace">Empty</text> :
          nodes.map((node, i) => { const x = 70 + i * (fW + aL); const y = 80; return (
            <g key={node.id}>
              <rect x={x} y={y} width={nW} height={44} rx="5" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1.5" />
              <text x={x + nW / 2} y={y + 27} textAnchor="middle" fill="hsl(var(--foreground))" fontSize="13" fontWeight="bold" fontFamily="monospace">{String(node.value)}</text>
              <rect x={x + nW} y={y} width={pW} height={44} fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1.5" />
              {i < nodes.length - 1 ? <><circle cx={x + nW + pW / 2} cy={y + 22} r="3.5" fill="hsl(var(--primary))" /><line x1={x + nW + pW / 2} y1={y + 22} x2={x + fW + aL - 4} y2={y + 22} stroke="hsl(var(--primary))" strokeWidth="2" markerEnd="url(#aLL)" /></> :
                <line x1={x + nW} y1={y + 44} x2={x + fW} y2={y} stroke="hsl(var(--destructive))" strokeWidth="1.5" opacity="0.4" />}
              {i === 0 && <><line x1={x + nW / 2} y1="40" x2={x + nW / 2} y2={y - 3} stroke="hsl(var(--primary))" strokeWidth="2" markerEnd="url(#aH)" /><text x={x + nW / 2} y="33" textAnchor="middle" fill="hsl(var(--primary))" fontSize="11" fontWeight="bold" fontFamily="monospace">head</text></>}
              {ll.doubly && i > 0 && <line x1={x - 4} y1={y + 32} x2={x - aL + 8} y2={y + 32} stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" markerEnd="url(#aLLr)" opacity="0.5" />}
            </g>)})}
        <defs><marker id="aLL" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="hsl(var(--primary))" /></marker><marker id="aH" viewBox="0 0 10 10" refX="5" refY="10" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 10L5 0L10 10z" fill="hsl(var(--primary))" /></marker><marker id="aLLr" viewBox="0 0 10 10" refX="2" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M10 0L0 5L10 10z" fill="hsl(var(--muted-foreground))" /></marker></defs>
      </svg>)
  }

  const renderTree = (root: BSTNodeState | null, label?: string) => {
    const items: { id: string; value: any; x: number; y: number }[] = []; const edges: { x1: number; y1: number; x2: number; y2: number }[] = []
    const lay = (n: BSTNodeState | null, x: number, y: number, lv: number) => { if (!n) return; items.push({ id: n.id, value: n.value, x, y }); const h = 150 / Math.pow(1.8, lv); const v = 65; if (n.left) { edges.push({ x1: x, y1: y, x2: x - h, y2: y + v }); lay(n.left, x - h, y + v, lv + 1) }; if (n.right) { edges.push({ x1: x, y1: y, x2: x + h, y2: y + v }); lay(n.right, x + h, y + v, lv + 1) } }
    lay(root, 350, 40, 0); const maxY = items.reduce((m, i) => Math.max(m, i.y), 40) + 50
    return (
      <svg viewBox={`0 0 700 ${Math.max(maxY, 200)}`} className="w-full max-h-[380px]" preserveAspectRatio="xMidYMid meet">
        {label && <text x="350" y="18" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="11" fontFamily="monospace" fontWeight="bold">{label}</text>}
        {!root ? <text x="350" y="100" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="13" fontFamily="monospace">Empty</text> : <>
          {edges.map((e, i) => <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" opacity="0.2" />)}
          {items.map(n => <g key={n.id}><circle cx={n.x} cy={n.y} r="20" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1.5" /><text x={n.x} y={n.y + 5} textAnchor="middle" fill="hsl(var(--foreground))" fontSize="12" fontWeight="bold" fontFamily="monospace">{String(n.value)}</text></g>)}
        </>}
      </svg>)
  }

  const renderGraph = (g: Extract<DSState, { type: "Graph" }>) => {
    const nodes = g.nodes; const hl = g.highlights || []; const pe = g.pathEdges || []
    // Auto-layout in a circle
    const cx = 300; const cy = 160; const r = 120
    const positions: Record<string, { x: number; y: number }> = {}
    nodes.forEach((n, i) => { const a = (2 * Math.PI * i) / nodes.length - Math.PI / 2; positions[n.id] = { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) } })
    // Deduplicate edges (keep only one direction per pair)
    const seen = new Set<string>(); const uniEdges: GEdgeState[] = []
    g.edges.forEach(e => { const k = [e.from, e.to].sort().join("-"); if (!seen.has(k)) { seen.add(k); uniEdges.push(e) } })
    return (
      <svg viewBox="0 0 600 340" className="w-full max-h-[380px]" preserveAspectRatio="xMidYMid meet">
        {uniEdges.map((e, i) => { const a = positions[e.from]; const b = positions[e.to]; if (!a || !b) return null; const k = [e.from, e.to].sort().join("-"); const isPath = pe.some(p => { const s = p.split("-").sort().join("-"); return s === k }); return (
          <g key={i}><line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={isPath ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"} strokeWidth={isPath ? 3 : 1.5} opacity={isPath ? 1 : 0.2} />
            <text x={(a.x + b.x) / 2 + 8} y={(a.y + b.y) / 2 - 6} fill="hsl(var(--muted-foreground))" fontSize="10" fontFamily="monospace">{e.weight > 1 ? e.weight : ""}</text></g>)})}
        {nodes.map(n => { const p = positions[n.id]; const isHl = hl.includes(n.id); return (
          <g key={n.id}><circle cx={p.x} cy={p.y} r="22" fill={isHl ? "hsl(var(--primary))" : n.visited ? "hsl(var(--muted))" : "hsl(var(--card))"} stroke={isHl ? "hsl(var(--primary))" : "hsl(var(--border))"} strokeWidth="2" />
            <text x={p.x} y={p.y + 5} textAnchor="middle" fill={isHl ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))"} fontSize="13" fontWeight="bold" fontFamily="monospace">{n.label}</text>
            {n.dist !== undefined && n.dist !== Infinity && <text x={p.x} y={p.y + 40} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="9" fontFamily="monospace">d={n.dist}</text>}
          </g>)})}
      </svg>)
  }

  const renderArray = (a: Extract<DSState, { type: "Array" }>) => {
    const items = a.items; const hl = a.highlights || []; const bW = 50; const bH = 50
    const svgW = Math.max(items.length * (bW + 6) + 80, 400)
    return (
      <svg viewBox={`0 0 ${svgW} 160`} className="w-full max-h-[200px]" preserveAspectRatio="xMidYMid meet">
        {items.map((v: any, i: number) => { const x = 40 + i * (bW + 6); const isHl = hl.includes(i); const isFound = a.found === i; return (
          <g key={i}><rect x={x} y="40" width={bW} height={bH} rx="5" fill={isFound ? "#10b981" : isHl ? "hsl(var(--primary))" : "hsl(var(--muted))"} stroke={isFound ? "#10b981" : isHl ? "hsl(var(--primary))" : "hsl(var(--border))"} strokeWidth="1.5" />
            <text x={x + bW / 2} y="70" textAnchor="middle" fill={isHl || isFound ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))"} fontSize="13" fontWeight="bold" fontFamily="monospace">{String(v)}</text>
            <text x={x + bW / 2} y="110" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="9" fontFamily="monospace">[{i}]</text>
          </g>)})}
      </svg>)
  }

  const renderInfix = (s: Extract<DSState, { type: "InfixState" }>) => (
    <div className="space-y-4 w-full font-mono text-sm">
      <div className="p-3 rounded bg-muted/40 border border-border/40">
        <div className="text-muted-foreground text-xs mb-1.5 font-semibold">INPUT</div>
        <div className="flex flex-wrap gap-1">{s.input.replace(/\s+/g, "").split("").map((ch, i) => <span key={i} className={`px-2 py-1 rounded text-xs ${i === s.pos ? "bg-primary text-primary-foreground font-bold" : "bg-muted border border-border"}`}>{ch}</span>)}</div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 rounded bg-muted/40 border border-border/40"><div className="text-muted-foreground text-xs mb-1.5 font-semibold">STACK</div><div className="flex flex-wrap gap-1">{s.stack.length ? s.stack.map((v, i) => <span key={i} className="px-2 py-1 rounded bg-primary/20 text-primary text-xs font-bold">{v}</span>) : <span className="text-muted-foreground text-xs italic">empty</span>}</div></div>
        <div className="p-3 rounded bg-muted/40 border border-border/40"><div className="text-muted-foreground text-xs mb-1.5 font-semibold">OUTPUT</div><div className="flex flex-wrap gap-1">{s.output.length ? s.output.map((v, i) => <span key={i} className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold">{v}</span>) : <span className="text-muted-foreground text-xs italic">empty</span>}</div></div>
      </div>
    </div>)

  const renderHuffman = (h: Extract<DSState, { type: "HuffmanState" }>) => (
    <div className="space-y-4 w-full font-mono text-sm">
      {Object.keys(h.freqs).length > 0 && <div className="p-3 rounded bg-muted/40 border border-border/40"><div className="text-muted-foreground text-xs mb-1.5 font-semibold">FREQUENCIES</div><div className="flex flex-wrap gap-2">{Object.entries(h.freqs).map(([ch, f]) => <span key={ch} className="px-2 py-1 rounded bg-muted border border-border text-xs">&apos;{ch}&apos;: {f}</span>)}</div></div>}
      {Object.keys(h.codes).length > 0 && <div className="p-3 rounded bg-muted/40 border border-border/40"><div className="text-muted-foreground text-xs mb-1.5 font-semibold">CODES</div><div className="flex flex-wrap gap-2">{Object.entries(h.codes).map(([ch, c]) => <span key={ch} className="px-2 py-1 rounded bg-primary/20 text-primary text-xs font-bold">&apos;{ch}&apos;→{c}</span>)}</div></div>}
    </div>)

  const renderDPTable = (t: Extract<DSState, { type: "DPTable" }>) => {
    const hl = t.highlights || [];
    const isHl = (r: number, c: number) => hl.some(([hr, hc]) => hr === r && hc === c);
    return (
      <div className="w-full flex flex-col items-center">
        {t.label && <div className="text-muted-foreground text-xs mb-3 font-semibold font-mono tracking-wider uppercase">{t.label}</div>}
        <div className="w-full overflow-auto max-h-[360px] border border-border/60 rounded bg-muted/20">
          <table className="min-w-full divide-y divide-border/40 text-center font-mono text-xs">
            <thead>
              <tr className="bg-muted/40 divide-x divide-border/40">
                <th className="px-3 py-2 text-muted-foreground font-bold"></th>
                {t.colHeaders ? t.colHeaders.map((col, idx) => (
                  <th key={idx} className="px-3 py-2 text-muted-foreground font-bold whitespace-nowrap">{col}</th>
                )) : Array.from({length: t.cols}).map((_, idx) => (
                  <th key={idx} className="px-3 py-2 text-muted-foreground font-bold">[{idx}]</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {t.data.map((row, rIdx) => (
                <tr key={rIdx} className="divide-x divide-border/40 hover:bg-muted/10 transition-colors">
                  <td className="px-3 py-2 bg-muted/30 font-bold text-muted-foreground whitespace-nowrap">
                    {t.rowHeaders ? t.rowHeaders[rIdx] : `[${rIdx}]`}
                  </td>
                  {row.map((val, cIdx) => {
                    const active = isHl(rIdx, cIdx);
                    return (
                      <td
                        key={cIdx}
                        className={`px-3 py-2 transition-all duration-200 ${
                          active
                            ? "bg-primary text-primary-foreground font-bold scale-105"
                            : "text-foreground"
                        }`}
                      >
                        {val === null || val === undefined ? "-" : String(val)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════
  //  RENDER
  // ═════════════════════════════════════════════════════════════════
  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Custom Code Visualizer</h1>
          <p className="text-muted-foreground text-sm mt-1">Write code, step through data-structure operations line-by-line — fully offline.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Template:</span>
          <Select value={templateType} onValueChange={handleTemplateChange}>
            <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(groups).map(([group, items]) => (
                <React.Fragment key={group}>
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">{group}</div>
                  {items.map(i => <SelectItem key={i.key} value={i.key}>{i.label}</SelectItem>)}
                </React.Fragment>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* LEFT: Code + Inputs + Console */}
        <div className="xl:col-span-5 space-y-3">
          {/* Custom Inputs */}
          {tmpl.inputs.length > 0 && (
            <Card className="border border-border/80 shadow-sm overflow-hidden">
              <CardHeader className="py-2.5 px-4 bg-muted/30 border-b border-border/60 flex flex-row items-center gap-2">
                <Keyboard className="h-4 w-4 text-primary" />
                <span className="font-semibold text-sm">Custom Inputs</span>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {tmpl.inputs.map(inp => (
                  <div key={inp.id} className="space-y-1">
                    <Label htmlFor={inp.id} className="text-xs text-muted-foreground">{inp.label}</Label>
                    <Input
                      id={inp.id}
                      value={inputValues[inp.id] ?? inp.default}
                      onChange={e => setInputValues(prev => ({ ...prev, [inp.id]: e.target.value }))}
                      placeholder={inp.placeholder}
                      className="font-mono text-sm h-9"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Editor */}
          <Card className="overflow-hidden border border-border/80 shadow-sm">
            <CardHeader className="py-3 px-5 bg-muted/30 border-b border-border/60 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2"><Code className="h-4 w-4 text-primary" /><span className="font-semibold text-sm">Editor</span></div>
              <Button size="sm" onClick={handleRun} className="h-8 gap-1.5"><PlayCircle className="h-4 w-4" />Compile &amp; Run</Button>
            </CardHeader>
            <div className="relative font-mono text-sm leading-6 bg-zinc-950 text-zinc-100 h-[340px] flex overflow-hidden">
              <div ref={gutterRef} className="w-11 flex-shrink-0 bg-zinc-900/80 border-r border-zinc-800 text-right pr-2 pt-3 pb-3 select-none overflow-hidden">
                {Array.from({ length: totalLines }).map((_, i) => { const ln = i + 1; const act = currentStep?.lineNumber === ln; return <div key={ln} className={`h-6 text-xs leading-6 transition-colors ${act ? "text-amber-400 font-bold bg-amber-500/15" : "text-zinc-600"}`}>{ln}</div> })}
              </div>
              <div className="flex-1 relative">
                {currentStep && <div className="absolute left-0 right-0 h-6 bg-amber-400/10 border-l-2 border-amber-400 pointer-events-none z-0 transition-all duration-150" style={{ top: `${(currentStep.lineNumber - 1) * 24 + 12}px` }} />}
                <textarea ref={textareaRef} value={code} onChange={e => { setCode(e.target.value); resetExecution() }} onScroll={handleScroll} className="absolute inset-0 w-full h-full bg-transparent text-zinc-200 font-mono text-sm leading-6 resize-none outline-none px-4 pt-3 pb-3 z-10 whitespace-pre overflow-auto caret-amber-400" spellCheck={false} />
              </div>
            </div>
          </Card>

          {/* Console */}
          <Card className="border border-border/80 shadow-sm overflow-hidden">
            <CardHeader className="py-2 px-4 bg-muted/30 border-b border-border/60 flex flex-row items-center gap-2">
              <Terminal className="h-4 w-4 text-muted-foreground" /><span className="font-semibold text-[11px] text-muted-foreground uppercase tracking-wider">Console</span>
            </CardHeader>
            <CardContent className="p-3 h-[90px] overflow-y-auto font-mono text-xs">
              {error ? <div className="text-destructive flex items-start gap-2"><AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" /><span>{error}</span></div> :
                currentStep ? <div className="space-y-1"><div className="text-amber-400 font-semibold flex items-center gap-1.5 text-xs"><Info className="h-3.5 w-3.5" />Step {currentStepIndex + 1}/{steps.length} — Line {currentStep.lineNumber}</div><div className="text-zinc-300 bg-zinc-900/60 p-2 rounded border border-zinc-800">{currentStep.message}</div></div> :
                  <span className="text-muted-foreground italic">Press Compile &amp; Run to begin.</span>}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT: Visualizer */}
        <div className="xl:col-span-7">
          <Card className="border border-border/80 shadow-sm overflow-hidden">
            <CardHeader className="py-4 px-5 bg-muted/30 border-b border-border/60">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div><CardTitle className="text-lg">Visualization</CardTitle><CardDescription className="text-xs">Live state of your data structures</CardDescription></div>
                {steps.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={stepReset} disabled={currentStepIndex === 0}><RotateCcw className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={stepPrev} disabled={currentStepIndex === 0}><SkipBack className="h-4 w-4" /></Button>
                    <Button size="icon" variant={isPlaying ? "default" : "ghost"} className="h-8 w-8" onClick={() => setIsPlaying(!isPlaying)}>{isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}</Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={stepNext} disabled={currentStepIndex === steps.length - 1}><SkipForward className="h-4 w-4" /></Button>
                    <Separator orientation="vertical" className="h-6 mx-1" />
                    <div className="flex items-center gap-2 pl-1"><Gauge className="h-3.5 w-3.5 text-muted-foreground" /><input type="range" min="100" max="2000" step="100" value={2100 - speed} onChange={e => setSpeed(2100 - Number(e.target.value))} className="w-20 h-1 accent-primary cursor-pointer" title={`${speed}ms/step`} /></div>
                  </div>
                )}
              </div>
              {steps.length > 0 && <div className="mt-3 w-full bg-muted rounded-full h-1.5 overflow-hidden"><div className="h-full bg-primary rounded-full transition-all duration-200" style={{ width: `${progressPct}%` }} /></div>}
            </CardHeader>
            <CardContent className="p-5 min-h-[420px] flex flex-col">
              {steps.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground py-16 space-y-3"><PlayCircle className="h-14 w-14 text-muted-foreground/30 animate-pulse" /><div><p className="font-semibold text-sm text-foreground text-center">Visualizer Idle</p><p className="text-xs mt-1 max-w-xs text-center">Write your code, then press <strong>Compile &amp; Run</strong>.</p></div></div>
              ) : dsList.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground py-16"><AlertCircle className="h-10 w-10 text-amber-500/60 mb-2" /><p className="text-sm font-semibold">No data structures at this step</p></div>
              ) : (
                <div className="space-y-3 flex-1 flex flex-col">
                  {dsList.length > 1 && <div className="flex flex-wrap gap-2 border-b border-border/40 pb-2">{dsList.map(ds => <Button key={ds.id} size="sm" variant={activeDsTabId === ds.id ? "default" : "outline"} onClick={() => setActiveDsTabId(ds.id)} className="h-7 text-xs font-mono">{ds.type}</Button>)}</div>}
                  <div className="flex-1 flex items-center justify-center rounded-lg bg-zinc-950/20 border border-border/30 p-4">
                    {activeDS?.type === "Stack" && renderStack(activeDS as any)}
                    {activeDS?.type === "Queue" && renderQueue(activeDS as any)}
                    {activeDS?.type === "LinkedList" && renderLinkedList(activeDS as any)}
                    {activeDS?.type === "BST" && renderTree((activeDS as any).root, (activeDS as any).label)}
                    {activeDS?.type === "Heap" && renderTree((activeDS as any).root, `${(activeDS as any).heapType.toUpperCase()} HEAP — Array: [${(activeDS as any).items.join(", ")}]`)}
                    {activeDS?.type === "Graph" && renderGraph(activeDS as any)}
                    {activeDS?.type === "Array" && renderArray(activeDS as any)}
                    {activeDS?.type === "InfixState" && renderInfix(activeDS as any)}
                    {activeDS?.type === "HuffmanState" && renderHuffman(activeDS as any)}
                    {activeDS?.type === "DPTable" && renderDPTable(activeDS as any)}
                  </div>
                  {currentStepIndex === steps.length - 1 && <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-2.5 rounded flex items-center gap-2 text-xs font-mono"><CheckCircle2 className="h-4 w-4 flex-shrink-0" />Execution complete — {steps.length} steps.</div>}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
