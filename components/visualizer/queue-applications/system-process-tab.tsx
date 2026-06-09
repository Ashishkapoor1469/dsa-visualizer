"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Play, Pause, Plus, Trash2, Cpu, Terminal, Activity 
} from "lucide-react"

interface SystemProcess {
  pid: number
  name: string
  type: "Foreground" | "Background"
  burstTime: number // total ticks needed
  remainingTime: number // ticks left
  status: "ready" | "running" | "preempted" | "completed"
}

interface GanttSlice {
  pid: number
  name: string
  type: "Foreground" | "Background"
}

export function SystemProcessTab() {
  const [foregroundQueue, setForegroundQueue] = useState<SystemProcess[]>([])
  const [backgroundQueue, setBackgroundQueue] = useState<SystemProcess[]>([])
  const [cpuProcess, setCpuProcess] = useState<SystemProcess | null>(null)
  const [completed, setCompleted] = useState<SystemProcess[]>([])
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [tickSpeed, setTickSpeed] = useState(800) // ms per scheduler tick
  const [ganttHistory, setGanttHistory] = useState<GanttSlice[]>([])
  
  const [logs, setLogs] = useState<string[]>([
    "Kernel: CPU Scheduling subsystem initialized.",
    "Kernel: Multilevel Queue Scheduler online. Foreground priority = 2, Background priority = 1.",
    "Kernel: CPU core #0 is currently IDLE."
  ])

  const pidCounter = useRef(1001)
  const logsEndRef = useRef<HTMLDivElement>(null)

  // Auto scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [logs])

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `[${timestamp}] scheduler: ${msg}`])
  }

  // Create Process
  const createProcess = (type: "Foreground" | "Background", name: string, burstTime: number) => {
    const pid = pidCounter.current++
    const newProcess: SystemProcess = {
      pid,
      name,
      type,
      burstTime,
      remainingTime: burstTime,
      status: "ready"
    }

    if (type === "Foreground") {
      setForegroundQueue(prev => [...prev, newProcess])
      addLog(`Enqueued Foreground (Interactive) Process PID ${pid}: "${name}" (${burstTime} CPU ticks)`)
    } else {
      setBackgroundQueue(prev => [...prev, newProcess])
      addLog(`Enqueued Background (Batch) Process PID ${pid}: "${name}" (${burstTime} CPU ticks)`)
    }
  }

  const handleCreateCustom = (type: "Foreground" | "Background") => {
    const fgPresets = [
      { name: "UI_Render_Compositor", ticks: 3 },
      { name: "Keyboard_Input_ISR", ticks: 2 },
      { name: "Audio_Buffer_Flush", ticks: 2 },
      { name: "Pointer_Coords_Poll", ticks: 1 }
    ]
    const bgPresets = [
      { name: "Database_Index_Vacuum", ticks: 6 },
      { name: "System_Log_Compressor", ticks: 5 },
      { name: "Telemetry_Report_POST", ticks: 4 },
      { name: "Heap_GC_Collector", ticks: 3 }
    ]

    const presets = type === "Foreground" ? fgPresets : bgPresets
    const choice = presets[Math.floor(Math.random() * presets.length)]
    createProcess(type, choice.name, choice.ticks)
  }

  const handleClear = () => {
    setForegroundQueue([])
    setBackgroundQueue([])
    setCpuProcess(null)
    setCompleted([])
    setGanttHistory([])
    setLogs(["Kernel: CPU Scheduler queues wiped. CPU reset to IDLE."])
    pidCounter.current = 1001
  }

  // CPU Scheduler Core Logic Tick
  const runSchedulerTick = () => {
    // 1. If CPU is idle, attempt to dispatch next task
    if (!cpuProcess) {
      if (foregroundQueue.length > 0) {
        const nextProc = { ...foregroundQueue[0], status: "running" as const }
        setForegroundQueue(prev => prev.slice(1))
        setCpuProcess(nextProc)
        addLog(`CPU Dispatcher: Pulling high-priority Foreground PID ${nextProc.pid} (${nextProc.name}) to CPU Core #0.`)
      } else if (backgroundQueue.length > 0) {
        const nextProc = { ...backgroundQueue[0], status: "running" as const }
        setBackgroundQueue(prev => prev.slice(1))
        setCpuProcess(nextProc)
        addLog(`CPU Dispatcher: Pulling low-priority Background PID ${nextProc.pid} (${nextProc.name}) to CPU Core #0.`)
      } else {
        // CPU remains idle
      }
      return
    }

    // 2. CPU is currently running a process. 
    // Check Preemption: If active is Background, and Foreground has arrived, PREEMPT!
    if (cpuProcess.type === "Background" && foregroundQueue.length > 0) {
      const preemptedProc: SystemProcess = {
        ...cpuProcess,
        status: "preempted",
      }
      
      // Return preempted process to Background queue
      setBackgroundQueue(prev => [preemptedProc, ...prev])
      
      // Pull Foreground process immediately
      const nextProc = { ...foregroundQueue[0], status: "running" as const }
      setForegroundQueue(prev => prev.slice(1))
      setCpuProcess(nextProc)
      
      addLog(`🚨 CRITICAL PREEMPTION: High-priority Foreground queue active! PID ${preemptedProc.pid} (${preemptedProc.name}) suspended & re-queued. PID ${nextProc.pid} assigned.`)
      return
    }

    // 3. Tick current process execution
    const updatedProc = { ...cpuProcess }
    updatedProc.remainingTime -= 1
    
    // Add to Gantt Chart
    setGanttHistory(prev => [...prev, { pid: updatedProc.pid, name: updatedProc.name, type: updatedProc.type }].slice(-24)) // limit to last 24 cells

    addLog(`CPU Executing: PID ${updatedProc.pid} (${updatedProc.name}) remaining ticks: ${updatedProc.remainingTime}/${updatedProc.burstTime}`)

    if (updatedProc.remainingTime <= 0) {
      // Completed!
      updatedProc.status = "completed"
      setCompleted(prev => [...prev, updatedProc])
      setCpuProcess(null)
      addLog(`✔ CPU Success: PID ${updatedProc.pid} (${updatedProc.name}) completed processing burst cycles.`)
    } else {
      // Continue execution
      setCpuProcess(updatedProc)
    }
  }

  // Automatic playback timer
  useEffect(() => {
    if (!isPlaying) return
    const timer = setInterval(() => {
      runSchedulerTick()
    }, tickSpeed)
    return () => clearInterval(timer)
  }, [isPlaying, cpuProcess, foregroundQueue, backgroundQueue, tickSpeed])

  return (
    <div className="space-y-6">
      {/* Ticking Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-muted/40 p-4 rounded-xl border border-muted/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant={isPlaying ? "destructive" : "default"}
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-28 gap-1.5"
          >
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4" /> Pause CPU
              </>
            ) : (
              <>
                <Play className="h-4 w-4 text-emerald-400" /> Start CPU
              </>
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={isPlaying}
            onClick={runSchedulerTick}
            className="gap-1.5"
          >
            <Activity className="h-4 w-4 text-cyan-400" /> Step Scheduler Tick
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={handleClear} 
            className="text-muted-foreground hover:text-destructive gap-1 px-2"
          >
            <Trash2 className="h-4 w-4" /> Reset kernel
          </Button>
        </div>

        {/* Speed range input */}
        <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
          <span className="whitespace-nowrap">Tick: {tickSpeed}ms</span>
          <input
            type="range"
            min={300}
            max={2000}
            step={100}
            value={tickSpeed}
            onChange={(e) => setTickSpeed(Number(e.target.value))}
            className="w-36 cursor-pointer accent-cyan-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* LEFT COLUMN: MULTILEVEL QUEUES & ADD CONTROLS */}
        <div className="space-y-6">
          {/* Processes Creation */}
          <Card className="border-muted/80 bg-card/65 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-md flex items-center gap-2 text-cyan-400 font-mono">
                <Cpu className="h-4 w-5" />
                Task Scheduler Generator
              </CardTitle>
              <CardDescription>Simulate loading operating system threads into queues</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">Queue Class 1: Foreground</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-400 text-xs gap-1"
                    onClick={() => handleCreateCustom("Foreground")}
                  >
                    <Plus className="h-3.5 w-3.5" /> Interactive (FG)
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs"
                    onClick={() => createProcess("Foreground", "Realtime_Sensor_IRQ", 2)}
                  >
                    Add ISR (2 ticks)
                  </Button>
                </div>
              </div>

              <div className="space-y-2 border-t border-muted/50 pt-3">
                <p className="text-xs font-semibold text-muted-foreground">Queue Class 2: Background</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-amber-500/30 hover:bg-amber-500/10 text-amber-500 text-xs gap-1"
                    onClick={() => handleCreateCustom("Background")}
                  >
                    <Plus className="h-3.5 w-3.5" /> Batch Job (BG)
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-amber-600 hover:bg-amber-700 text-white text-xs"
                    onClick={() => createProcess("Background", "Batch_SQL_Backup", 6)}
                  >
                    Add Dump (6 ticks)
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Foreground & Background Queues Visuals */}
          <Card className="border-muted/80 bg-card/65 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center justify-between text-cyan-400">
                <span>Foreground Queue (High Priority)</span>
                <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-[10px]">{foregroundQueue.length} Active</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
              <AnimatePresence>
                {foregroundQueue.map((p, idx) => (
                  <motion.div
                    key={p.pid}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="text-xs p-2 rounded bg-cyan-500/5 border border-cyan-500/20 flex items-center justify-between text-cyan-200"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono bg-cyan-950 px-1 rounded text-[10px]">PID: {p.pid}</span>
                      <span className="font-semibold font-mono truncate max-w-[120px]">{p.name}</span>
                    </div>
                    <span className="font-mono text-muted-foreground">FIFO [{idx}] | {p.remainingTime}t</span>
                  </motion.div>
                ))}
              </AnimatePresence>
              {foregroundQueue.length === 0 && (
                <div className="text-center py-4 text-xs text-muted-foreground opacity-60">No high-priority foreground processes.</div>
              )}
            </CardContent>
          </Card>

          <Card className="border-muted/80 bg-card/65 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center justify-between text-amber-400">
                <span>Background Queue (Low Priority)</span>
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px]">{backgroundQueue.length} Active</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
              <AnimatePresence>
                {backgroundQueue.map((p, idx) => (
                  <motion.div
                    key={p.pid}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="text-xs p-2 rounded bg-amber-500/5 border border-amber-500/20 flex items-center justify-between text-amber-200"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono bg-amber-950 px-1 rounded text-[10px]">PID: {p.pid}</span>
                      <span className="font-semibold font-mono truncate max-w-[120px]">{p.name}</span>
                    </div>
                    <span className="font-mono text-muted-foreground">{p.status === "preempted" ? "Preempted" : "FIFO"} | {p.remainingTime}t</span>
                  </motion.div>
                ))}
              </AnimatePresence>
              {backgroundQueue.length === 0 && (
                <div className="text-center py-4 text-xs text-muted-foreground opacity-60">No low-priority background processes.</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* MIDDLE/RIGHT: VISUAL CPU SCHEDULER & LOGS */}
        <div className="xl:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* CPU CORE VIEW */}
            <Card className="border-muted/80 bg-card/65 backdrop-blur-sm md:col-span-1 flex flex-col justify-between">
              <CardHeader className="pb-2">
                <CardTitle className="text-md flex items-center gap-2 text-white font-mono">
                  <Cpu className="h-4 w-4 text-cyan-400" />
                  CPU Core #0
                </CardTitle>
                <CardDescription>Primary computational execution core</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-6">
                {cpuProcess ? (
                  <div className="w-full text-center space-y-4">
                    {/* Ring Progress of current task */}
                    <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                      <svg className="absolute w-full h-full transform -rotate-90">
                        <circle cx="56" cy="56" r="48" className="stroke-muted-foreground/20 fill-none" strokeWidth="6" />
                        <circle 
                          cx="56" cy="56" r="48" 
                          className={`fill-none transition-all duration-300 ${
                            cpuProcess.type === "Foreground" ? "stroke-cyan-400" : "stroke-amber-500"
                          }`}
                          strokeWidth="6" 
                          strokeDasharray={2 * Math.PI * 48}
                          strokeDashoffset={2 * Math.PI * 48 * (1 - (cpuProcess.burstTime - cpuProcess.remainingTime) / cpuProcess.burstTime)}
                        />
                      </svg>
                      <div className="text-center z-10">
                        <p className="text-[10px] text-muted-foreground font-mono">PID {cpuProcess.pid}</p>
                        <p className="text-lg font-black font-mono leading-tight truncate max-w-[80px] text-white">{cpuProcess.name}</p>
                        <p className="text-xs font-bold text-muted-foreground">{cpuProcess.remainingTime} ticks left</p>
                      </div>
                    </div>
                    <Badge className={cpuProcess.type === "Foreground" ? "bg-cyan-500 text-white" : "bg-amber-600 text-white"}>
                      {cpuProcess.type} Burst
                    </Badge>
                  </div>
                ) : (
                  <div className="text-center py-8 space-y-2">
                    <div className="w-16 h-16 rounded-full border border-dashed border-muted-foreground/40 mx-auto flex items-center justify-center text-muted-foreground/40 animate-pulse">
                      IDLE
                    </div>
                    <p className="text-xs text-muted-foreground font-mono">Kernel State: Halted</p>
                    <p className="text-[10px] text-muted-foreground/60">Waiting for process dispatch...</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* KERNEL SCHEDULER LOGS */}
            <Card className="border-muted/80 bg-card/65 backdrop-blur-sm md:col-span-2 flex flex-col justify-between">
              <CardHeader className="py-3 px-4 border-b border-muted/50 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold font-mono flex items-center gap-2 text-cyan-400">
                  <Terminal className="h-4 w-4" />
                  Scheduler Dispatcher Console
                </CardTitle>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                  <span>Scheduler: Multilevel Queue</span>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="bg-black/90 p-4 h-[200px] font-mono text-xs overflow-y-auto space-y-1.5 scrollbar-thin text-slate-300">
                  {logs.map((log, index) => {
                    let colorClass = "text-slate-400"
                    if (log.includes("✔ CPU Success")) colorClass = "text-green-400 font-semibold"
                    else if (log.includes("🚨 CRITICAL")) colorClass = "text-red-400 font-bold bg-red-950/20 px-1 rounded border border-red-950/50"
                    else if (log.includes("CPU Dispatcher")) colorClass = "text-purple-400"
                    else if (log.includes("CPU Executing")) colorClass = "text-slate-200"

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

          {/* GANTT CHART CHRONOLOGICAL VIEW */}
          <Card className="border-muted/80 bg-card/65 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-2 border-b border-muted/50">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-400" />
                Chronological CPU Gantt Execution Timeline
              </CardTitle>
              <CardDescription className="text-xs">Real-time plotted visualization of executed processor ticks</CardDescription>
            </CardHeader>
            <CardContent className="py-4 bg-slate-950/40">
              <div className="flex items-center gap-1 overflow-x-auto min-h-[46px] py-1 border border-muted/40 rounded-lg px-2 bg-background/50">
                {ganttHistory.map((slice, idx) => {
                  const color = slice.type === "Foreground" ? "bg-cyan-500 text-cyan-950" : "bg-amber-600 text-white"
                  return (
                    <div 
                      key={idx} 
                      className={`flex-shrink-0 w-16 h-8 rounded text-[9px] font-mono font-bold flex flex-col justify-center items-center select-none shadow ${color}`}
                      title={`PID ${slice.pid}: ${slice.name}`}
                    >
                      <span className="truncate max-w-[60px]">{slice.name}</span>
                      <span>PID {slice.pid}</span>
                    </div>
                  )}
                )}
                {ganttHistory.length === 0 && (
                  <div className="w-full text-center py-2 text-xs font-mono text-muted-foreground opacity-65">
                    Gantt chart empty. Start the CPU to track executed processor cycles.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
