"use client"

import React, { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Database,
  Server,
  Cpu,
  HardDrive,
  Globe,
  Network,
  ArrowRight,
  Trash2,
  Download,
  Save,
  RefreshCw,
  Plus,
  MousePointer,
  Info,
  Maximize2,
  Layers,
  ArrowUpRight,
  FileSpreadsheet
} from "lucide-react"

// Define System Design Component Types
type ComponentType =
  | "client"
  | "loadBalancer"
  | "gateway"
  | "webServer"
  | "appServer"
  | "cache"
  | "database"
  | "queue"
  | "worker"
  | "cdn"

interface SystemComponent {
  id: string
  type: ComponentType
  label: string
  x: number
  y: number
}

interface Connection {
  id: string
  from: string
  to: string
  label: string
}

const COMPONENT_METADATA: Record<ComponentType, { label: string; icon: React.ComponentType<any>; color: string }> = {
  client: { label: "Client (User)", icon: Globe, color: "#3b82f6" },
  loadBalancer: { label: "Load Balancer", icon: Network, color: "#10b981" },
  gateway: { label: "API Gateway", icon: Cpu, color: "#8b5cf6" },
  webServer: { label: "Web Server", icon: Server, color: "#f59e0b" },
  appServer: { label: "App Server", icon: HardDrive, color: "#ec4899" },
  cache: { label: "Cache (Redis)", icon: Cpu, color: "#ef4444" },
  database: { label: "Database", icon: Database, color: "#06b6d4" },
  queue: { label: "Message Queue", icon: Layers, color: "#14b8a6" },
  worker: { label: "Background Worker", icon: Cpu, color: "#64748b" },
  cdn: { label: "CDN", icon: Server, color: "#84cc16" },
}

