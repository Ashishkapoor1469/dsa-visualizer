"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageQueueTab } from "./message-queue-tab"
import { SystemProcessTab } from "./system-process-tab"
import { CircularQueueTab } from "./circular-queue-tab"
import { PriorityQueueTab } from "./priority-queue-tab"
import { MatrixExplanationTab } from "./matrix-explanation-tab"
import { Server, Cpu, RefreshCw, Star, BookOpen } from "lucide-react"

const TABS = [
  {
    value: "message-queue",
    label: "Message Queue",
    shortLabel: "Broker",
    icon: Server,
    color: "text-cyan-400",
    description: "Publish-Subscribe task broker with autoscaling worker pool"
  },
  {
    value: "process-scheduler",
    label: "Process Scheduler",
    shortLabel: "OS Scheduler",
    icon: Cpu,
    color: "text-amber-400",
    description: "Multilevel queue CPU scheduler with Foreground/Background queues and Gantt chart"
  },
  {
    value: "circular-queue",
    label: "Circular Buffer",
    shortLabel: "Ring Buffer",
    icon: RefreshCw,
    color: "text-purple-400",
    description: "Fixed-size ring buffer with modulo pointer wrap-around math"
  },
  {
    value: "priority-queue",
    label: "Priority Queue",
    shortLabel: "PQ / Heap",
    icon: Star,
    color: "text-yellow-400",
    description: "Priority-sorted job scheduler with stable ordering"
  },
  {
    value: "cheat-sheet",
    label: "Cheat Sheet",
    shortLabel: "Matrix",
    icon: BookOpen,
    color: "text-emerald-400",
    description: "Decision matrix, real-world systems, and production code snippets"
  },
]

export function MessageQueueVisualizer({ content }: { content: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState("message-queue")
  const active = TABS.find(t => t.value === activeTab) ?? TABS[0]
  const ActiveIcon = active.icon

  return (
    <div className="container mx-auto space-y-6">
      {/* Header */}
      <div className="mb-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
            <Server className="h-6 w-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Queue Systems Dashboard</h1>
            <p className="text-muted-foreground text-sm">
              Interactive visualizations of real-world queue architectures — the backbone of modern software systems.
            </p>
          </div>
        </div>

        {/* Active tab description strip */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-muted/40 border border-muted/60 mt-4 text-sm"
        >
          <ActiveIcon className={`h-4 w-4 flex-shrink-0 ${active.color}`} />
          <span className="text-muted-foreground">{active.description}</span>
        </motion.div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-5 h-auto gap-1 p-1 bg-muted/30 border border-muted/50 rounded-xl">
          {TABS.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.value
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={`flex flex-col gap-1 py-2.5 px-2 rounded-lg text-xs transition-all h-auto data-[state=active]:bg-card data-[state=active]:shadow-sm ${
                  isActive ? tab.color : "text-muted-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:block font-semibold">{tab.shortLabel}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        <TabsContent value="message-queue">
          <MessageQueueTab />
        </TabsContent>

        <TabsContent value="process-scheduler">
          <SystemProcessTab />
        </TabsContent>

        <TabsContent value="circular-queue">
          <CircularQueueTab />
        </TabsContent>

        <TabsContent value="priority-queue">
          <PriorityQueueTab />
        </TabsContent>

        <TabsContent value="cheat-sheet">
          <MatrixExplanationTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}