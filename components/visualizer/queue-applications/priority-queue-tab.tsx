"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Terminal, Star, Play, Sparkles, Trash2 } from "lucide-react"

interface PriorityTask {
  id: string
  name: string
  priority: number // 3 = High, 2 = Medium, 1 = Low
  priorityLabel: "High" | "Medium" | "Low"
  timestamp: number
}

export function PriorityQueueTab() {
  const [queue, setQueue] = useState<PriorityTask[]>([])
  const [completed, setCompleted] = useState<PriorityTask[]>([])
  const [taskName, setTaskName] = useState("")
  const [priority, setPriority] = useState<number>(2) // Default Medium
  
  const [logs, setLogs] = useState<string[]>([
    "System: Priority Queue initialized.",
    "System: Higher priority values (3 = High) bubble to the front.",
    "System: Equal priority items preserve arrival order (Stable Queue)."
  ])

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `[${timestamp}] ${msg}`])
  }

  // Enqueue Task
  const handleEnqueue = () => {
    const name = taskName.trim() || `Job-${Math.floor(Math.random() * 900 + 100)}`
    const priorityLabels: Record<number, "High" | "Medium" | "Low"> = {
      3: "High",
      2: "Medium",
      1: "Low"
    }

    const newTask: PriorityTask = {
      id: `task-${Date.now()}`,
      name,
      priority,
      priorityLabel: priorityLabels[priority],
      timestamp: Date.now()
    }

    setQueue(prev => {
      const updated = [...prev, newTask]
      // Sort: Highest priority (3) first. If priorities are equal, maintain FIFO (earlier timestamp first)
      return updated.sort((a, b) => {
        if (b.priority !== a.priority) {
          return b.priority - a.priority
        }
        return a.timestamp - b.timestamp
      })
    })

    const desc = priority === 3 ? "🔥 High Priority" : priority === 2 ? "⚡ Medium Priority" : "🌱 Low Priority"
    addLog(`Enqueued "${name}" (${desc}). Priority level sorted it into place.`)
    setTaskName("")
  }

  // Dequeue Task
  const handleDequeue = () => {
    if (queue.length === 0) {
      addLog("⚠️ Queue Empty: Dequeue ignored.")
      return
    }

    const nextTask = queue[0]
    setQueue(prev => prev.slice(1))
    setCompleted(prev => [nextTask, ...prev])

    const desc = nextTask.priority === 3 ? "🔥 High" : nextTask.priority === 2 ? "⚡ Medium" : "🌱 Low"
    addLog(`📥 Dequeued highest priority task: "${nextTask.name}" (Priority: ${desc})`)
  }

  const handleClear = () => {
    setQueue([])
    setCompleted([])
    setLogs([
      "Priority Queue wiped.",
      "Ready for next priority scheduling test."
    ])
  }

  return (
    <div className="space-y-6">
      {/* Topology Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/40 p-4 rounded-xl border border-muted/80 backdrop-blur-sm">
        <div className="text-center p-2 rounded-lg bg-background/50 border border-muted">
          <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Storage Ordering</p>
          <p className="text-lg font-bold text-cyan-400">Stable Priority Sort</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-background/50 border border-muted">
          <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Queue Length</p>
          <p className="text-lg font-bold text-yellow-500">{queue.length} Pending</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-background/50 border border-muted">
          <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Completed Jobs</p>
          <p className="text-lg font-bold text-green-400">{completed.length} Done</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* LEFT COLUMN: CONTROLS */}
        <div className="space-y-6">
          <Card className="border-muted/80 bg-card/65 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-cyan-400 font-mono">
                <Star className="h-5 w-5" />
                Priority Scheduler
              </CardTitle>
              <CardDescription>
                Assign priorities to schedule jobs ahead of basic FIFO pipelines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground font-semibold">Job Name</label>
                <Input
                  placeholder="e.g. Flush Disk Writes, Print Invoice"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  className="bg-background/50 h-9 font-mono"
                  onKeyDown={(e) => e.key === "Enter" && handleEnqueue()}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-muted-foreground font-semibold">Priority Level</label>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    type="button" 
                    variant={priority === 3 ? "default" : "outline"}
                    onClick={() => setPriority(3)}
                    className={`text-xs h-8 ${priority === 3 ? "bg-red-600 hover:bg-red-750 text-white font-bold" : "border-red-500/20 text-red-400 hover:bg-red-500/5"}`}
                  >
                    High (3)
                  </Button>
                  <Button 
                    type="button" 
                    variant={priority === 2 ? "default" : "outline"}
                    onClick={() => setPriority(2)}
                    className={`text-xs h-8 ${priority === 2 ? "bg-amber-600 hover:bg-amber-700 text-white font-bold" : "border-amber-500/20 text-amber-400 hover:bg-amber-500/5"}`}
                  >
                    Med (2)
                  </Button>
                  <Button 
                    type="button" 
                    variant={priority === 1 ? "default" : "outline"}
                    onClick={() => setPriority(1)}
                    className={`text-xs h-8 ${priority === 1 ? "bg-emerald-600 hover:bg-emerald-700 text-white font-bold" : "border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/5"}`}
                  >
                    Low (1)
                  </Button>
                </div>
              </div>

              <Button onClick={handleEnqueue} className="w-full h-9 bg-cyan-600 hover:bg-cyan-700 gap-1 text-white">
                <Play className="h-4 w-4" /> Enqueue job
              </Button>

              <div className="border-t border-muted/80 pt-4 flex gap-2">
                <Button onClick={handleDequeue} className="flex-1 bg-amber-600 hover:bg-amber-700 text-white h-9">
                  Dequeue High
                </Button>
                <Button onClick={handleClear} variant="ghost" className="text-muted-foreground hover:text-destructive h-9 px-2">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* MIDDLE COLUMN: SORTED QUEUE TRACK */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="border-muted/80 bg-card/65 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-3 border-b border-muted/50">
              <CardTitle className="text-md flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-yellow-500" />
                Priority Sorted Conveyor Track
              </CardTitle>
              <CardDescription>
                Tasks sorted immediately by weight. High values float left to the FRONT of the queue.
              </CardDescription>
            </CardHeader>
            <CardContent className="py-6 bg-slate-950/40 min-h-[160px] flex items-center">
              <div className="absolute top-3 left-4 text-xs font-mono font-bold text-red-400 uppercase tracking-widest flex items-center gap-1">
                <span>FRONT (DEQUEUE NEXT)</span>
                <ArrowRight className="h-3 w-3" />
              </div>

              <div className="w-full flex items-center gap-3 overflow-x-auto py-6 px-2 relative z-10 scrollbar-thin scrollbar-thumb-muted">
                <AnimatePresence mode="popLayout">
                  {queue.map((task, index) => {
                    const cardColors = 
                      task.priority === 3 ? "border-red-500 text-red-400 bg-red-950/15" :
                      task.priority === 2 ? "border-amber-500 text-amber-400 bg-amber-950/15" :
                      "border-emerald-500 text-emerald-400 bg-emerald-950/15"

                    return (
                      <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, scale: 0.8, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -30 }}
                        transition={{ type: "spring", stiffness: 220, damping: 22 }}
                        className={`flex-shrink-0 w-44 p-3 rounded-lg border bg-card/95 flex flex-col justify-between h-28 hover:shadow-lg transition-shadow relative ${cardColors}`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-mono text-muted-foreground">Index: [{index}]</span>
                          <Badge 
                            variant="outline" 
                            className={`text-[9px] px-1 py-0 h-4 uppercase ${
                              task.priority === 3 ? "bg-red-500/20 text-red-400 border-red-500/30" :
                              task.priority === 2 ? "bg-amber-500/20 text-amber-400 border-amber-500/30" :
                              "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                            }`}
                          >
                            Prio {task.priority}
                          </Badge>
                        </div>
                        
                        <p className="text-xs font-mono font-bold truncate text-white my-2">{task.name}</p>
                        
                        <div className="text-[9px] text-muted-foreground font-mono">
                          Arrival order: {new Date(task.timestamp).toLocaleTimeString([], { hour12: false })}
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>

                {queue.length === 0 && (
                  <div className="w-full text-center py-6 text-muted-foreground flex flex-col items-center justify-center gap-2">
                    <p className="text-sm font-medium">Priority Queue is empty.</p>
                    <p className="text-xs opacity-65">Add jobs above with varying priorities to see them sort dynamically!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Console logs */}
          <Card className="border-muted/80 bg-card/65 backdrop-blur-sm">
            <CardHeader className="py-2.5 px-4 border-b border-muted/50">
              <CardTitle className="text-xs font-mono flex items-center gap-1.5 text-cyan-400">
                <Terminal className="h-3.5 w-3.5" />
                Priority Dispatcher Output
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="bg-black/90 p-4 h-[120px] font-mono text-xs overflow-y-auto space-y-1.5 scrollbar-thin text-slate-350">
                {logs.map((log, index) => {
                  let colorClass = "text-slate-400"
                  if (log.includes("Enqueued")) colorClass = "text-cyan-400"
                  else if (log.includes("Dequeued")) colorClass = "text-yellow-400 font-semibold"
                  else if (log.includes("Stable")) colorClass = "text-purple-400"

                  return (
                    <div key={index} className={`leading-relaxed border-l-2 pl-2 ${colorClass} border-muted/30`}>
                      {log}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