const TEMPLATES = {
  urlShortener: {
    name: "URL Shortener System",
    description: "Simple URL shortening system with cache-aside DB access",
    nodes: [
      { id: "c1", type: "client", label: "Browser Client", x: 60, y: 150 },
      { id: "lb1", type: "loadBalancer", label: "Nginx LB", x: 200, y: 150 },
      { id: "ws1", type: "webServer", label: "API Web Server", x: 360, y: 150 },
      { id: "ca1", type: "cache", label: "Redis Cache", x: 520, y: 60 },
      { id: "db1", type: "database", label: "PostgreSQL DB", x: 520, y: 240 },
    ] as SystemComponent[],
    connections: [
      { id: "e1", from: "c1", to: "lb1", label: "HTTPS /write" },
      { id: "e2", from: "lb1", to: "ws1", label: "HTTP Redirect" },
      { id: "e3", from: "ws1", to: "ca1", label: "1. Cache Get" },
      { id: "e4", from: "ws1", to: "db1", label: "2. DB Query (Miss)" },
      { id: "e5", from: "db1", to: "ca1", label: "3. Cache Set" },
    ] as Connection[],
  },
  chatApp: {
    name: "Real-time Chat App",
    description: "Scalable WebSocket-based chat service with message queue backend",
    nodes: [
      { id: "c1", type: "client", label: "Mobile App", x: 60, y: 80 },
      { id: "c2", type: "client", label: "Web App", x: 60, y: 220 },
      { id: "lb1", type: "loadBalancer", label: "Load Balancer", x: 190, y: 150 },
      { id: "ap1", type: "webServer", label: "WebSocket Server A", x: 340, y: 80 },
      { id: "ap2", type: "webServer", label: "WebSocket Server B", x: 340, y: 220 },
      { id: "q1", type: "queue", label: "Kafka Broker", x: 500, y: 150 },
      { id: "w1", type: "worker", label: "Chat Worker", x: 640, y: 150 },
      { id: "db1", type: "database", label: "Cassandra DB", x: 780, y: 150 },
    ] as SystemComponent[],
    connections: [
      { id: "e1", from: "c1", to: "lb1", label: "WSS Connection" },
      { id: "e2", from: "c2", to: "lb1", label: "WSS Connection" },
      { id: "e3", from: "lb1", to: "ap1", label: "Route Server A" },
      { id: "e4", from: "lb1", to: "ap2", label: "Route Server B" },
      { id: "e5", from: "ap1", to: "q1", label: "Publish Message" },
      { id: "e6", from: "ap2", to: "q1", label: "Publish Message" },
      { id: "e7", from: "q1", to: "w1", label: "Consume" },
      { id: "e8", from: "w1", to: "db1", label: "Batch Save" },
    ] as Connection[],
  },
  socialFeed: {
    name: "Social Feed Generator",
    description: "Hybrid fan-out feed generation architecture",
    nodes: [
      { id: "c1", type: "client", label: "Client App", x: 60, y: 150 },
      { id: "lb1", type: "loadBalancer", label: "API Gateway", x: 180, y: 150 },
      { id: "ws1", type: "webServer", label: "Feed Service", x: 320, y: 90 },
      { id: "ws2", type: "webServer", label: "Post Service", x: 320, y: 220 },
      { id: "q1", type: "queue", label: "RabbitMQ Fanout", x: 460, y: 220 },
      { id: "w1", type: "worker", label: "Feed Gen Worker", x: 580, y: 220 },
      { id: "ca1", type: "cache", label: "Redis (User Feeds)", x: 700, y: 150 },
      { id: "db1", type: "database", label: "Neo4j Graph DB", x: 460, y: 320 },
    ] as SystemComponent[],
    connections: [
      { id: "e1", from: "c1", to: "lb1", label: "Get Feed" },
      { id: "e2", from: "lb1", to: "ws1", label: "HTTP GET" },
      { id: "e3", from: "lb1", to: "ws2", label: "HTTP POST /post" },
      { id: "e4", from: "ws2", to: "q1", label: "Enqueue Post" },
      { id: "e5", from: "q1", to: "w1", label: "Trigger Fanout" },
      { id: "e6", from: "w1", to: "db1", label: "Lookup Followers" },
      { id: "e7", from: "w1", to: "ca1", label: "Update Feed Cache" },
      { id: "e8", from: "ws1", to: "ca1", label: "Read Feed Cache" },
    ] as Connection[],
  }
}

