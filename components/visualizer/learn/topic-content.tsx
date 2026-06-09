"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Code2,
  Table,
  CheckCircle2,
  Copy,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square
} from "lucide-react"
import { LEARN_CONTENT, TopicContent } from "@/lib/learn-content"

interface TopicContentProps {
  topicId: string
}

export function TopicContentDetail({ topicId }: TopicContentProps) {
  const router = useRouter()
  const [completed, setCompleted] = useState(false)
  const [copied, setCopied] = useState(false)

  // Speech synthesis states
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>("")
  const [speedRate, setSpeedRate] = useState<number>(1.0)
  const [activeSpeechIndex, setActiveSpeechIndex] = useState<number | null>(null)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const topic = LEARN_CONTENT[topicId]

  // Get keys of all topics to enable Prev/Next navigation
  const topicKeys = Object.keys(LEARN_CONTENT)
  const currentIndex = topicKeys.indexOf(topicId)
  const prevKey = currentIndex > 0 ? topicKeys[currentIndex - 1] : null
  const nextKey = currentIndex < topicKeys.length - 1 ? topicKeys[currentIndex + 1] : null

  // Load completion status
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem("dsa_learn_progress")
      if (savedProgress) {
        const completedList = JSON.parse(savedProgress) as string[]
        setCompleted(completedList.includes(topicId))
      }
    } catch (e) {
      console.error(e)
    }
  }, [topicId])

  // Load Speech Voices on mount
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return

    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices()
      const engVoices = allVoices.filter(v => v.lang.startsWith("en-"))
      const list = engVoices.length > 0 ? engVoices : allVoices
      setVoices(list)
      
      const preferred = list.find(v => v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Zira")) || list[0]
      if (preferred) setSelectedVoiceName(preferred.name)
    }

    loadVoices()
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices
    }

    return () => {
      window.speechSynthesis.cancel()
    }
  }, [])

  // Create speech segments out of topic content
  const speechSegments = useMemo(() => {
    if (!topic) return []
    const segments = [
      { id: "intro", text: `${topic.title}. ${topic.introduction}`, label: "Introduction" }
    ]
    topic.concepts.forEach((c, idx) => {
      segments.push({
        id: `concept-${idx}`,
        text: `${c.title}. ${c.content}`,
        label: `Concept: ${c.title}`
      })
    })
    if (topic.bestPractices && topic.bestPractices.length > 0) {
      segments.push({
        id: "best-practices",
        text: `Best Practices. ${topic.bestPractices.join(". ")}`,
        label: "Best Practices"
      })
    }
    return segments
  }, [topic])

  // Start speaking a specific segment
  const speakSegment = (index: number) => {
    if (typeof window === "undefined" || !window.speechSynthesis || !topic) return

    window.speechSynthesis.cancel()

    if (index < 0 || index >= speechSegments.length) {
      setIsSpeaking(false)
      setIsPaused(false)
      setActiveSpeechIndex(null)
      return
    }

    const segment = speechSegments[index]
    const utterance = new SpeechSynthesisUtterance(segment.text)

    if (selectedVoiceName) {
      const voiceObj = voices.find(v => v.name === selectedVoiceName)
      if (voiceObj) utterance.voice = voiceObj
    }
    utterance.rate = speedRate

    utterance.onstart = () => {
      setIsSpeaking(true)
      setIsPaused(false)
      setActiveSpeechIndex(index)
    }

    utterance.onend = () => {
      if (index + 1 < speechSegments.length) {
        speakSegment(index + 1)
      } else {
        setIsSpeaking(false)
        setIsPaused(false)
        setActiveSpeechIndex(null)
      }
    }

    utterance.onerror = (e) => {
      console.error("Speech error:", e)
      setIsSpeaking(false)
      setIsPaused(false)
      setActiveSpeechIndex(null)
    }

    window.speechSynthesis.speak(utterance)
  }

  const handlePlayPause = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return

    if (isSpeaking) {
      if (isPaused) {
        window.speechSynthesis.resume()
        setIsPaused(false)
      } else {
        window.speechSynthesis.pause()
        setIsPaused(true)
      }
    } else {
      const startIdx = activeSpeechIndex !== null ? activeSpeechIndex : 0
      speakSegment(startIdx)
    }
  }

  const handleStop = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
    setIsPaused(false)
    setActiveSpeechIndex(null)
  }

  // Toggle completion status
  const handleToggleComplete = (checked: boolean) => {
    setCompleted(checked)
    try {
      const savedProgress = localStorage.getItem("dsa_learn_progress")
      let completedList = savedProgress ? (JSON.parse(savedProgress) as string[]) : []

      if (checked) {
        if (!completedList.includes(topicId)) {
          completedList.push(topicId)
        }
      } else {
        completedList = completedList.filter(id => id !== topicId)
      }
      localStorage.setItem("dsa_learn_progress", JSON.stringify(completedList))
    } catch (e) {
      console.error(e)
    }
  }

  // Copy code to clipboard
  const handleCopyCode = () => {
    if (!topic) return
    navigator.clipboard.writeText(topic.codeExample.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Open template in code visualizer
  const handleLaunchVisualizer = () => {
    if (!topic) return
    let visualizerKey = topicId
    
    if (topicId === "big-o") visualizerKey = "linearSearch"
    else if (topicId === "arrays") visualizerKey = "linearSearch"
    else if (topicId === "strings") visualizerKey = "huffman"
    else if (topicId === "hash-maps") visualizerKey = "linkedList"
    else if (topicId === "linked-lists") visualizerKey = "linkedList"
    else if (topicId === "stacks") visualizerKey = "stack"
    else if (topicId === "queues") visualizerKey = "queue"
    else if (topicId === "queue-systems") visualizerKey = "queue"
    else if (topicId === "trees") visualizerKey = "bst"
    else if (topicId === "heaps") visualizerKey = "minHeap"
    else if (topicId === "graphs") visualizerKey = "graph"
    else if (topicId === "dynamic-programming") visualizerKey = "knapsack"
    else if (topicId === "recursion-backtracking") visualizerKey = "bubbleSort"
    else if (topicId === "greedy-algorithms") visualizerKey = "huffman"
    else if (topicId === "sorting-algorithms") visualizerKey = "mergeSort"
    else if (topicId === "searching-algorithms") visualizerKey = "binarySearch"
    else if (topicId === "math-algorithms") visualizerKey = "fibonacci"

    try {
      localStorage.setItem("sys_custom_code_template", visualizerKey)
    } catch (e) {
      console.error(e)
    }
    router.push("/visualizer/custom-code")
  }

  const renderAudioWave = () => {
    if (!isSpeaking || isPaused) return null
    return (
      <div className="flex items-center gap-0.5 h-4 w-6 px-1">
        <span className="w-0.5 bg-primary animate-audio-bar-1 h-3 rounded-full" />
        <span className="w-0.5 bg-primary animate-audio-bar-2 h-4 rounded-full" />
        <span className="w-0.5 bg-primary animate-audio-bar-3 h-2 rounded-full" />
        <span className="w-0.5 bg-primary animate-audio-bar-4 h-3.5 rounded-full" />
      </div>
    )
  }

  if (!topic) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Topic not found. <Button onClick={() => router.push("/visualizer/learn")}>Back to Hub</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* CSS Animations style tag */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes audio-bar-1 { 0%, 100% { height: 6px; } 50% { height: 14px; } }
        @keyframes audio-bar-2 { 0%, 100% { height: 14px; } 50% { height: 6px; } }
        @keyframes audio-bar-3 { 0%, 100% { height: 8px; } 50% { height: 16px; } }
        @keyframes audio-bar-4 { 0%, 100% { height: 10px; } 50% { height: 4px; } }
        .animate-audio-bar-1 { animation: audio-bar-1 0.8s ease-in-out infinite; }
        .animate-audio-bar-2 { animation: audio-bar-2 0.7s ease-in-out infinite; }
        .animate-audio-bar-3 { animation: audio-bar-3 0.9s ease-in-out infinite; }
        .animate-audio-bar-4 { animation: audio-bar-4 0.6s ease-in-out infinite; }
      ` }} />

      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/20 p-3 rounded-lg border border-border/80">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/visualizer/learn")}
          className="gap-1 h-8 font-semibold w-fit"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Hub
        </Button>

        <div className="flex items-center gap-3">
          {/* Complete Status checkbox */}
          <div className="flex items-center gap-2 border border-border/80 bg-background px-3 py-1.5 rounded-md h-8">
            <input
              type="checkbox"
              id="completed-chk"
              checked={completed}
              onChange={e => handleToggleComplete(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 text-amber-500 focus:ring-amber-500 accent-primary cursor-pointer"
            />
            <label
              htmlFor="completed-chk"
              className="text-xs font-semibold text-foreground cursor-pointer select-none"
            >
              Mark Completed
            </label>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Prev/Next buttons */}
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={!prevKey}
              onClick={() => router.push(`/visualizer/learn/${prevKey}`)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={!nextKey}
              onClick={() => router.push(`/visualizer/learn/${nextKey}`)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Voice Assistant Panel */}
      <Card className="border border-border/80 shadow-sm bg-muted/10 overflow-hidden">
        <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-primary/10 text-primary">
              <Volume2 className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold flex items-center gap-2">
                AI Reading Assistant
                {renderAudioWave()}
              </h4>
              <p className="text-xs text-muted-foreground">
                {activeSpeechIndex !== null
                  ? `Reading: ${speechSegments[activeSpeechIndex]?.label}`
                  : "Listen to the content offline"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3.5">
            {/* Play/Pause */}
            <Button
              size="sm"
              variant={isSpeaking ? "secondary" : "default"}
              onClick={handlePlayPause}
              className="h-9 font-semibold gap-1.5"
            >
              {isSpeaking && !isPaused ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isSpeaking && !isPaused ? "Pause" : isPaused ? "Resume" : "Listen Now"}
            </Button>

            {/* Stop */}
            {isSpeaking && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleStop}
                className="h-9 text-destructive hover:bg-destructive/10"
              >
                <Square className="h-4 w-4 mr-1.5" /> Stop
              </Button>
            )}

            <Separator orientation="vertical" className="h-6 hidden md:block" />

            {/* Voice Select */}
            {voices.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Voice:</span>
                <select
                  value={selectedVoiceName}
                  onChange={e => {
                    setSelectedVoiceName(e.target.value)
                    if (isSpeaking) {
                      const currentIdx = activeSpeechIndex !== null ? activeSpeechIndex : 0
                      setTimeout(() => speakSegment(currentIdx), 100)
                    }
                  }}
                  className="bg-background border border-border/80 text-xs font-semibold rounded px-2 py-1 h-8 focus:outline-none focus:ring-1 focus:ring-primary/20 max-w-[140px]"
                >
                  {voices.map(v => (
                    <option key={v.name} value={v.name}>
                      {v.name.replace("Microsoft", "").replace("Desktop", "").trim()} ({v.lang})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Speed Rate */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase whitespace-nowrap">Speed: {speedRate}x</span>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={speedRate}
                onChange={e => {
                  const val = parseFloat(e.target.value)
                  setSpeedRate(val)
                  if (isSpeaking) {
                    const currentIdx = activeSpeechIndex !== null ? activeSpeechIndex : 0
                    setTimeout(() => speakSegment(currentIdx), 100)
                  }
                }}
                className="w-16 h-1 accent-primary cursor-pointer"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Side: Deep Dive Content (8 cols) */}
        <div className="xl:col-span-8 space-y-6">
          {/* Main Card */}
          <Card className="border border-border/80 shadow-sm">
            <CardHeader
              className={`p-6 bg-muted/15 border-b border-border/60 transition-colors duration-300 cursor-pointer ${
                activeSpeechIndex === 0 ? "bg-primary/5 border-primary/20" : ""
              }`}
              onClick={() => speakSegment(0)}
            >
              <div className="flex justify-between items-center">
                <Badge variant="outline" className="text-[10px] tracking-wider uppercase font-bold text-primary bg-primary/5">
                  {topic.category}
                </Badge>
                <div className="text-[10px] font-mono text-muted-foreground opacity-0 hover:opacity-100 transition-opacity flex items-center gap-1 font-bold">
                  <Play className="h-3 w-3" /> Click to read section
                </div>
              </div>
              <CardTitle className="text-2xl font-bold mt-2">{topic.title}</CardTitle>
              <CardDescription className="text-sm font-sans mt-1.5 leading-relaxed text-foreground/80">
                {topic.introduction}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-6 space-y-6">
              {/* Core Concepts */}
              <div className="space-y-5">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" /> Key Concepts
                </h3>
                <div className="space-y-4">
                  {topic.concepts.map((concept, index) => {
                    const isActive = activeSpeechIndex === index + 1
                    return (
                      <div
                        key={index}
                        className={`p-4 rounded-lg bg-muted/30 border border-border/50 space-y-2 transition-all duration-300 cursor-pointer ${
                          isActive ? "bg-primary/10 border-primary/30 shadow-sm scale-[1.01]" : "hover:border-border/80"
                        }`}
                        onClick={() => speakSegment(index + 1)}
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="text-sm font-bold text-foreground">{concept.title}</h4>
                          <span className="text-[9px] font-mono text-muted-foreground opacity-0 hover:opacity-100 transition-opacity font-bold">
                            Click to read
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed font-sans whitespace-pre-line">
                          {concept.content}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Best Practices */}
              {topic.bestPractices.length > 0 && (() => {
                const bpIndex = speechSegments.length - 1
                const isActive = activeSpeechIndex === bpIndex
                return (
                  <div
                    className={`space-y-3 p-4 rounded-lg border border-transparent transition-all duration-300 cursor-pointer ${
                      isActive ? "bg-primary/5 border-primary/20 scale-[1.01]" : "hover:bg-muted/10"
                    }`}
                    onClick={() => speakSegment(bpIndex)}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" /> Best Practices & Common Tips
                      </h3>
                      <span className="text-[9px] font-mono text-muted-foreground opacity-0 hover:opacity-100 transition-opacity font-bold">
                        Click to read
                      </span>
                    </div>
                    <ul className="list-disc pl-5 space-y-1.5 text-xs text-muted-foreground leading-relaxed font-sans">
                      {topic.bestPractices.map((bp, i) => (
                        <li key={i}>{bp}</li>
                      ))}
                    </ul>
                  </div>
                )
              })()}
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Complexity & Code Sandbox Reference (4 cols) */}
        <div className="xl:col-span-4 space-y-6">
          {/* Complexity Table */}
          {topic.complexityTable && topic.complexityTable.length > 0 && (
            <Card className="border border-border/80 shadow-sm overflow-hidden">
              <CardHeader className="py-3.5 px-5 bg-muted/30 border-b border-border/60 flex flex-row items-center gap-2">
                <Table className="h-4 w-4 text-primary" />
                <span className="font-semibold text-sm">Complexities</span>
              </CardHeader>
              <CardContent className="p-0">
                <table className="min-w-full divide-y divide-border/60 text-center font-mono text-[11px]">
                  <thead>
                    <tr className="bg-muted/40">
                      <th className="px-4 py-2 text-left text-muted-foreground font-bold">Operation</th>
                      <th className="px-4 py-2 text-muted-foreground font-bold">Time</th>
                      <th className="px-4 py-2 text-muted-foreground font-bold">Space</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 bg-card">
                    {topic.complexityTable.map((row, i) => (
                      <tr key={i} className="hover:bg-muted/10">
                        <td className="px-4 py-2 text-left font-sans text-xs text-foreground font-medium">{row.operation}</td>
                        <td className="px-4 py-2 text-primary font-bold">{row.time}</td>
                        <td className="px-4 py-2 text-muted-foreground font-medium">{row.space}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}

          {/* Interactive Code Template */}
          <Card className="border border-border/80 shadow-sm overflow-hidden bg-zinc-950">
            <CardHeader className="py-3 px-5 bg-muted/15 border-b border-border/40 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-amber-500" />
                <span className="font-semibold text-xs text-zinc-300">Code Template</span>
              </div>
              <div className="flex items-center gap-1">
                <Button size="icon" variant="ghost" className="h-7 w-7 text-zinc-400 hover:text-zinc-200" onClick={handleCopyCode}>
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex flex-col justify-between">
              <div className="p-4 font-mono text-[11px] leading-relaxed text-zinc-300 overflow-x-auto max-h-[300px] whitespace-pre">
                {topic.codeExample.code}
              </div>
              
              <div className="p-3 bg-muted/10 border-t border-border/40 flex flex-col gap-2">
                {copied && <div className="text-center text-[10px] text-emerald-400 font-bold font-mono">Copied to Clipboard!</div>}
                <Button
                  size="sm"
                  onClick={handleLaunchVisualizer}
                  className="w-full text-xs h-8 gap-1 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold"
                >
                  <PlayCircle className="h-4 w-4" /> Run in Visualizer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
