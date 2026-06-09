"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, AlertCircle, Code2, BookOpen, Layers } from "lucide-react"

const CODE_SNIPPETS = {
  circular: {
    label: "Circular Queue (C)",
    lang: "c",
    code: `#define MAX 8

typedef struct {
    int data[MAX];
    int front, rear, size;
} CircularQueue;

void init(CircularQueue* q) {
    q->front = q->rear = 0;
    q->size = 0;
}

int isFull(CircularQueue* q)  { return q->size == MAX; }
int isEmpty(CircularQueue* q) { return q->size == 0; }

/* O(1) Enqueue — no shifting! */
void enqueue(CircularQueue* q, int val) {
    if (isFull(q)) { printf("OVERFLOW\\n"); return; }
    q->data[q->rear] = val;
    q->rear = (q->rear + 1) % MAX;   // ← wrap-around
    q->size++;
}

/* O(1) Dequeue — just advance front pointer */
int dequeue(CircularQueue* q) {
    if (isEmpty(q)) { printf("UNDERFLOW\\n"); return -1; }
    int val = q->data[q->front];
    q->front = (q->front + 1) % MAX; // ← wrap-around
    q->size--;
    return val;
}`,
  },
  priority: {
    label: "Priority Queue (TypeScript / Min-Heap)",
    lang: "typescript",
    code: `class MinHeap<T> {
  private heap: { val: T; priority: number }[] = []

  /** O(log N) — sift up after insert */
  push(val: T, priority: number) {
    this.heap.push({ val, priority })
    this._siftUp(this.heap.length - 1)
  }

  /** O(log N) — swap root, sift down */
  pop(): T | undefined {
    if (!this.heap.length) return undefined
    const top = this.heap[0].val
    const last = this.heap.pop()!
    if (this.heap.length > 0) {
      this.heap[0] = last
      this._siftDown(0)
    }
    return top
  }

  peek(): T | undefined { return this.heap[0]?.val }
  size(): number { return this.heap.length }

  private _siftUp(i: number) {
    while (i > 0) {
      const parent = (i - 1) >> 1
      if (this.heap[parent].priority <= this.heap[i].priority) break
      ;[this.heap[parent], this.heap[i]] = [this.heap[i], this.heap[parent]]
      i = parent
    }
  }

  private _siftDown(i: number) {
    const n = this.heap.length
    while (true) {
      let smallest = i
      const l = 2 * i + 1, r = 2 * i + 2
      if (l < n && this.heap[l].priority < this.heap[smallest].priority) smallest = l
      if (r < n && this.heap[r].priority < this.heap[smallest].priority) smallest = r
      if (smallest === i) break
      ;[this.heap[smallest], this.heap[i]] = [this.heap[i], this.heap[smallest]]
      i = smallest
    }
  }
}`,
  },
  mlq: {
    label: "Multilevel Queue Scheduler (TypeScript)",
    lang: "typescript",
    code: `interface Process {
  pid: number; name: string; burst: number;
  type: "foreground" | "background"
}

class MLQScheduler {
  // Two separate FIFO queues — different priority levels
  private foreground: Process[] = []  // Interactive — highest priority
  private background: Process[] = []  // Batch     — lowest  priority

  enqueue(proc: Process) {
    if (proc.type === "foreground") {
      this.foreground.push(proc)         // O(1) enqueue
    } else {
      this.background.push(proc)         // O(1) enqueue
    }
  }

  /** Dispatch next task to CPU.
   *  Rule: Foreground ALWAYS preempts Background. */
  dispatch(): Process | null {
    if (this.foreground.length > 0) {
      return this.foreground.shift()     // O(1) — pointer linked list in real OS
    }
    if (this.background.length > 0) {
      return this.background.shift()     // O(1)
    }
    return null                          // CPU idle
  }
}

// --- Usage ---
const scheduler = new MLQScheduler()
scheduler.enqueue({ pid: 101, name: "Chrome_UI", burst: 3, type: "foreground" })
scheduler.enqueue({ pid: 202, name: "DB_Backup",  burst: 8, type: "background" })
scheduler.enqueue({ pid: 103, name: "Keypress",   burst: 1, type: "foreground" })

let cpu: Process | null
while ((cpu = scheduler.dispatch()) !== null) {
  console.log(\`[CPU] Executing PID \${cpu.pid}: \${cpu.name} (\${cpu.burst} ticks)\`)
}`,
  },
  msgqueue: {
    label: "Message Queue Broker (TypeScript)",
    lang: "typescript",
    code: `interface Message { id: string; payload: string; type: string }

class MessageBroker {
  private queue: Message[] = []
  private consumers: ((msg: Message) => void)[] = []
  private processing = false

  /** Producer: O(1) — push to rear */
  publish(msg: Message) {
    this.queue.push(msg)
    console.log(\`[Broker] Published \${msg.id}. Queue depth: \${this.queue.length}\`)
    this._tryDispatch()
  }

  /** Register a worker / consumer */
  subscribe(handler: (msg: Message) => void) {
    this.consumers.push(handler)
  }

  /** Dispatch: pull from FRONT, round-robin to workers */
  private async _tryDispatch() {
    if (this.processing || this.queue.length === 0) return
    this.processing = true

    while (this.queue.length > 0) {
      const msg = this.queue.shift()!     // O(1) with linked-list impl.
      const worker = this.consumers[
        Math.floor(Math.random() * this.consumers.length)
      ]
      await worker(msg)
    }
    this.processing = false
  }
}

// --- Usage ---
const broker = new MessageBroker()
broker.subscribe(async (msg) => {
  console.log(\`[Worker A] Processing: \${msg.payload}\`)
})
broker.subscribe(async (msg) => {
  console.log(\`[Worker B] Processing: \${msg.payload}\`)
})

broker.publish({ id: "m1", payload: "Send invoice email", type: "Email" })
broker.publish({ id: "m2", payload: "Verify payment",    type: "Payment" })`,
  },
}