export function SystemDesignMaker() {
  const [components, setComponents] = useState<SystemComponent[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null)
  const [connectionStartId, setConnectionStartId] = useState<string | null>(null)
  const [nodeLabel, setNodeLabel] = useState("")
  const [connectionLabel, setConnectionLabel] = useState("")
  const [canvasTemplate, setCanvasTemplate] = useState("")

  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const svgRef = useRef<SVGSVGElement>(null)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedNodes = localStorage.getItem("sys_nodes")
      const savedEdges = localStorage.getItem("sys_edges")
      if (savedNodes && savedEdges) {
        setComponents(JSON.parse(savedNodes))
        setConnections(JSON.parse(savedEdges))
      } else {
        // Default to Chat App template
        handleLoadTemplate("chatApp")
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  // Auto-save changes to localStorage
  useEffect(() => {
    if (components.length > 0) {
      localStorage.setItem("sys_nodes", JSON.stringify(components))
      localStorage.setItem("sys_edges", JSON.stringify(connections))
    }
  }, [components, connections])

  const handleAddNode = (type: ComponentType) => {
    const id = type.slice(0, 2) + Math.random().toString(36).slice(2, 6)
    const count = components.filter(c => c.type === type).length + 1
    const meta = COMPONENT_METADATA[type]
    const newNode: SystemComponent = {
      id,
      type,
      label: `${meta.label} ${count}`,
      x: 150 + Math.random() * 80,
      y: 120 + Math.random() * 80,
    }
    setComponents(prev => [...prev, newNode])
    setSelectedNodeId(id)
    setNodeLabel(newNode.label)
    setSelectedConnectionId(null)
  }

  const handleDeleteSelected = () => {
    if (selectedNodeId) {
      setComponents(prev => prev.filter(c => c.id !== selectedNodeId))
      setConnections(prev => prev.filter(e => e.from !== selectedNodeId && e.to !== selectedNodeId))
      setSelectedNodeId(null)
    } else if (selectedConnectionId) {
      setConnections(prev => prev.filter(e => e.id !== selectedConnectionId))
      setSelectedConnectionId(null)
    }
  }

  const handleClear = () => {
    if (confirm("Are you sure you want to clear the canvas?")) {
      setComponents([])
      setConnections([])
      setSelectedNodeId(null)
      setSelectedConnectionId(null)
      setConnectionStartId(null)
      localStorage.removeItem("sys_nodes")
      localStorage.removeItem("sys_edges")
    }
  }

  const handleLoadTemplate = (key: keyof typeof TEMPLATES) => {
    const tmpl = TEMPLATES[key]
    if (tmpl) {
      setComponents(tmpl.nodes.map(n => ({ ...n })))
      setConnections(tmpl.connections.map(c => ({ ...c })))
      setSelectedNodeId(null)
      setSelectedConnectionId(null)
      setConnectionStartId(null)
    }
  }

  // Node Dragging Handlers
  const handleMouseDown = (e: React.MouseEvent<SVGElement>, nodeId: string) => {
    e.stopPropagation()
    const node = components.find(c => c.id === nodeId)
    if (!node) return

    setSelectedNodeId(nodeId)
    setNodeLabel(node.label)
    setSelectedConnectionId(null)

    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect()
      // We calculate mouse position relative to SVG canvas coord space
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top
      setDraggedNodeId(nodeId)
      setDragOffset({
        x: mouseX - node.x,
        y: mouseY - node.y,
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!draggedNodeId) return

    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      setComponents(prev =>
        prev.map(c => {
          if (c.id === draggedNodeId) {
            // Keep nodes inside reasonable boundary
            return {
              ...c,
              x: Math.max(20, Math.min(rect.width - 60, mouseX - dragOffset.x)),
              y: Math.max(20, Math.min(rect.height - 40, mouseY - dragOffset.y)),
            }
          }
          return c
        })
      )
    }
  }

  const handleMouseUp = () => {
    setDraggedNodeId(null)
  }

  // Draw Connection Lines
  const handleConnectClick = (nodeId: string) => {
    if (!connectionStartId) {
      setConnectionStartId(nodeId)
    } else {
      if (connectionStartId !== nodeId) {
        // Verify connection does not already exist
        const exists = connections.some(e => e.from === connectionStartId && e.to === nodeId)
        if (!exists) {
          const id = "e-" + Math.random().toString(36).slice(2, 6)
          const newEdge: Connection = {
            id,
            from: connectionStartId,
            to: nodeId,
            label: "Request/Data",
          }
          setConnections(prev => [...prev, newEdge])
          setSelectedConnectionId(id)
          setConnectionLabel(newEdge.label)
        }
      }
      setConnectionStartId(null)
    }
  }

  // Export Canvas as SVG File
  const handleExportSVG = () => {
    if (!svgRef.current) return
    const svgEl = svgRef.current.cloneNode(true) as SVGSVGElement
    
    // Add styling explicitly for font compatibility
    svgEl.setAttribute("style", "background-color: #09090b; font-family: monospace;")
    
    const svgString = new XMLSerializer().serializeToString(svgEl)
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement("a")
    link.href = url
    link.download = `system_design_${Date.now()}.svg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Update label values
  const handleUpdateNodeLabel = (val: string) => {
    setNodeLabel(val)
    if (selectedNodeId) {
      setComponents(prev => prev.map(c => (c.id === selectedNodeId ? { ...c, label: val } : c)))
    }
  }

  const handleUpdateConnectionLabel = (val: string) => {
    setConnectionLabel(val)
    if (selectedConnectionId) {
      setConnections(prev => prev.map(e => (e.id === selectedConnectionId ? { ...e, label: val } : e)))
    }
  }

  // Helper to draw Arrow lines
  const getLineParams = (fromNode: SystemComponent, toNode: SystemComponent) => {
    const nodeW = 120
    const nodeH = 40
    
    // Centers of nodes
    const fx = fromNode.x + nodeW / 2
    const fy = fromNode.y + nodeH / 2
    const tx = toNode.x + nodeW / 2
    const ty = toNode.y + nodeH / 2
    
    // Angle
    const dx = tx - fx
    const dy = ty - fy
    const angle = Math.atan2(dy, dx)
    
    // Trim line edges to not intersect node borders directly
    // Node border intersections
    const pad = 24
    const x1 = fx + Math.cos(angle) * (nodeW / 2 + 5)
    const y1 = fy + Math.sin(angle) * (nodeH / 2 + 5)
    const x2 = tx - Math.cos(angle) * (nodeW / 2 + 10)
    const y2 = ty - Math.sin(angle) * (nodeH / 2 + 10)
    
    return { x1, y1, x2, y2, mx: (x1 + x2) / 2, my: (y1 + y2) / 2 - 8 }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Design Maker</h1>
          <p className="text-muted-foreground text-sm mt-1">Design scalable architectures, model microservices and APIs — fully offline.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Select
            value={canvasTemplate}
            onValueChange={val => {
              setCanvasTemplate(val)
              handleLoadTemplate(val as any)
            }}
          >
            <SelectTrigger className="w-[180px] h-9"><SelectValue placeholder="Load Template..." /></SelectTrigger>
            <SelectContent>
              {Object.entries(TEMPLATES).map(([key, t]) => (
                <SelectItem key={key} value={key}>{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button size="sm" variant="outline" onClick={handleExportSVG} className="h-9 gap-1.5"><Download className="h-4 w-4" />Export SVG</Button>
          <Button size="sm" variant="destructive" onClick={handleClear} className="h-9 gap-1.5"><Trash2 className="h-4 w-4" />Clear Canvas</Button>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* Left Side: Palette */}
        <div className="xl:col-span-3 space-y-4">
          <Card className="border-border/80 shadow-sm">
            <CardHeader className="py-3 px-4 bg-muted/30 border-b border-border/60">
              <span className="font-semibold text-sm flex items-center gap-2"><Plus className="h-4 w-4 text-primary" />Component Palette</span>
            </CardHeader>
            <CardContent className="p-3 grid grid-cols-1 gap-2">
              {Object.entries(COMPONENT_METADATA).map(([type, meta]) => {
                const Icon = meta.icon
                return (
                  <Button
                    key={type}
                    variant="outline"
                    className="justify-start gap-2.5 h-10 border-muted/50 hover:bg-primary/5 hover:border-primary/30 transition-all font-sans text-xs"
                    onClick={() => handleAddNode(type as ComponentType)}
                  >
                    <div className="p-1.5 rounded" style={{ backgroundColor: `${meta.color}15`, color: meta.color }}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span>{meta.label}</span>
                  </Button>
                )
              })}
            </CardContent>
          </Card>

          {/* Properties Editor */}
          {(selectedNodeId || selectedConnectionId) && (
            <Card className="border-border/80 shadow-sm">
              <CardHeader className="py-3 px-4 bg-muted/30 border-b border-border/60 flex flex-row items-center justify-between">
                <span className="font-semibold text-sm">Properties</span>
                <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={handleDeleteSelected}><Trash2 className="h-3.5 w-3.5" /></Button>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {selectedNodeId && (
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted-foreground">Label</label>
                    <Input
                      value={nodeLabel}
                      onChange={e => handleUpdateNodeLabel(e.target.value)}
                      placeholder="e.g. Primary DB"
                      className="text-xs font-semibold h-8"
                    />
                    <div className="mt-4 p-2 bg-muted/40 rounded border border-border/60 text-[11px] leading-relaxed text-muted-foreground flex flex-col gap-1.5">
                      <span className="font-semibold text-foreground">Connection Helper:</span>
                      <span>1. Click &quot;Connect&quot; below.</span>
                      <span>2. Click another component on the canvas to draw an arrow.</span>
                      <Button
                        size="sm"
                        variant={connectionStartId === selectedNodeId ? "default" : "secondary"}
                        className="w-full mt-1.5 text-xs h-7 gap-1"
                        onClick={() => handleConnectClick(selectedNodeId)}
                      >
                        <ArrowUpRight className="h-3.5 w-3.5" />
                        {connectionStartId === selectedNodeId ? "Connecting... (Click target)" : "Connect to..."}
                      </Button>
                    </div>
                  </div>
                )}

                {selectedConnectionId && (
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted-foreground">Connection Label</label>
                    <Input
                      value={connectionLabel}
                      onChange={e => handleUpdateConnectionLabel(e.target.value)}
                      placeholder="e.g. HTTPS"
                      className="text-xs font-semibold h-8"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Quick tips */}
          <Card className="border-border/80 bg-muted/10">
            <CardContent className="p-4 flex gap-3 text-xs leading-relaxed text-muted-foreground">
              <Info className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
              <div className="space-y-1 font-sans">
                <p className="font-semibold text-foreground">Designer Tips</p>
                <ul className="list-disc pl-4 space-y-1 text-[11px]">
                  <li>Drag components to layout.</li>
                  <li>Click components/arrows to edit properties or delete.</li>
                  <li>Click &quot;Connect to...&quot; on properties sidebar to draw lines.</li>
                  <li>Autosaved automatically to browser storage.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Interactive SVG Editor Canvas */}
        <div className="xl:col-span-9">
          <Card className="border-border/80 shadow-md overflow-hidden bg-zinc-950">
            <CardHeader className="py-3 px-5 bg-muted/15 border-b border-border/40 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-zinc-200">System Diagram Canvas</CardTitle>
                <CardDescription className="text-xs text-zinc-500">Interactive workspace to model your architecture</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-400 ring-1 ring-inset ring-emerald-500/20">Offline Mode</span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <svg
                ref={svgRef}
                viewBox="0 0 900 520"
                className="w-full h-[520px] select-none cursor-crosshair focus:outline-none"
                onClick={() => {
                  setSelectedNodeId(null)
                  setSelectedConnectionId(null)
                  setConnectionStartId(null)
                }}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {/* Visual grid dots background */}
                <defs>
                  <pattern id="dot-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1.2" fill="#27272a" />
                  </pattern>
                  <marker
                    id="system-arrow"
                    viewBox="0 0 10 10"
                    refX="6"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M0 1.5L8 5L0 8.5z" fill="hsl(var(--primary))" />
                  </marker>
                  <marker
                    id="system-arrow-selected"
                    viewBox="0 0 10 10"
                    refX="6"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M0 1.5L8 5L0 8.5z" fill="#f59e0b" />
                  </marker>
                </defs>
                <rect width="100%" height="100%" fill="url(#dot-grid)" />

                {/* Connection lines */}
                {connections.map(edge => {
                  const fromNode = components.find(c => c.id === edge.from)
                  const toNode = components.find(c => c.id === edge.to)
                  if (!fromNode || !toNode) return null

                  const { x1, y1, x2, y2, mx, my } = getLineParams(fromNode, toNode)
                  const isSelected = selectedConnectionId === edge.id

                  return (
                    <g
                      key={edge.id}
                      onClick={e => {
                        e.stopPropagation()
                        setSelectedConnectionId(edge.id)
                        setConnectionLabel(edge.label)
                        setSelectedNodeId(null)
                      }}
                      className="cursor-pointer group"
                    >
                      {/* Thicker invisible line for hover ease */}
                      <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="transparent"
                        strokeWidth="10"
                      />
                      <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={isSelected ? "#f59e0b" : "hsl(var(--primary))"}
                        strokeWidth={isSelected ? 2.5 : 1.5}
                        markerEnd={`url(#${isSelected ? "system-arrow-selected" : "system-arrow"})`}
                        strokeDasharray={isSelected ? "none" : "none"}
                        className="transition-colors group-hover:stroke-amber-500"
                        opacity={isSelected ? 1 : 0.65}
                      />
                      {edge.label && (
                        <g>
                          <rect
                            x={mx - (edge.label.length * 6) / 2 - 4}
                            y={my - 7}
                            width={edge.label.length * 6 + 8}
                            height="16"
                            fill="#09090b"
                            rx="3"
                            stroke={isSelected ? "#f59e0b" : "#27272a"}
                            strokeWidth="1"
                            opacity="0.9"
                          />
                          <text
                            x={mx}
                            y={my + 5}
                            textAnchor="middle"
                            fill={isSelected ? "#f59e0b" : "#a1a1aa"}
                            fontSize="9"
                            fontFamily="monospace"
                            fontWeight="bold"
                          >
                            {edge.label}
                          </text>
                        </g>
                      )}
                    </g>
                  )
                })}

                {/* Connection Target Indicator during drawing */}
                {connectionStartId && (() => {
                  const startNode = components.find(c => c.id === connectionStartId)
                  if (!startNode) return null
                  return (
                    <circle
                      cx={startNode.x + 60}
                      cy={startNode.y + 20}
                      r="160"
                      fill="hsl(var(--primary))"
                      opacity="0.04"
                      className="animate-pulse"
                      style={{ pointerEvents: "none" }}
                    />
                  )
                })()}

                {/* Component Blocks */}
                {components.map(node => {
                  const meta = COMPONENT_METADATA[node.type]
                  const Icon = meta.icon
                  const isSelected = selectedNodeId === node.id
                  const isTargeting = connectionStartId && connectionStartId !== node.id
                  
                  return (
                    <g
                      key={node.id}
                      transform={`translate(${node.x}, ${node.y})`}
                      onMouseDown={e => handleMouseDown(e, node.id)}
                      onClick={e => e.stopPropagation()}
                      className="cursor-grab active:cursor-grabbing group"
                    >
                      <rect
                        width="120"
                        height="40"
                        rx="6"
                        fill="#09090b"
                        stroke={
                          isSelected
                            ? "#f59e0b"
                            : isTargeting
                            ? "hsl(var(--primary))"
                            : "#27272a"
                        }
                        strokeWidth={isSelected ? 2 : 1.5}
                        className="transition-shadow group-hover:stroke-zinc-600 duration-150"
                        style={{
                          filter: isSelected ? "drop-shadow(0 0 8px rgba(245, 158, 11, 0.2))" : "none"
                        }}
                      />
                      
                      {/* Left color bar indicator */}
                      <path
                        d="M 1.5 6 A 4.5 4.5 0 0 1 6 1.5 L 6 38.5 A 4.5 4.5 0 0 1 1.5 34 Z"
                        fill={meta.color}
                      />

                      {/* Icon */}
                      <g transform="translate(12, 10)">
                        <rect width="20" height="20" rx="4" fill={`${meta.color}15`} />
                        <Icon className="h-3.5 w-3.5" style={{ color: meta.color, transform: "translate(3px, 3px)" }} />
                      </g>

                      {/* Text Label */}
                      <text
                        x="38"
                        y="24"
                        fill={isSelected ? "#f59e0b" : "#e4e4e7"}
                        fontSize="9.5"
                        fontWeight="semibold"
                        fontFamily="sans-serif"
                      >
                        {node.label.length > 13 ? node.label.slice(0, 11) + "..." : node.label}
                      </text>

                      {/* Connector indicator point (if drawing connection) */}
                      {connectionStartId === node.id && (
                        <circle
                          cx="60"
                          cy="20"
                          r="6"
                          fill="hsl(var(--primary))"
                          className="animate-ping"
                        />
                      )}
                    </g>
                  )
                })}
              </svg>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
