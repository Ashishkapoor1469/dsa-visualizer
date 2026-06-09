"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowRight, Info, AlertTriangle, HelpCircle, Terminal 
} from "lucide-react"

export function CircularQueueTab() {
  const CAPACITY = 8
  const [buffer, setBuffer] = useState<(string | null)[]>(Array(CAPACITY).fill(null))
  const [front, setFront] = useState(0)
  const [rear, setRear] = useState(0)
  const [size, setSize] = useState(0)
  
  const [inputValue, setInputValue] = useState("")
  const [mathLogs, setMathLogs] = useState<string[]>([
    "Circular Queue initialized with capacity N = 8.",
    "Front pointer initialized to F = 0, Rear pointer to R = 0. Size = 0."
  ])

  const addMathLog = (msg: string) => {
    const time = new Date().toLocaleTimeString()
    setMathLogs(prev => [...prev, `[${time}] ${msg}`])
  }

  // Enqueue
  const enqueue = () => {
    if (size === CAPACITY) {
      addMathLog("❌ Enqueue failed: Queue is FULL! Cannot enqueue. (size === capacity)")
      return
    }

    const val = inputValue.trim().slice(0, 3).toUpperCase() || `X${Math.floor(Math.random()*10)}`
    
    const newBuffer = [...buffer]
    newBuffer[rear] = val
    setBuffer(newBuffer)
    
    const prevRear = rear
    const nextRear = (rear + 1) % CAPACITY
    setRear(nextRear)
    setSize(prev => prev + 1)
    setInputValue("")

    addMathLog(
      `📥 Enqueued "${val}" at slot [${prevRear}]. New Rear = (${prevRear} + 1) % ${CAPACITY} = ${nextRear}. Current Size = ${size + 1}/${CAPACITY}`
    )
  }

  // Dequeue
  const dequeue = () => {
    if (size === 0) {
      addMathLog("❌ Dequeue failed: Queue is EMPTY! Cannot dequeue. (size === 0)")
      return
    }

    const val = buffer[front]
    const newBuffer = [...buffer]
    newBuffer[front] = null
    setBuffer(newBuffer)

    const prevFront = front
    const nextFront = (front + 1) % CAPACITY
    setFront(nextFront)
    setSize(prev => prev - 1)

    addMathLog(
      `📤 Dequeued "${val}" from slot [${prevFront}]. New Front = (${prevFront} + 1) % ${CAPACITY} = ${nextFront}. Current Size = ${size - 1}/${CAPACITY}`
    )
  }

  const resetQueue = () => {
    setBuffer(Array(CAPACITY).fill(null))
    setFront(0)
    setRear(0)
    setSize(0)
    setMathLogs([
      "Circular Queue reset.",
      "Front pointer F = 0, Rear pointer R = 0. Size = 0."
    ])
  }

  // Helper to calculate trigonometric placement
  const getCirclePosition = (index: number) => {
    const radius = 100 // Radius in pixels
    const angle = (index * 2 * Math.PI) / CAPACITY - Math.PI / 2 // Offset to start at top (12 o'clock)
    
    // Circle center is 130, 130
    const x = 130 + radius * Math.cos(angle)
    const y = 130 + radius * Math.sin(angle)
    return { x, y }
  }

  return (
    <div className="space-y-6">
      {/* Educational Banner */}
      <div className="p-4 bg-cyan-950/20 border border-cyan-850/50 rounded-xl flex items-start gap-3">
        <Info className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed text-slate-350">
          <strong className="text-cyan-400 text-sm block mb-1">Modulo Index Wrap-Around Mechanics</strong>
          A Circular Queue (Ring Buffer) connects the end of a fixed-size array back to its beginning. By doing so, it avoids linear-time $O(N)$ element shifting during depletions. Inserting is $O(1)$ and removing is $O(1)$. 
          We use two indices: <code className="text-cyan-300 font-bold">FRONT</code> (points to the oldest item) and <code className="text-amber-300 font-bold">REAR</code> (points to the next vacant writing slot). 
          Modulo arithmetic (<code className="text-purple-300">index = (index + 1) % capacity</code>) automatically wraps our indices seamlessly!
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* LEFT COLUMN: CONTROLS & LINEAR VIEW */}
        <div className="space-y-6">
          {/* Controls */}
          <Card className="border-muted/80 bg-card/65 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-cyan-400 font-mono">Ring Controls</CardTitle>
              <CardDescription>Insert or extract elements from the buffer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="flex gap-2">
                <Input
                  placeholder="Val (e.g. A, B)"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  maxLength={3}
                  className="bg-background/50 h-9 font-mono"
                  onKeyDown={(e) => e.key === "Enter" && enqueue()}
                />
                <Button onClick={enqueue} className="bg-cyan-600 hover:bg-cyan-700 text-white h-9 px-4">
                  Enqueue
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button onClick={dequeue} variant="outline" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 h-9">
                  Dequeue
                </Button>
                <Button onClick={resetQueue} variant="ghost" className="text-muted-foreground hover:text-destructive h-9">
                  Reset Ring
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Buffer Capacity Badge Map */}
          <Card className="border-muted/80 bg-card/65 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center justify-between">
                <span>Underlying Linear Array Memory Map</span>
                <Badge variant={size === CAPACITY ? "destructive" : "secondary"} className="text-[10px]">
                  {size === CAPACITY ? "FULL" : size === 0 ? "EMPTY" : `${size}/${CAPACITY} FILLED`}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-8 gap-1.5 font-mono text-center">
                {buffer.map((val, idx) => {
                  const isFront = idx === front
                  const isRear = idx === rear
                  const hasVal = val !== null
                  
                  let cellBg = "bg-muted/10 border-muted/50 text-muted-foreground"
                  if (hasVal) {
                    cellBg = "bg-cyan-950/20 border-cyan-500/30 text-cyan-200 font-bold"
                  }
                  if (isFront && isRear) {
                    cellBg += " ring-2 ring-purple-500"
                  } else if (isFront) {
                    cellBg += " ring-2 ring-cyan-400"
                  } else if (isRear) {
                    cellBg += " ring-2 ring-amber-500"
                  }

                  return (
                    <div key={idx} className="space-y-1">
                      <div className={`h-9 rounded border flex items-center justify-center text-xs transition-all ${cellBg}`}>
                        {val || "-"}
                      </div>
                      <div className="text-[9px] text-muted-foreground">[{idx}]</div>
                      <div className="flex flex-col text-[8px] font-bold gap-0.5 leading-none">
                        {isFront && <span className="text-cyan-400 uppercase">F</span>}
                        {isRear && <span className="text-amber-500 uppercase">R</span>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* MIDDLE COLUMN: TRIGONOMETRIC circular RING */}
        <div className="xl:col-span-1 bg-card/45 border border-muted/80 backdrop-blur-sm rounded-xl p-6 flex flex-col items-center justify-center min-h-[340px]">
          <h3 className="text-sm font-bold font-mono mb-4 text-white uppercase tracking-wider">Circular Ring Visualization</h3>
          
          <div className="relative w-[260px] h-[260px]">
            {/* The circular track background line */}
            <div className="absolute inset-4 rounded-full border border-dashed border-muted/30 pointer-events-none" />

            {/* Circular Nodes */}
            {buffer.map((val, idx) => {
              const { x, y } = getCirclePosition(idx)
              const isFront = idx === front
              const isRear = idx === rear
              const hasVal = val !== null
              
              let borderClass = "border-muted/50 text-muted-foreground bg-slate-900"
              if (hasVal) {
                borderClass = "border-cyan-500 text-cyan-200 bg-cyan-950/20 font-bold"
              }
              
              return (
                <div 
                  key={idx}
                  className={`absolute w-12 h-12 -translate-x-6 -translate-y-6 rounded-full border flex flex-col justify-center items-center text-xs transition-all duration-300 shadow-md ${borderClass}`}
                  style={{ left: `${x}px`, top: `${y}px` }}
                >
                  <span className="font-mono text-xs">{val || "-"}</span>
                  <span className="text-[8px] opacity-40 font-mono">[{idx}]</span>

                  {/* Pointers overlay */}
                  <div className="absolute -bottom-6 flex gap-1 z-10 pointer-events-none">
                    {isFront && (
                      <Badge className="bg-cyan-500 text-cyan-950 text-[8px] font-mono px-0.5 py-0 h-3.5 uppercase">F</Badge>
                    )}
                    {isRear && (
                      <Badge className="bg-amber-600 text-white text-[8px] font-mono px-0.5 py-0 h-3.5 uppercase">R</Badge>
                    )}
                  </div>
                </div>
              )
            })}

            {/* Central Info Node */}
            <div className="absolute inset-[80px] rounded-full bg-slate-950/80 border border-muted/40 flex flex-col items-center justify-center text-center shadow-inner pointer-events-none">
              <span className="text-[10px] text-muted-foreground uppercase font-mono">Size</span>
              <span className="text-xl font-black font-mono text-cyan-400">{size} / {CAPACITY}</span>
              <span className="text-[9px] text-muted-foreground font-mono leading-none">Modulo: 8</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: STEP-BY-STEP MATHEMATICAL TERMINAL */}
        <div className="xl:col-span-1 flex flex-col">
          <Card className="border-muted/80 bg-card/65 backdrop-blur-sm flex-1 flex flex-col justify-between">
            <CardHeader className="py-3 px-4 border-b border-muted/50">
              <CardTitle className="text-sm font-bold font-mono flex items-center gap-2 text-cyan-400">
                <Terminal className="h-4 w-4" />
                Circular Pointer Arithmetic Console
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              <div className="bg-black/90 p-4 h-[280px] font-mono text-xs overflow-y-auto space-y-1.5 scrollbar-thin text-slate-350">
                {mathLogs.map((log, index) => {
                  let colorClass = "text-slate-400"
                  if (log.includes("📥 Enqueued")) colorClass = "text-cyan-400 font-semibold"
                  else if (log.includes("📤 Dequeued")) colorClass = "text-amber-500 font-semibold"
                  else if (log.includes("❌")) colorClass = "text-red-400 font-bold"
                  else if (log.includes("reset")) colorClass = "text-purple-400"

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
