export interface Concept {
  title: string
  content: string
}

export interface ComplexityRow {
  operation: string
  time: string
  space: string
}

export interface CodeExample {
  language: string
  code: string
}

export interface TopicContent {
  id: string
  title: string
  category: string
  summary: string
  introduction: string
  concepts: Concept[]
  complexityTable?: ComplexityRow[]
  codeExample: CodeExample
  bestPractices: string[]
}

export const LEARN_CONTENT: Record<string, TopicContent> = {
  "big-o": {
    id: "big-o",
    title: "Big O & Complexity Theory",
    category: "Basics & Foundations",
    summary: "Deep dive into the mathematical definition of Big O, complexity proofs, series equations, and linear O(N) analysis.",
    introduction: "Big O notation is a mathematical tool used to describe the limiting behavior of a function when the argument tends towards a particular value or infinity. In computer science, it classifies algorithms based on their runtime or space requirements as input size grows, establishing asymptotic upper bounds.",
    concepts: [
      {
        title: "1. Formal Mathematical Definition of Big O",
        content: "Mathematically, an algorithm's growth function f(n) is O(g(n)) if and only if there exist positive constants C and n0 such that:\n\n   f(n) ≤ C * g(n) for all n ≥ n0\n\nWhere:\n• f(n) is the exact number of basic computer steps (comparisons, additions, swaps) executed by the algorithm.\n• g(n) is the asymptotic growth class function (e.g. n, n², log n).\n• C is a constant multiplier that scales g(n) to account for differences in computer hardware speed.\n• n0 is the threshold input size, beyond which the growth of the algorithm is strictly bounded from above by C * g(n)."
      },
      {
        title: "2. Mathematical Proof of O(N) Linear Complexity",
        content: "Let's prove why a single-loop algorithm that takes exactly f(n) = 5n + 12 steps is classified as O(n).\n\nTo prove f(n) = O(n), we must find constants C > 0 and n0 > 0 such that:\n   5n + 12 ≤ C * n  for all n ≥ n0\n\nLet's choose C = 6. Now solve for n:\n   5n + 12 ≤ 6n\n   12 ≤ 6n - 5n\n   12 ≤ n  (which means n ≥ 12)\n\nThus, by choosing C = 6 and n0 = 12, the inequality 5n + 12 ≤ C * n is mathematically proven true for all n ≥ n0. Therefore, f(n) is strictly O(n) (Linear Time)."
      },
      {
        title: "3. Essential Mathematical Sums & Limits",
        content: "Analyzing complex loops requires basic summation mathematics:\n\n• Arithmetic Series (e.g., nested loops like Selection Sort):\n  ∑_{i=1}^n i = 1 + 2 + 3 + ... + n = n(n + 1) / 2 = 0.5n² + 0.5n\n  Since higher-order terms dominate, 0.5n² + 0.5n is bounded by C * n² (e.g., C = 1, n0 = 1), proving it is O(n²).\n\n• Geometric Series (e.g., node count in a binary tree):\n  ∑_{i=0}^k a * r^i = a * (r^(k+1) - 1) / (r - 1)\n  If r = 2, the sum of powers of 2 up to depth k is 2^(k+1) - 1 = O(2^k)."
      },
      {
        title: "4. Asymptotic Bounds: Big O, Omega, and Theta",
        content: "• Big O (O): Upper bound. Describes the absolute worst-case scenario. f(n) ≤ C * g(n).\n• Big Omega (Ω): Lower bound. Describes the absolute best-case scenario. f(n) ≥ C * g(n).\n• Big Theta (Θ): Tight bound. The algorithm runs precisely inside the bound. C1 * g(n) ≤ f(n) ≤ C2 * g(n)."
      }
    ],
    complexityTable: [
      { operation: "Constant Lookup O(1)", time: "Constant", space: "Constant" },
      { operation: "Linear Loop scan O(n)", time: "Direct proportion", space: "O(1) extra variables" },
      { operation: "Logarithmic Search O(log n)", time: "Input halved", space: "Recursion depth stack" },
      { operation: "Linearithmic Sort O(n log n)", time: "Divide & Conquer", space: "O(n) merge buffers" },
      { operation: "Quadratic Nested Loop O(n²)", time: "Dual array checks", space: "Constant" }
    ],
    codeExample: {
      language: "javascript",
      code: `// Asymptotic Complexity Code Demonstrations

// 1. Constant Time: O(1)
// Operations count does not depend on array size N.
function getMiddleElement(arr) {
  if (arr.length === 0) return null;
  const mid = Math.floor(arr.length / 2);
  return arr[mid]; // 1 step
}

// 2. Linear Time: O(N)
// Exact operations: f(n) = 3n + 2. Linear proportion to N.
function linearSum(arr) {
  let sum = 0;              // 1 step
  const n = arr.length;     // 1 step
  for (let i = 0; i < n; i++) { // n checks
    sum += arr[i];          // n operations
  }
  return sum;               // 1 step
}

// 3. Logarithmic Time: O(log N)
// Input size is divided in half at each iteration.
function binarySearchLog(arr, target) {
  let low = 0;
  let high = arr.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) return mid;
    else if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}

// 4. Quadratic Time: O(N^2)
// Dual nested loop. Operations follow arithmetic series: N * (N - 1) / 2.
function printAllPairs(arr) {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      console.log(arr[i] + ", " + arr[j]);
    }
  }
}`
    },
    bestPractices: [
      "Drop lower-order terms (e.g. O(n² + n + 10) simplifies directly to O(n²)).",
      "Ignore constant coefficients (e.g. O(5n) simplifies directly to O(n)).",
      "Verify recursive space depth as it consumes call stack memory, leading to O(N) space even if no structures are allocated."
    ]
  },
  "arrays": {
    id: "arrays",
    title: "Arrays",
    category: "Linear Data Structures",
    summary: "Learn the core patterns of array manipulation: two pointers, sliding window, and prefix sums.",
    introduction: "An array is a collection of items stored at contiguous memory locations. It is one of the most fundamental data structures, offering fast index-based lookups but requiring linear time to insert or delete elements in the middle.",
    concepts: [
      {
        title: "Two Pointers Technique",
        content: "Typically used on sorted arrays. Two pointers initialized at different positions (e.g., start and end) move towards each other or at different speeds to solve problems with O(N) time and O(1) space, such as reversing an array or finding a target pair sum."
      },
      {
        title: "Sliding Window Pattern",
        content: "Used to perform operations on a contiguous subarray or substring. Instead of recalculating the window from scratch, we maintain a sliding window by adding the new element at the right end and removing the trailing element from the left end. Excellent for finding subsegments satisfying specific criteria."
      },
      {
        title: "Prefix Sum",
        content: "A preprocessing technique where we compute an array of cumulative sums. This allows constant time O(1) query of the sum of any subarray between indices i and j (Formula: Sum(i..j) = Prefix[j] - Prefix[i-1])."
      }
    ],
    complexityTable: [
      { operation: "Access by index", time: "O(1)", space: "O(1)" },
      { operation: "Search (Unsorted)", time: "O(N)", space: "O(1)" },
      { operation: "Search (Sorted)", time: "O(log N)", space: "O(1)" },
      { operation: "Insertion at end", time: "O(1) amortized", space: "O(1)" },
      { operation: "Insertion / Deletion (middle)", time: "O(N)", space: "O(1)" }
    ],
    codeExample: {
      language: "javascript",
      code: `// Sliding Window: Maximum sum subarray of size K
function maxSubarraySum(arr, k) {
  if (arr.length < k) return null;
  
  let maxSum = 0;
  let windowSum = 0;
  
  // Sum of first window
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }
  maxSum = windowSum;
  
  // Slide the window
  for (let i = k; i < arr.length; i++) {
    windowSum += arr[i] - arr[i - k];
    maxSum = Math.max(maxSum, windowSum);
  }
  
  return maxSum;
}`
    },
    bestPractices: [
      "Use two pointers when dealing with sorted arrays to avoid nested loops.",
      "Initialize prefix sums to size N+1 with a dummy zero to handle edge query boundaries easily.",
      "Check for empty arrays or single-element inputs as boundary test cases."
    ]
  },
  "strings": {
    id: "strings",
    title: "Strings",
    category: "Linear Data Structures",
    summary: "String manipulation, anagram detection, pattern matching, and storage formats.",
    introduction: "Strings are sequences of characters. While conceptually similar to arrays of characters, strings in many modern languages are immutable, which means any modification creates a new string. Understanding string properties is essential for text parsing and validation.",
    concepts: [
      {
        title: "Immutability & Efficiency",
        content: "Since strings are often immutable, repeatedly concatenating strings in a loop can cause O(N²) time complexity due to copying. Utilize string builders or arrays of characters that are joined at the end to optimize performance."
      },
      {
        title: "Anagram & Palindrome Checkers",
        content: "An anagram is a word formed by rearranging characters of another. We verify using frequency counts (hash map or a 26-integer array). A palindrome is a string that reads the same forwards and backwards, which is verified using two pointers meeting in the middle."
      }
    ],
    complexityTable: [
      { operation: "Length retrieval", time: "O(1)", space: "O(1)" },
      { operation: "Concatenation (immutable)", time: "O(N + M)", space: "O(N + M)" },
      { operation: "Character lookup", time: "O(1)", space: "O(1)" },
      { operation: "Substring generation", time: "O(K)", space: "O(K)" }
    ],
    codeExample: {
      language: "javascript",
      code: `// Palindrome and Anagram validation
function isPalindrome(str) {
  const s = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0, right = s.length - 1;
  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++;
    right--;
  }
  return true;
}

function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const count = {};
  for (let ch of s) count[ch] = (count[ch] || 0) + 1;
  for (let ch of t) {
    if (!count[ch]) return false;
    count[ch]--;
  }
  return true;
}`
    },
    bestPractices: [
      "Use character frequency maps (e.g. size 256 for ASCII or 26 for English lowercase) to solve matching problems in O(N) time.",
      "Remember that subsegments of string operations can trigger memory allocation warnings if string lengths are huge."
    ]
  },
  "hash-maps": {
    id: "hash-maps",
    title: "Hash Maps & Sets",
    category: "Linear Data Structures",
    summary: "Harness average constant time lookups using key-value hashes.",
    introduction: "A Hash Map (or Hash Table) stores key-value pairs. It uses a hash function to compute an index into an array of buckets, from which the desired value can be found. It is the go-to structure for indexing and rapid querying.",
    concepts: [
      {
        title: "Hash Functions and Collisions",
        content: "A hash function maps keys to integer indices. When two keys map to the same index, a collision occurs. Standard handling techniques include Chaining (linked lists in bucket cells) and Open Addressing (probing next available slot)."
      },
      {
        title: "HashSet vs HashMap",
        content: "A HashSet stores unique values without duplicates, implemented internally as a HashMap where the value is a dummy placeholder. Useful for checking memberships in O(1) time."
      }
    ],
    complexityTable: [
      { operation: "Insert Key-Value", time: "O(1) average", space: "O(1)" },
      { operation: "Get Value by Key", time: "O(1) average", space: "O(1)" },
      { operation: "Delete Key", time: "O(1) average", space: "O(1)" },
      { operation: "Worst Case (many collisions)", time: "O(N)", space: "O(1)" }
    ],
    codeExample: {
      language: "javascript",
      code: `// Two Sum using Hash Map
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`
    },
    bestPractices: [
      "Consider loading factors when sizing hash tables to maintain average O(1) behavior.",
      "Understand the custom hash function criteria if using custom objects as map keys."
    ]
  },
  "linked-lists": {
    id: "linked-lists",
    title: "Linked Lists",
    category: "Linear Data Structures",
    summary: "Singly, doubly, and circular linked lists with pointer manip techniques.",
    introduction: "A linked list is a linear collection of data elements whose order is not given by their physical placement in memory. Instead, each element points to the next. This allows constant time insertions and deletions at arbitrary positions if reference pointers are known.",
    concepts: [
      {
        title: "Floyd's Cycle Finding Algorithm",
        content: "Also known as the 'Tortoise and Hare' algorithm. By using two pointers moving at different speeds (slow moves 1 step, fast moves 2 steps), we can detect if a cycle exists in a linked list. If they meet, there is a cycle."
      },
      {
        title: "Dummy Node Technique",
        content: "Using a dummy/sentinel node at the start of a list simplifies boundary edge cases, such as inserting before the head or merging two sorted lists."
      }
    ],
    complexityTable: [
      { operation: "Access by position", time: "O(N)", space: "O(1)" },
      { operation: "Insert/Delete at Head", time: "O(1)", space: "O(1)" },
      { operation: "Insert/Delete at Tail", time: "O(1) with pointer", space: "O(1)" },
      { operation: "Insert/Delete in middle", time: "O(N) search + O(1)", space: "O(1)" }
    ],
    codeExample: {
      language: "javascript",
      code: `// Reverse a Singly Linked List
function reverseList(head) {
  let prev = null;
  let curr = head;
  while (curr !== null) {
    let nextTemp = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextTemp;
  }
  return prev;
}`
    },
    bestPractices: [
      "Draw pointer changes on paper before writing code to prevent memory leak and orphaned node issues.",
      "Always set standard node references to null at the end of lists to avoid cycle bugs."
    ]
  },
  "stacks": {
    id: "stacks",
    title: "Stacks",
    category: "Linear Data Structures",
    summary: "LIFO queues, matching parentheses, expression parsing, and monotonic stacks.",
    introduction: "A stack is an abstract data type that serves as a collection of elements, with two main operations: push (adds to collection) and pop (removes the most recently added element). It operates on a Last In, First Out (LIFO) model.",
    concepts: [
      {
        title: "Monotonic Stack Pattern",
        content: "A stack that maintains its elements in a sorted order (increasing or decreasing). Used to solve 'next greater element' or 'daily temperatures' problems efficiently in linear O(N) time."
      },
      {
        title: "Function Calls and Call Stack",
        content: "Recursion in modern programming languages is supported by an underlying execution stack. Stack overflows occur when the recursion depth exceeds stack limits."
      }
    ],
    complexityTable: [
      { operation: "Push element", time: "O(1)", space: "O(1)" },
      { operation: "Pop element", time: "O(1)", space: "O(1)" },
      { operation: "Peek top", time: "O(1)", space: "O(1)" }
    ],
    codeExample: {
      language: "javascript",
      code: `// Valid Parentheses checking
function isValidParentheses(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  
  for (let ch of s) {
    if (ch === '(' || ch === '{' || ch === '[') {
      stack.push(ch);
    } else if (stack.length && stack[stack.length - 1] === map[ch]) {
      stack.pop();
    } else {
      return false;
    }
  }
  return stack.length === 0;
}`
    },
    bestPractices: [
      "Use stacks for backtracking paths or matching nested parameters.",
      "Think of monotonic stacks when you need to search for nearest elements matching criteria in an array."
    ]
  },
  "queues": {
    id: "queues",
    title: "Queues & Priority Queues",
    category: "Linear Data Structures",
    summary: "FIFO channels, circular buffers, and min/max priority queues.",
    introduction: "A queue is a collection of entities that are kept in a prompt order. The principal operations are addition of entities to the rear terminal position (enqueue) and removal of entities from the front terminal position (dequeue). It operates on a First In, First Out (FIFO) model.",
    concepts: [
      {
        title: "Circular Queue",
        content: "A queue structure that utilizes a fixed array and connects the end back to the start. Eliminates array shifting times by wrapping index points modulo array capacity."
      },
      {
        title: "Priority Queue",
        content: "A specialized queue where elements are served based on priorities rather than raw arrival times. Typically backed by a Binary Heap to ensure logarithmic insert and remove times."
      }
    ],
    complexityTable: [
      { operation: "Enqueue (FIFO Queue)", time: "O(1)", space: "O(1)" },
      { operation: "Dequeue (FIFO Queue)", time: "O(1)", space: "O(1)" },
      { operation: "Insert (Priority Queue)", time: "O(log N)", space: "O(1)" },
      { operation: "Remove Min/Max (Priority Queue)", time: "O(log N)", space: "O(1)" }
    ],
    codeExample: {
      language: "javascript",
      code: `// Circular Queue Implementation snippet
class CircularQueue {
  constructor(capacity) {
    this.capacity = capacity;
    this.queue = Array(capacity).fill(null);
    this.head = -1;
    this.tail = -1;
  }
  enqueue(val) {
    if ((this.tail + 1) % this.capacity === this.head) return false; // Full
    if (this.head === -1) this.head = 0;
    this.tail = (this.tail + 1) % this.capacity;
    this.queue[this.tail] = val;
    return true;
  }
  dequeue() {
    if (this.head === -1) return null; // Empty
    const val = this.queue[this.head];
    this.queue[this.head] = null;
    if (this.head === this.tail) {
      this.head = -1;
      this.tail = -1;
    } else {
      this.head = (this.head + 1) % this.capacity;
    }
    return val;
  }
}`
    },
    bestPractices: [
      "Use queues to manage task pipelines or implement Breadth-First Searches (BFS).",
      "Avoid array shifts `shift()` in Javascript on large arrays inside loops, as it triggers linear elements copy overhead."
    ]
  },
  "queue-systems": {
    id: "queue-systems",
    title: "Queue System Architectures",
    category: "Linear Data Structures",
    summary: "Real-world queue systems (MLQ operating schedulers, brokers), developer matrix of why other structures fail.",
    introduction: "Queues are the fundamental scaling and coordination backbone in software engineering. In systems programming, operating systems coordinate multiple tasks using Multilevel Queue systems. In distributed backends, Producer-Consumer task queues manage thread orchestration. Selecting when to use a queue, and understanding why standard arrays, stacks, or maps absolutely fail to replicate queue properties, is key to writing high-performance code.",
    concepts: [
      {
        title: "1. Operating System Multilevel Queue Scheduling (MLQ)",
        content: "In operating systems, a CPU scheduler manages processes by grouping them into separate queues based on properties like responsiveness. For example, interactive 'Foreground' processes (which require immediate feedback) run in a strict FIFO queue with high priority. 'Background' batch processes (which perform heavy computation) run in a lower-priority queue. The CPU processes High-Priority tasks first, switching to Background tasks only when the foreground queue is completely empty."
      },
      {
        title: "2. The Developer Choice Matrix: Why other structures fail",
        content: "• Why not standard Arrays?\nRemoving elements from the front of a contiguous array requires shifting every subsequent element left by one slot. This is a linear O(N) operation. On a queue with 1,000,000 tasks, dequeueing would take 1,000,000 memory copies per step! Pointers or Circular Queues guarantee strict O(1) time.\n\n• Why not Stacks?\nStacks operate on LIFO (Last In First Out). If used as a job scheduler, the oldest job would be constantly starved of CPU cycles as long as new jobs keep arriving. FIFO queues guarantee perfect fairness.\n\n• Why not Hash Maps?\nHash maps are unordered. They do not maintain chronological sequence. To retrieve the oldest task, you would have to scan all keys in O(N) time."
      },
      {
        title: "3. Asynchronous Task Queue (Producer-Consumer)",
        content: "Used to handle asynchronous processes in web servers (like email dispatch or PDF rendering). Producers (HTTP request threads) enqueue task descriptions, and a worker pool (Consumer threads) constantly dequeue and process them. This prevents server threads from blocking on long-running tasks, maximizing concurrency."
      }
    ],
    complexityTable: [
      { operation: "Queue Enqueue/Dequeue", time: "O(1)", space: "O(1)" },
      { operation: "Array Shift/Unshift (Relocate)", time: "O(N)", space: "O(1)" },
      { operation: "Hash Map Scan Oldest", time: "O(N)", space: "O(1)" },
      { operation: "Priority Queue Extract", time: "O(log N)", space: "O(1)" }
    ],
    codeExample: {
      language: "javascript",
      code: `// Real-world Queue Architectures

// 1. Multilevel Queue Operating System Process Scheduler
class Process {
  constructor(pid, name, priority) {
    this.pid = pid;
    this.name = name;
    this.priority = priority; // 'high' (foreground) or 'low' (background)
  }
}

class OSProcessScheduler {
  constructor() {
    this.foregroundQueue = []; // FIFO high priority
    this.backgroundQueue = []; // FIFO low priority
  }
  
  addProcess(proc) {
    if (proc.priority === 'high') {
      this.foregroundQueue.push(proc);
      console.log(\`[Enqueued Foreground] PID \${proc.pid}: \${proc.name}\`);
    } else {
      this.backgroundQueue.push(proc);
      console.log(\`[Enqueued Background] PID \${proc.pid}: \${proc.name}\`);
    }
  }
  
  runNextCycle() {
    // Process foreground (high priority) tasks first
    if (this.foregroundQueue.length > 0) {
      const proc = this.foregroundQueue.shift(); // O(N) for JS native array, O(1) in pointer list
      console.log(\`[Executing Foreground] Running PID \${proc.pid}: \${proc.name}\`);
      return proc;
    }
    
    // Process background batch tasks only when foreground is empty
    if (this.backgroundQueue.length > 0) {
      const proc = this.backgroundQueue.shift();
      console.log(\`[Executing Background] Running PID \${proc.pid}: \${proc.name}\`);
      return proc;
    }
    
    console.log("[Scheduler Idle] No processes in queue.");
    return null;
  }
}

// 2. Asynchronous Producer-Consumer Task Broker
class TaskBroker {
  constructor(maxConcurrency = 2) {
    this.taskQueue = [];
    this.activeWorkers = 0;
    this.maxConcurrency = maxConcurrency;
  }
  
  enqueueTask(taskFn, taskName) {
    this.taskQueue.push({ taskFn, taskName });
    console.log(\`[Enqueued Task] '\${taskName}' added to broker queue.\`);
    this.processQueue();
  }
  
  async processQueue() {
    if (this.activeWorkers >= this.maxConcurrency || this.taskQueue.length === 0) {
      return;
    }
    
    this.activeWorkers++;
    const { taskFn, taskName } = this.taskQueue.shift();
    console.log(\`[Worker Start] Active workers: \${this.activeWorkers}. Running '\${taskName}'\`);
    
    try {
      await taskFn();
    } catch (e) {
      console.error(e);
    } finally {
      this.activeWorkers--;
      console.log(\`[Worker Complete] Active workers: \${this.activeWorkers}. Completed '\${taskName}'\`);
      this.processQueue(); // Fetch next job
    }
  }
}`
    },
    bestPractices: [
      "Avoid using JS native array \`shift()\` for large queues inside production hot loops; implement a custom linked list or circular pointer queue to maintain true O(1) bounds.",
      "Design task queues with bounded capacity (backpressure limits) to prevent system memory exhaustion if producers outpace consumers.",
      "Prevent starvation in multilevel queues by implementing 'aging' (gradually upgrading low-priority tasks if they remain unexecuted for too long)."
    ]
  },
  "trees": {
    id: "trees",
    title: "Trees & Binary Trees",
    category: "Non-Linear Structures",
    summary: "Hierarchical trees, Binary Search Trees (BST), AVL balancing, and tree traversals.",
    introduction: "A tree is a widely used abstract data type that simulates a hierarchical tree structure, with a root value and subtrees of children with a parent node, represented as a set of linked nodes. In a Binary Tree, each node has at most two children.",
    concepts: [
      {
        title: "BST Properties",
        content: "A Binary Search Tree (BST) maintains sorted order: for any node, left child values are strictly smaller, and right child values are larger. This allows logarithmic lookup times."
      },
      {
        title: "Traversals (Inorder, Preorder, Postorder)",
        content: "Methods to visit all tree nodes: Inorder (Left, Node, Right — prints BST in sorted order), Preorder (Node, Left, Right — clones trees), and Postorder (Left, Right, Node — deletes nodes or computes sizes)."
      },
      {
        title: "LCA (Lowest Common Ancestor)",
        content: "The lowest node in a tree that has both node v and w as descendants. Fundamental calculation for node relations."
      }
    ],
    complexityTable: [
      { operation: "Lookup (Balanced Tree)", time: "O(log N)", space: "O(log N) stack" },
      { operation: "Lookup (Skewed Tree)", time: "O(N)", space: "O(N) stack" },
      { operation: "Inorder traversal", time: "O(N)", space: "O(H) height" },
      { operation: "Node insertion", time: "O(log N)", space: "O(1)" }
    ],
    codeExample: {
      language: "javascript",
      code: `// BST Insert and Inorder traversal
class TreeNode {
  constructor(val) {
    this.value = val;
    this.left = null;
    this.right = null;
  }
}

function insertBST(root, val) {
  if (!root) return new TreeNode(val);
  if (val < root.value) {
    root.left = insertBST(root.left, val);
  } else {
    root.right = insertBST(root.right, val);
  }
  return root;
}

function inorder(root, res = []) {
  if (root) {
    inorder(root.left, res);
    res.push(root.value);
    inorder(root.right, res);
  }
  return res;
}`
    },
    bestPractices: [
      "Inorder traversals of BSTs always yield sorted lists.",
      "Check tree balance to prevent degraded linear search paths in skewed datasets."
    ]
  },
  "heaps": {
    id: "heaps",
    title: "Heaps",
    category: "Non-Linear Structures",
    summary: "Min/Max heaps, priority sorting, and top-K query patterns.",
    introduction: "A heap is a specialized tree-based data structure which is an almost complete tree that satisfies the heap property: in a max heap, for any given node C, if P is a parent node of C, then the key of P is greater than or equal to the key of C. The reverse applies to min heaps.",
    concepts: [
      {
        title: "Array Representation",
        content: "Heaps are compactly represented as flat arrays without pointers. For any index i (0-based): Parent is at `floor((i-1)/2)`, Left child is at `2i + 1`, and Right child is at `2i + 2`."
      },
      {
        title: "Heapify & Sorting",
        content: "The process of reorganizing arrays to obey heap properties. Inserting elements takes O(log N). Creating a heap from N elements can be optimized to linear O(N) using bottom-up sift-downs."
      }
    ],
    complexityTable: [
      { operation: "Find Min/Max", time: "O(1)", space: "O(1)" },
      { operation: "Insert Element", time: "O(log N)", space: "O(1)" },
      { operation: "Extract Min/Max", time: "O(log N)", space: "O(1)" },
      { operation: "Build Heap", time: "O(N)", space: "O(N)" }
    ],
    codeExample: {
      language: "javascript",
      code: `// Min Heap basic operations
class MinHeap {
  constructor() { this.heap = []; }
  
  insert(val) {
    this.heap.push(val);
    this.bubbleUp(this.heap.length - 1);
  }
  
  bubbleUp(index) {
    while (index > 0) {
      let parent = Math.floor((index - 1) / 2);
      if (this.heap[index] >= this.heap[parent]) break;
      [this.heap[index], this.heap[parent]] = [this.heap[parent], this.heap[index]];
      index = parent;
    }
  }
}`
    },
    bestPractices: [
      "Use Min Heaps for 'K-largest' elements query, and Max Heaps for 'K-smallest' problems.",
      "HeapSort is a great alternative to MergeSort if space is extremely constrained (O(1) extra space)."
    ]
  },
  "graphs": {
    id: "graphs",
    title: "Graphs",
    category: "Non-Linear Structures",
    summary: "BFS, DFS, shortest path Dijkstra, topological sorts, and Disjoint Set Union.",
    introduction: "A graph is a structure amounting to a set of objects (vertices/nodes) in which some pairs of objects are in some sense 'related' (edges). It models complex relational systems like social webs and transport networks.",
    concepts: [
      {
        title: "BFS vs DFS",
        content: "Breadth-First Search (BFS) uses a queue to visit vertices layer-by-layer, finding shortest paths on unweighted graphs. Depth-First Search (DFS) uses recursion/stacks to explore paths as deep as possible before backtracking."
      },
      {
        title: "Dijkstra's Algorithm",
        content: "Finds shortest paths from a single source node to all other nodes in a weighted graph with non-negative edge weights. Works by greedily picking the nearest unvisited node."
      },
      {
        title: "Topological Sort",
        content: "A linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge u -> v, u comes before v in the ordering. Useful for task dependencies."
      }
    ],
    complexityTable: [
      { operation: "BFS Traversal", time: "O(V + E)", space: "O(V)" },
      { operation: "DFS Traversal", time: "O(V + E)", space: "O(V)" },
      { operation: "Dijkstra (Heap backed)", time: "O((V + E) log V)", space: "O(V)" }
    ],
    codeExample: {
      language: "javascript",
      code: `// DFS Traversal of Graph
function dfs(node, adj, visited = new Set()) {
  if (visited.has(node)) return;
  visited.add(node);
  console.log("Visited node: " + node);
  
  const neighbors = adj[node] || [];
  for (let neighbor of neighbors) {
    dfs(neighbor, adj, visited);
  }
}`
    },
    bestPractices: [
      "Use adjacency lists instead of adjacency matrices to conserve space on sparse graphs.",
      "Dijkstra does not support negative weight cycles; use Bellman-Ford in those cases."
    ]
  },
  "dynamic-programming": {
    id: "dynamic-programming",
    title: "Dynamic Programming",
    category: "Advanced Algorithms",
    summary: "Overlapping subproblems, optimal substructure, memoization, and tabulations.",
    introduction: "Dynamic Programming (DP) is an algorithmic technique for solving optimization problems by breaking them down into simpler subproblems and utilizing the fact that the optimal solution to the overall problem depends upon the optimal solutions to its subproblems.",
    concepts: [
      {
        title: "Memoization vs Tabulation",
        content: "Memoization (Top-Down) solves problems recursively and stores computed solutions in a cache. Tabulation (Bottom-Up) solves subproblems first, building a DP table iteratively without stack depth issues."
      },
      {
        title: "Optimal Substructure",
        content: "A problem has optimal substructure if an optimal solution to the problem contains within it optimal solutions to the subproblems. Required for DP."
      }
    ],
    complexityTable: [
      { operation: "Fibonacci (Naive Recursive)", time: "O(2^N)", space: "O(N) stack" },
      { operation: "Fibonacci (DP)", time: "O(N)", space: "O(N) or O(1)" },
      { operation: "0/1 Knapsack", time: "O(N * W)", space: "O(N * W) table" }
    ],
    codeExample: {
      language: "javascript",
      code: `// 0/1 Knapsack DP Tabulation
function knapsack(weights, values, W) {
  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));
  
  for (let i = 1; i <= n; i++) {
    const w = weights[i - 1];
    const v = values[i - 1];
    for (let j = 0; j <= W; j++) {
      if (w <= j) {
        dp[i][j] = Math.max(v + dp[i - 1][j - w], dp[i - 1][j]);
      } else {
        dp[i][j] = dp[i - 1][j];
      }
    }
  }
  return dp[n][W];
}`
    },
    bestPractices: [
      "Check if you can reduce space complexity (e.g. from O(N²) to O(N)) by only storing the previous rows of calculations.",
      "Formulate recursion relationships explicitly before coding."
    ]
  },
  "recursion-backtracking": {
    id: "recursion-backtracking",
    title: "Recursion & Backtracking",
    category: "Advanced Algorithms",
    summary: "Base cases, recursive trees, search pruning, and N-Queens.",
    introduction: "Backtracking is a systematic method for searching a solution space. It builds candidate solutions incrementally and abandons a candidate ('backtracks') as soon as it determines that the candidate cannot lead to a valid solution.",
    concepts: [
      {
        title: "Base Case and Stack Depth",
        content: "Every recursive function must have a base case to terminate execution. Without it, infinite recursive calls lead to stack overflows."
      },
      {
        title: "Pruning Search Space",
        content: "Pruning avoids exploring branches that are mathematically guaranteed to be invalid. Critical to keep exponential backtracking running fast."
      }
    ],
    complexityTable: [
      { operation: "N-Queens Solver", time: "O(N!)", space: "O(N) stack" },
      { operation: "Subsets Generation", time: "O(2^N)", space: "O(N) stack" },
      { operation: "Permutations", time: "O(N!)", space: "O(N)" }
    ],
    codeExample: {
      language: "javascript",
      code: `// Backtracking template: Subset generation
function generateSubsets(nums) {
  const result = [];
  
  function backtrack(start, currentPath) {
    result.push([...currentPath]);
    
    for (let i = start; i < nums.length; i++) {
      currentPath.push(nums[i]);
      backtrack(i + 1, currentPath); // Move next
      currentPath.pop(); // Backtrack
    }
  }
  
  backtrack(0, []);
  return result;
}`
    },
    bestPractices: [
      "Always copy dynamic paths (e.g., `[...path]`) before pushing them to output arrays in backtracking.",
      "Think of recursion trees to visualize branching factors."
    ]
  },
  "greedy-algorithms": {
    id: "greedy-algorithms",
    title: "Greedy Algorithms",
    category: "Advanced Algorithms",
    summary: "Local optimal choices, Huffman compression, and interval scheduling.",
    introduction: "A greedy algorithm is an algorithmic paradigm that follows the problem-solving heuristic of making the locally optimal choice at each stage with the hope of finding a global optimum.",
    concepts: [
      {
        title: "Greedy Choice Property",
        content: "A globally optimal solution can be reached by making locally optimal (greedy) choices without looking back."
      },
      {
        title: "Interval Scheduling",
        content: "Sort intervals by end times. Greedily pick the first non-overlapping interval. Proved mathematically to yield maximum possible disjoint schedule count."
      }
    ],
    complexityTable: [
      { operation: "Fractional Knapsack", time: "O(N log N)", space: "O(1)" },
      { operation: "Huffman Encoding", time: "O(N log N)", space: "O(N)" },
      { operation: "Activity Selection", time: "O(N log N)", space: "O(1)" }
    ],
    codeExample: {
      language: "javascript",
      code: `// Greedy Activity Selection (Interval Scheduling)
function maxActivities(start, end) {
  const activities = start.map((s, i) => ({ s, e: end[i], idx: i }));
  
  // Sort activities by end time
  activities.sort((a, b) => a.e - b.e);
  
  const selected = [];
  let lastEnd = -1;
  
  for (let act of activities) {
    if (act.s >= lastEnd) {
      selected.push(act.idx);
      lastEnd = act.e;
    }
  }
  return selected;
}`
    },
    bestPractices: [
      "Greedy choices do not always guarantee global optimums; verify correctness using proofs before adopting.",
      "Sorting inputs is almost always the first step in greedy algorithm patterns."
    ]
  },
  "sorting-algorithms": {
    id: "sorting-algorithms",
    title: "Sorting Algorithms",
    category: "Advanced Algorithms",
    summary: "Bubble, insertion, selection, quick, merge, and heap sorting comparison.",
    introduction: "Sorting is the process of arranging elements in a systematic order (numerical or lexicographical). Efficient sorting is critical for optimizing other algorithms like search and merge operations.",
    concepts: [
      {
        title: "Stability in Sorting",
        content: "A sorting algorithm is stable if it preserves the relative order of duplicate elements. Crucial when sorting complex objects by multiple properties."
      },
      {
        title: "QuickSort vs MergeSort",
        content: "QuickSort partitions arrays in-place with average O(N log N) but worst-case O(N²). MergeSort splits elements recursively, requiring O(N) memory but guaranteeing stable O(N log N) worst-case performance."
      }
    ],
    complexityTable: [
      { operation: "Merge Sort", time: "O(N log N)", space: "O(N)" },
      { operation: "Quick Sort", time: "O(N log N) average", space: "O(log N)" },
      { operation: "Bubble / Selection", time: "O(N²)", space: "O(1)" },
      { operation: "Heap Sort", time: "O(N log N)", space: "O(1)" }
    ],
    codeExample: {
      language: "javascript",
      code: `// Merge Sort Implementation
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let l = 0, r = 0;
  while (l < left.length && r < right.length) {
    if (left[l] <= right[r]) result.push(left[l++]);
    else result.push(right[r++]);
  }
  return [...result, ...left.slice(l), ...right.slice(r)];
}`
    },
    bestPractices: [
      "Use insertion sort for small arrays (N < 20) as overhead constants are very small.",
      "Understand standard library sort behaviors (e.g. Timsort in Python/V8 Engine)."
    ]
  },
  "searching-algorithms": {
    id: "searching-algorithms",
    title: "Searching",
    category: "Advanced Algorithms",
    summary: "Linear search, Binary Search templates, and search space reduction.",
    introduction: "Searching algorithms retrieve information stored within some data structure. Linear searches inspect items sequentially. Binary searches divide search spaces in halves on pre-sorted collections.",
    concepts: [
      {
        title: "Binary Search Template",
        content: "Ensure correct boundary limits. Maintain loop invariant `low <= high`. Update pointers securely to avoid infinite loops: `low = mid + 1` or `high = mid - 1`."
      },
      {
        title: "Search on Rotated Arrays",
        content: "By checking whether the left or right half is normally sorted, we can perform binary search on arrays rotated around pivots in O(log N)."
      }
    ],
    complexityTable: [
      { operation: "Linear Search", time: "O(N)", space: "O(1)" },
      { operation: "Binary Search", time: "O(log N)", space: "O(1)" },
      { operation: "Rotated search", time: "O(log N)", space: "O(1)" }
    ],
    codeExample: {
      language: "javascript",
      code: `// Binary Search template
function binarySearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;
  
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) {
      return mid; // Found
    } else if (arr[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return -1; // Not found
}`
    },
    bestPractices: [
      "Use `low + Math.floor((high - low) / 2)` to avoid integer overflow issues in languages with strict types.",
      "Always check if inputs are sorted before selecting binary search."
    ]
  },
  "math-algorithms": {
    id: "math-algorithms",
    title: "Mathematics & Number Theory",
    category: "Basics & Foundations",
    summary: "Essential math formulas used in programming: GCD, LCM, Prime Sieve, Modular Exponentiation, and combinations.",
    introduction: "Mathematics is the bedrock of computer science and algorithm design. In programming, number theory, arithmetic progressions, modular logic, and combinatorics frequently serve as optimization tools, converting linear or exponential runtime problems into constant or logarithmic operations.",
    concepts: [
      {
        title: "Euclidean GCD & LCM",
        content: "Greatest Common Divisor (GCD) of two integers is the largest positive integer that divides both without a remainder. Euclid's algorithm calculates this recursively based on the relation `gcd(a, b) = gcd(b, a % b)`. Lowest Common Multiple (LCM) is computed using the identity: `lcm(a, b) = (a * b) / gcd(a, b)`."
      },
      {
        title: "Prime Sieve (Sieve of Eratosthenes)",
        content: "Used to find all prime numbers up to a limit N. Instead of testing each number for primality up to N (which is slow), we create a boolean array of size N+1 initialized to true. Starting at 2, if a number is prime, we mark all of its multiples as composite. Runs in `O(N log log N)` time."
      },
      {
        title: "Binary Modular Exponentiation",
        content: "Computes `(a^b) % m` efficiently in `O(log b)` time. Instead of multiplying a by itself b times (which overflows quickly and runs in linear time), we divide the exponent b in half at each step: if b is even, `a^b = (a^(b/2))^2`; if b is odd, `a^b = a * (a^((b-1)/2))^2`."
      },
      {
        title: "Combinatorics & Pascal's nCr",
        content: "nCr represents the number of ways to choose r elements from a set of n elements. Formulated as `n! / (r! * (n - r)!)`. In programming, direct factorial calculation overflows quickly. Instead, we compute nCr dynamically using Pascal's Identity: `nCr = (n-1)C(r-1) + (n-1)Cr`, which is solved with 2D Dynamic Programming."
      }
    ],
    complexityTable: [
      { operation: "Euclidean GCD", time: "O(log(min(a, b)))", space: "O(log(min(a, b))) recursion stack" },
      { operation: "Sieve of Eratosthenes", time: "O(N log log N)", space: "O(N) boolean array" },
      { operation: "Binary Exponentiation", time: "O(log B)", space: "O(1)" },
      { operation: "nCr combinations (DP)", time: "O(N * R)", space: "O(N * R) grid" },
      { operation: "Primality Test (Trial Division)", time: "O(sqrt(N))", space: "O(1)" }
    ],
    codeExample: {
      language: "javascript",
      code: `// 1. Greatest Common Divisor (GCD) & LCM
function gcd(a, b) {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

function lcm(a, b) {
  if (a === 0 || b === 0) return 0;
  // Divide first to prevent intermediate product overflow
  return Math.abs(a / gcd(a, b) * b);
}

// 2. Sieve of Eratosthenes (Primes up to N)
function sieveOfEratosthenes(n) {
  const isPrime = Array(n + 1).fill(true);
  isPrime[0] = isPrime[1] = false;
  
  for (let p = 2; p * p <= n; p++) {
    if (isPrime[p]) {
      for (let i = p * p; i <= n; i += p) {
        isPrime[i] = false;
      }
    }
  }
  
  const primes = [];
  for (let i = 2; i <= n; i++) {
    if (isPrime[i]) primes.push(i);
  }
  return primes;
}

// 3. Binary Modular Exponentiation: (base^exp) % mod
function power(base, exp, mod) {
  let res = 1n;
  base = BigInt(base) % BigInt(mod);
  exp = BigInt(exp);
  const m = BigInt(mod);
  
  while (exp > 0n) {
    if (exp % 2n === 1n) {
      res = (res * base) % m;
    }
    base = (base * base) % m;
    exp = exp / 2n;
  }
  return Number(res);
}

// 4. nCr Combinations using DP Table
function getCombinations(n, r) {
  if (r < 0 || r > n) return 0;
  const dp = Array.from({ length: n + 1 }, () => Array(r + 1).fill(0));
  
  for (let i = 0; i <= n; i++) {
    for (let j = 0; j <= Math.min(i, r); j++) {
      if (j === 0 || j === i) {
        dp[i][j] = 1;
      } else {
        dp[i][j] = dp[i - 1][j - 1] + dp[i - 1][j];
      }
    }
  }
  return dp[n][r];
}`
    },
    bestPractices: [
      "When computing LCM, divide first `(a / gcd) * b` to prevent number size overflow.",
      "Use BigInt in Javascript when dealing with modular exponentiation or modular inverse to prevent standard 53-bit floating point precision loss.",
      "Precompute primes once using Sieve if you need to repeatedly check numbers up to N."
    ]
  }
}
