"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Play, Pause, Plus, Trash2, Cpu, Server, User, 
  Zap, ArrowRight, CheckCircle2, AlertCircle, Terminal, Info 
} from "lucide-react"

interface TaskMessage {
  id: string
  type: "Email" | "Payment" | "SMS" | "Report"
  content: string
  status: "pending" | "processing" | "completed"
  producer: string
  progress: number
  duration: number // in ms
}

interface WorkerThread {
  id: string
  name: string
  activeTaskId: string | null
  processedCount: number
}

export function MessageQueueTab() {
  const [queue, setQueue] = useState<TaskMessage[]>([])
  const [completed, setCompleted] = useState<TaskMessage[]>([])
  const [workers, setWorkers] = useState<WorkerThread[]>([
    { id: "w1", name: "Worker Thread 1", activeTaskId: null, processedCount: 0 },
    { id: "w2", name: "Worker Thread 2", activeTaskId: null, processedCount: 0 },
  ])
  const [logs, setLogs] = useState<string[]>([
    "System Initialized. Broker listening on port 5672.",
    "Worker Thread 1 started and waiting for tasks.",
    "Worker Thread 2 started and waiting for tasks."
  ])
  
  const [customText, setCustomText] = useState("")
  const [customType, setCustomType] = useState<"Email" | "Payment" | "SMS" | "Report">("Email")
  const [isAutoSpiking, setIsAutoSpiking] = useState(false)
  
  const logsEndRef = useRef<HTMLDivElement>(null)
  const idCounter = useRef(100)

  // Auto scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [logs])

  // Log helper
  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `[${timestamp}] ${msg}`])
  }

  // Enqueue Task
  const enqueueTask = (type: "Email" | "Payment" | "SMS" | "Report", content: string, producer = "Client App") => {
    const newId = `msg-${idCounter.current++}`
    const duration = type === "Payment" ? 4000 : type === "Report" ? 6000 : 2500
    const newTask: TaskMessage = {
      id: newId,
      type,
      content,
      status: "pending",
      producer,
      progress: 0,
      duration
    }
    
    setQueue(prev => [...prev, newTask])
    addLog(`[Publisher: ${producer}] Enqueued ${type} Task: "${content}" (${(duration/1000).toFixed(1)}s burst)`)
  }

  // Handle manual queue addition
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    const text = customText.trim() || `Process ${customType} payload #${idCounter.current}`
    enqueueTask(customType, text, "Manual Dashboard")
    setCustomText("")
  }

  // Scale Worker pool
  const addWorker = () => {
    const nextNum = workers.length + 1
    if (nextNum > 6) {
      addLog("Broker Warning: Maximum consumer threads (6) reached.")
      return
    }
    setWorkers(prev => [...prev, {
      id: `w${nextNum}`,
      name: `Worker Thread ${nextNum}`,
      activeTaskId: null,
      processedCount: 0
    }])
    addLog(`Worker Thread ${nextNum} spawned and listening.`)
  }

  const removeWorker = () => {
    if (workers.length <= 1) {
      addLog("Broker Warning: Cannot scale down below 1 worker thread.")
      return
    }
    const target = workers[workers.length - 1]
    
    // Release task if processing
    if (target.activeTaskId) {
      setQueue(prev => prev.map(t => t.id === target.activeTaskId ? { ...t, status: "pending", progress: 0 } : t))
    }
    
    setWorkers(prev => prev.slice(0, -1))
    addLog(`Terminated ${target.name}.`)
  }

  // Simulate Traffic Spike
  const triggerTrafficSpike = () => {
    const payloads = [
      { type: "Payment" as const, text: "Verify stripe authorization ch_398a" },
      { type: "Email" as const, text: "Send transaction confirmation bill_1092" },
      { type: "SMS" as const, text: "OTP authentication 2FA challenge 893-192" },
      { type: "Report" as const, text: "Generate Q2 Financial Ledger CSV" },
      { type: "Email" as const, text: "Dispatch weekly user analytics overview" }
    ]
    payloads.forEach((p, i) => {
      setTimeout(() => {
        enqueueTask(p.type, p.text, "Autoscale Webhook")
      }, i * 300)
    })
    addLog("🚀 Traffic Spike Triggered: 5 concurrent API requests received!")
  }

  // Clear Broker State
  const handleClear = () => {
    setQueue([])
    setCompleted([])
    setWorkers(prev => prev.map(w => ({ ...w, activeTaskId: null })))
    setLogs(["Broker state cleared. Logs reset."])
  }

  // Consumer coordination loop
  useEffect(() => {
    // Find any pending task and idle worker
    const pendingTaskIndex = queue.findIndex(t => t.status === "pending")
    const idleWorkerIndex = workers.findIndex(w => w.activeTaskId === null)

    if (pendingTaskIndex !== -1 && idleWorkerIndex !== -1) {
      const task = queue[pendingTaskIndex]
      const worker = workers[idleWorkerIndex]

      // Mark task as processing
      setQueue(prev => prev.map((t, idx) => idx === pendingTaskIndex ? { ...t, status: "processing" } : t))
      // Assign task to worker
      setWorkers(prev => prev.map((w, idx) => idx === idleWorkerIndex ? { ...w, activeTaskId: task.id } : w))
      
      addLog(`[Broker Dispatcher] Assigned ${task.id} to ${worker.name}`)

      // Simulate worker timer
      const startTime = Date.now()
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime
        const pct = Math.min(100, (elapsed / task.duration) * 100)

        // Update task progress in queue
        setQueue(prev => prev.map(t => {
          if (t.id === task.id) {
            return { ...t, progress: pct }
          }
          return t
        }))

        if (pct >= 100) {
          clearInterval(interval)
          // Finish task
          setQueue(prev => prev.filter(t => t.id !== task.id))
          setCompleted(prev => [...prev, { ...task, status: "completed", progress: 100 }])
          setWorkers(prev => prev.map(w => {
            if (w.id === worker.id) {
              return { ...w, activeTaskId: null, processedCount: w.processedCount + 1 }
            }
            return w
          }))
          addLog(`[Broker Consumer] ${worker.name} successfully completed ${task.id} ("${task.content}")`)
        }
      }, 100)

      return () => clearInterval(interval)
    }
  }, [queue, workers])

  // Traffic Generator
  useEffect(() => {
    if (!isAutoSpiking) return
    const interval = setInterval(() => {
      const types = ["Email", "Payment", "SMS", "Report"] as const
      const type = types[Math.floor(Math.random() * types.length)]
      enqueueTask(type, `Automated heartbeat load test for ${type.toLowerCase()} microservice`, "Heartbeat Daemon")
    }, 4500)
    return () => clearInterval(interval)
  }, [isAutoSpiking])

  return (
    <div className="space-y-6">
      {/* Topology Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-muted/40 p-4 rounded-xl border border-muted/80 backdrop-blur-sm">
        <div className="text-center p-2 rounded-lg bg-background/50 border border-muted">
          <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Broker Engine</p>
          <p className="text-xl font-bold text-cyan-400">RabbitMQ Model</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-background/50 border border-muted">
          <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Queue Length</p>
          <p className="text-xl font-bold text-yellow-500">{queue.length} Tasks</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-background/50 border border-muted">
          <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Active Workers</p>
          <p className="text-xl font-bold text-green-400">
            {workers.filter(w => w.activeTaskId !== null).length} / {workers.length}
          </p>
        </div>
        <div className="text-center p-2 rounded-lg bg-background/50 border border-muted">
          <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Total Handled</p>
          <p className="text-xl font-bold text-purple-400">{completed.length} Messages</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* LEFT COLUMN: CONTROLS */}
        <div className="space-y-6">
          {/* Publisher Console */}
          <Card className="border-muted/80 bg-card/65 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-cyan-400">
                <Zap className="h-5 w-5" />
                Task Publisher Exchange
              </CardTitle>
              <CardDescription>
                Submit asynchronous work items to the topic broker exchange
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleAddTask} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground font-semibold">Task Type</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(["Email", "SMS", "Payment", "Report"] as const).map(t => (
                      <Button
                        key={t}
                        type="button"
                        variant={customType === t ? "default" : "outline"}
                        className={`text-xs px-2 py-1 h-8 ${
                          customType === t 
                            ? t === "Email" ? "bg-blue-600 text-white hover:bg-blue-700"
                              : t === "SMS" ? "bg-cyan-600 text-white hover:bg-cyan-700"
                              : t === "Payment" ? "bg-emerald-600 text-white hover:bg-emerald-700"
                              : "bg-amber-600 text-white hover:bg-amber-700"
                            : ""
                        }`}
                        onClick={() => setCustomType(t)}
                      >
                        {t}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground font-semibold">Message Payload</label>
                  <Input
                    placeholder="Enter custom workload metadata..."
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    className="bg-background/50 h-9"
                  />
                </div>

                <Button type="submit" className="w-full h-9 gap-2">
                  <Plus className="h-4 w-4" /> Publish Task
                </Button>
              </form>

              <div className="border-t border-muted/80 pt-4 space-y-2">
                <Button 
                  onClick={triggerTrafficSpike} 
                  variant="secondary"
                  className="w-full gap-2 hover:bg-yellow-500/10 hover:text-yellow-500 transition-colors"
                >
                  <Zap className="h-4 w-4 text-yellow-500" /> Simulate API Traffic Spike (+5)
                </Button>
                
                <Button 
                  onClick={() => setIsAutoSpiking(!isAutoSpiking)}
                  variant={isAutoSpiking ? "destructive" : "outline"}
                  className="w-full gap-2"
                >
                  {isAutoSpiking ? (
                    <>
                      <Pause className="h-4 w-4" /> Stop Heartbeat Generator
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 text-emerald-400" /> Start Heartbeat Generator
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Consumer Auto-scaler */}
          <Card className="border-muted/80 bg-card/65 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-green-400">
                <Server className="h-5 w-5" />
                Consumer Autoscale Pool
              </CardTitle>
              <CardDescription>
                Scale worker threads to process messages concurrently
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm bg-background/30 p-3 rounded-lg border border-muted/50">
                <span>Worker Threads: <strong className="text-green-400">{workers.length}</strong></span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="h-7 w-7 p-0" onClick={removeWorker}>-</Button>
                  <Button size="sm" variant="outline" className="h-7 w-7 p-0" onClick={addWorker}>+</Button>
                </div>
              </div>

              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {workers.map(w => {
                  const activeTask = queue.find(t => t.id === w.activeTaskId)
                  return (
                    <div 
                      key={w.id} 
                      className={`text-xs p-2 rounded border transition-all flex items-center justify-between ${
                        w.activeTaskId 
                          ? "bg-green-500/10 border-green-500/30 text-green-200" 
                          : "bg-muted/30 border-muted/50 text-muted-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Cpu className={`h-3.5 w-3.5 ${w.activeTaskId ? "animate-spin text-green-400" : ""}`} />
                        <span>{w.name}</span>
                      </div>
                      <div className="text-right">
                        {activeTask ? (
                          <Badge variant="outline" className="text-[10px] bg-green-500/20 text-green-400 border-green-500/30 h-5">
                            Processing {activeTask.id}
                          </Badge>
                        ) : (
                          <span className="text-[10px] text-muted-foreground">Idle (Total: {w.processedCount})</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* MIDDLE/RIGHT: VISUAL QUEUE CONVEYOR BELT */}
        <div className="xl:col-span-2 space-y-6">
          {/* Conveyor Belt Queue Display */}
          <Card className="border-muted/80 bg-card/65 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-2 border-b border-muted/50 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Server className="h-5 w-5 text-cyan-400" />
                  Message Queue Buffer
                </CardTitle>
                <CardDescription>FIFO task orchestration channel</CardDescription>
              </div>
              <Button size="sm" variant="ghost" onClick={handleClear} className="text-muted-foreground hover:text-destructive h-8 px-2 gap-1.5">
                <Trash2 className="h-3.5 w-3.5" /> Clear All
              </Button>
            </CardHeader>
            
            <CardContent className="py-6 bg-slate-950/40 relative min-h-[220px] flex items-center">
              {/* Conveyor Belt Graphic Background */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-16 bg-muted/20 border-y border-muted/30 flex items-center justify-around pointer-events-none opacity-40">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="w-1.5 h-16 bg-muted/60 transform rotate-12" />
                ))}
              </div>

              {/* Head / Tail Markers */}
              <div className="absolute top-3 left-4 text-xs font-mono font-bold text-red-400 uppercase tracking-widest flex items-center gap-1">
                <span>FRONT (DEQUEUE)</span>
                <ArrowRight className="h-3 w-3" />
              </div>
              
              <div className="absolute top-3 right-4 text-xs font-mono font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1">
                <ArrowRight className="h-3 w-3" />
                <span>REAR (ENQUEUE)</span>
              </div>

              <div className="w-full flex items-center gap-3 overflow-x-auto py-8 px-2 relative z-10 scrollbar-thin scrollbar-thumb-muted">
                <AnimatePresence mode="popLayout">
                  {queue.map((task, index) => {
                    const typeColor = 
                      task.type === "Email" ? "border-blue-500 text-blue-400 bg-blue-500/5" :
                      task.type === "SMS" ? "border-cyan-500 text-cyan-400 bg-cyan-500/5" :
                      task.type === "Payment" ? "border-emerald-500 text-emerald-400 bg-emerald-500/5" :
                      "border-amber-500 text-amber-400 bg-amber-500/5"
                    
                    return (
                      <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, scale: 0.8, x: 100 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, x: -100 }}
                        transition={{ type: "spring", stiffness: 260, damping: 25 }}
                        className={`flex-shrink-0 w-48 p-3 rounded-lg border ${typeColor} relative group hover:shadow-lg transition-shadow bg-card/90`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-mono opacity-80">{task.id}</span>
                          <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 uppercase tracking-wider">{task.type}</Badge>
                        </div>
                        <p className="text-xs font-semibold font-mono truncate mb-3 text-white">{task.content}</p>
                        
                        {/* Progress or status indicators */}
                        {task.status === "processing" ? (
                          <div className="space-y-1">
                            <div className="flex justify-between text-[9px] text-green-400 font-mono">
                              <span className="animate-pulse">Processing...</span>
                              <span>{Math.round(task.progress)}%</span>
                            </div>
                            <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-green-500 transition-all duration-100" 
                                style={{ width: `${task.progress}%` }} 
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
                            <span className="w-2 h-2 rounded-full bg-slate-500 animate-pulse" />
                            <span>Queued ({index === 0 ? "First" : `${index + 1}th`})</span>
                          </div>
                        )}
                      </motion.div>
                    )
                  })}
                </AnimatePresence>

                {queue.length === 0 && (
                  <div className="w-full text-center py-6 text-muted-foreground flex flex-col items-center justify-center gap-2">
                    <Info className="h-8 w-8 opacity-40 text-cyan-400" />
                    <p className="text-sm font-medium">Task Queue is currently empty.</p>
                    <p className="text-xs opacity-65">Publish a task or simulate a traffic spike to witness FIFO processing.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Broker Monitor Console logs */}
          <Card className="border-muted/80 bg-card/65 backdrop-blur-sm">
            <CardHeader className="py-3 px-4 border-b border-muted/50 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold font-mono flex items-center gap-2 text-cyan-400">
                <Terminal className="h-4 w-4" />
                Real-time Broker Console Logs
              </CardTitle>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[10px] font-mono text-emerald-400">ONLINE</span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="bg-black/90 p-4 h-56 font-mono text-xs overflow-y-auto space-y-1.5 scrollbar-thin text-slate-300">
                {logs.map((log, index) => {
                  let colorClass = "text-slate-400"
                  if (log.includes("[Broker Consumer]")) colorClass = "text-emerald-400 font-semibold"
                  else if (log.includes("[Publisher:")) colorClass = "text-cyan-400"
                  else if (log.includes("Warning")) colorClass = "text-yellow-500 font-semibold"
                  else if (log.includes("[Broker Dispatcher]")) colorClass = "text-purple-400"
                  else if (log.includes("🚀")) colorClass = "text-yellow-300 font-bold"

                  return (
                    <div key={index} className={`leading-relaxed border-l-2 pl-2 ${colorClass} border-muted/30`}>
                      {log}
                    </div>
                  )
                })}
                <div ref={logsEndRef} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