const MATRIX = [
  {
    scenario: "Task job queue, async processing",
    queue: { ok: true, note: "Perfect — FIFO preserves order, O(1) ops" },
    array: { ok: false, note: "shift() = O(N) — shifts every element" },
    stack: { ok: false, note: "LIFO — starves oldest tasks" },
    hashmap: { ok: false, note: "No order — arbitrary pop" },
  },
  {
    scenario: "OS CPU scheduling (multilevel)",
    queue: { ok: true, note: "Dual FIFO queues, O(1) dispatch" },
    array: { ok: false, note: "O(N) deletion from front" },
    stack: { ok: false, note: "Newest process runs first — LIFO starvation" },
    hashmap: { ok: false, note: "No chronological sequence" },
  },
  {
    scenario: "Circular buffer / fixed ring",
    queue: { ok: true, note: "Circular Queue — O(1), no wasted memory" },
    array: { ok: false, note: "Fixed array shifts elements = O(N)" },
    stack: { ok: false, note: "LIFO, wrong order" },
    hashmap: { ok: false, note: "Unbounded, no wrap-around" },
  },
  {
    scenario: "Emergency room / print triage",
    queue: { ok: true, note: "Priority Queue — O(log N) insert/extract" },
    array: { ok: false, note: "O(N) linear scan to find max priority" },
    stack: { ok: false, note: "Cannot sort by arbitrary priority" },
    hashmap: { ok: false, note: "No inherent priority ordering" },
  },
  {
    scenario: "BFS graph traversal",
    queue: { ok: true, note: "FIFO exactly matches BFS level-order" },
    array: { ok: false, note: "Possible but O(N) dequeue" },
    stack: { ok: false, note: "DFS, not BFS" },
    hashmap: { ok: false, note: "No traversal order" },
  },
]

const REAL_WORLD = [
  { name: "RabbitMQ / Kafka", type: "Message Queue", color: "cyan", use: "Async task pipelines, microservices decoupling" },
  { name: "Linux CFS Scheduler", type: "Multilevel Queue", color: "amber", use: "OS process priority scheduling (interactive vs batch)" },
  { name: "Network Router Buffer", type: "Circular Queue", color: "purple", use: "Fixed-size ring buffer for IP packet queue" },
  { name: "Dijkstra's Algorithm", type: "Priority Queue (Min-Heap)", color: "emerald", use: "Always expand the lowest-cost vertex next" },
  { name: "JavaScript Event Loop", type: "Message Queue", color: "blue", use: "Microtask / macrotask FIFO ordering in browser" },
  { name: "Printer Spooler", type: "Priority Queue", color: "rose", use: "VIP documents print ahead of normal jobs" },
]

export function MatrixExplanationTab() {
  const [activeCode, setActiveCode] = useState<keyof typeof CODE_SNIPPETS>("circular")
  const snippet = CODE_SNIPPETS[activeCode]

  return (
    <div className="space-y-8">

      {/* WHY QUEUES SECTION */}
      <Card className="border-muted/80 bg-card/65 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyan-400">
            <Layers className="h-5 w-5" />
            Developer Decision Matrix — When to Use Which Data Structure
          </CardTitle>
          <CardDescription>
            Queue vs Array vs Stack vs HashMap — a complete breakdown by real-world scenario.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-muted/60">
                <th className="text-left py-3 px-3 text-muted-foreground font-semibold w-1/3">Scenario / Use-case</th>
                <th className="text-center py-3 px-3 text-cyan-400 font-bold">Queue ✅</th>
                <th className="text-center py-3 px-3 text-muted-foreground font-bold">Array</th>
                <th className="text-center py-3 px-3 text-muted-foreground font-bold">Stack</th>
                <th className="text-center py-3 px-3 text-muted-foreground font-bold">HashMap</th>
              </tr>
            </thead>
            <tbody>
              {MATRIX.map((row, i) => (
                <tr key={i} className="border-b border-muted/30 hover:bg-muted/10 transition-colors">
                  <td className="py-3 px-3 text-white font-semibold leading-snug">{row.scenario}</td>
                  {[row.queue, row.array, row.stack, row.hashmap].map((cell, ci) => (
                    <td key={ci} className="py-3 px-3 text-center align-top">
                      <div className="flex flex-col items-center gap-1">
                        {cell.ok ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                        )}
                        <span className={`text-[10px] leading-tight text-left ${cell.ok ? "text-emerald-300" : "text-slate-500"}`}>
                          {cell.note}
                        </span>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* REAL-WORLD APPLICATIONS */}
      <div>
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-cyan-400" /> Real-World Systems Using Queues
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {REAL_WORLD.map((item, i) => {
            const colors: Record<string, string> = {
              cyan: "bg-cyan-500/10 border-cyan-500/30 text-cyan-300",
              amber: "bg-amber-500/10 border-amber-500/30 text-amber-300",
              purple: "bg-purple-500/10 border-purple-500/30 text-purple-300",
              emerald: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
              blue: "bg-blue-500/10 border-blue-500/30 text-blue-300",
              rose: "bg-rose-500/10 border-rose-500/30 text-rose-300",
            }
            return (
              <div key={i} className={`p-4 rounded-xl border ${colors[item.color]} bg-card/50`}>
                <p className="font-bold text-sm leading-tight">{item.name}</p>
                <Badge variant="outline" className="text-[10px] mt-1 mb-2 opacity-80">{item.type}</Badge>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.use}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* CODE SNIPPETS VIEWER */}
      <div>
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
          <Code2 className="h-4 w-4 text-cyan-400" /> Production-Ready Implementations
        </h3>

        <div className="flex flex-wrap gap-2 mb-4">
          {(Object.keys(CODE_SNIPPETS) as (keyof typeof CODE_SNIPPETS)[]).map(key => (
            <Button
              key={key}
              size="sm"
              variant={activeCode === key ? "default" : "outline"}
              className={`text-xs h-8 ${activeCode === key ? "bg-cyan-600 text-white hover:bg-cyan-700" : ""}`}
              onClick={() => setActiveCode(key)}
            >
              {CODE_SNIPPETS[key].label}
            </Button>
          ))}
        </div>

        <Card className="border-muted/80 bg-card/65 backdrop-blur-sm overflow-hidden">
          <CardHeader className="py-3 px-4 border-b border-muted/50 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-mono text-cyan-400 font-bold">{snippet.label}</CardTitle>
            <Badge variant="outline" className="text-[10px] uppercase">{snippet.lang}</Badge>
          </CardHeader>
          <CardContent className="p-0">
            <pre className="bg-black/90 p-5 overflow-x-auto text-xs font-mono leading-relaxed text-slate-200 scrollbar-thin max-h-[420px] overflow-y-auto">
              <code>{snippet.code}</code>
            </pre>
          </CardContent>
        </Card>
      </div>

      {/* BIG-O SUMMARY TABLE */}
      <Card className="border-muted/80 bg-card/65 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-400 text-sm">
            <AlertCircle className="h-4 w-4" />
            Time Complexity Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-muted/60 text-muted-foreground">
                <th className="text-left py-2 px-3">Operation</th>
                <th className="text-center py-2 px-3">FIFO Queue</th>
                <th className="text-center py-2 px-3">Circular Queue</th>
                <th className="text-center py-2 px-3">Priority Queue</th>
                <th className="text-center py-2 px-3">Array (naive)</th>
              </tr>
            </thead>
            <tbody className="text-slate-200">
              {[
                ["Enqueue / Push", "O(1)", "O(1)", "O(log N)", "O(1) amortized"],
                ["Dequeue / Pop front", "O(1)", "O(1)", "O(log N)", "O(N) — shift!"],
                ["Peek front element", "O(1)", "O(1)", "O(1)", "O(1)"],
                ["Search element", "O(N)", "O(N)", "O(N)", "O(N)"],
                ["Space usage", "O(N)", "O(N) fixed", "O(N)", "O(N)"],
              ].map(([op, fifo, cq, pq, arr], i) => (
                <tr key={i} className="border-b border-muted/20 hover:bg-muted/10">
                  <td className="py-2 px-3 font-semibold text-white">{op}</td>
                  <td className="py-2 px-3 text-center text-emerald-400 font-bold">{fifo}</td>
                  <td className="py-2 px-3 text-center text-emerald-400 font-bold">{cq}</td>
                  <td className="py-2 px-3 text-center text-amber-400 font-bold">{pq}</td>
                  <td className="py-2 px-3 text-center text-red-400">{arr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
