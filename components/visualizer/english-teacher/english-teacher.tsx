"use client"

import React, { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  BookOpen,
  MessageSquare,
  Mic,
  Award,
  Sparkles,
  RefreshCw,
  CheckCircle,
  XCircle,
  Send,
  HelpCircle,
  GraduationCap
} from "lucide-react"
import {
  ENGLISH_LESSONS,
  ENGLISH_QUIZ,
  ROLEPLAY_SCENARIOS,
  EnglishLesson,
  QuizQuestion,
  RoleplayScenario,
  DialogueStep
} from "@/lib/english-content"

const PRACTICE_PHRASES = [
  "She sells seashells by the seashore.",
  "Doubt is the key to knowledge, but practice leads to mastery.",
  "I am going to deploy the React project to production this afternoon.",
  "Could you please explain how this sorting algorithm handles negative values?",
  "I am looking forward to collaborating with your development team next week."
]

export function EnglishTeacher() {
  const [activeTab, setActiveTab] = useState("lessons")

  // TTS configurations
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>("")
  const [speedRate, setSpeedRate] = useState<number>(1.0)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentSpokenText, setCurrentSpokenText] = useState("")

  // Lessons tab states
  const [selectedLesson, setSelectedLesson] = useState<EnglishLesson>(ENGLISH_LESSONS[0])
  const [activeLessonSpeechId, setActiveLessonSpeechId] = useState<string | null>(null)

  // Pronunciation coach tab states
  const [trainerInput, setTrainerInput] = useState(PRACTICE_PHRASES[0])

  // Roleplay tab states
  const [selectedScenario, setSelectedScenario] = useState<RoleplayScenario>(ROLEPLAY_SCENARIOS[0])
  const [currentStepId, setCurrentStepId] = useState<string>(ROLEPLAY_SCENARIOS[0].startStepId)
  const [chatHistory, setChatHistory] = useState<{ sender: "bot" | "user"; text: string; feedback?: string }[]>([])
  const [scenarioStarted, setScenarioStarted] = useState(false)

  // Quiz tab states
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null)
  const [quizScore, setQuizScore] = useState(0)
  const [quizSubmitted, setQuizSubmitted] = useState(false)

  // Load Speech Voices
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

  // Speech Helper
  const speakText = (text: string, speechId: string | null = null) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return
    window.speechSynthesis.cancel()

    if (!text.trim()) return

    const utterance = new SpeechSynthesisUtterance(text)
    if (selectedVoiceName) {
      const voiceObj = voices.find(v => v.name === selectedVoiceName)
      if (voiceObj) utterance.voice = voiceObj
    }
    utterance.rate = speedRate

    utterance.onstart = () => {
      setIsSpeaking(true)
      setIsPaused(false)
      setCurrentSpokenText(text)
      if (speechId) setActiveLessonSpeechId(speechId)
    }

    utterance.onend = () => {
      setIsSpeaking(false)
      setIsPaused(false)
      setCurrentSpokenText("")
      setActiveLessonSpeechId(null)
    }

    utterance.onerror = () => {
      setIsSpeaking(false)
      setIsPaused(false)
      setCurrentSpokenText("")
      setActiveLessonSpeechId(null)
    }

    window.speechSynthesis.speak(utterance)
  }

  const handleStopSpeech = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
    setIsPaused(false)
    setCurrentSpokenText("")
    setActiveLessonSpeechId(null)
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
    } else if (currentSpokenText) {
      speakText(currentSpokenText)
    }
  }

  // Roleplay steps logic
  const handleStartRoleplay = (scenario: RoleplayScenario) => {
    setSelectedScenario(scenario)
    setCurrentStepId(scenario.startStepId)
    const initialStep = scenario.steps[scenario.startStepId]
    setChatHistory([{ sender: "bot", text: initialStep.botUtterance, feedback: initialStep.feedback }])
    setScenarioStarted(true)
    // Read aloud bot first utterance
    setTimeout(() => speakText(initialStep.botUtterance), 200)
  }

  const handleUserChoice = (choiceText: string, nextStepId: string) => {
    const nextStep = selectedScenario.steps[nextStepId]
    if (!nextStep) return

    setChatHistory(prev => [
      ...prev,
      { sender: "user", text: choiceText },
      { sender: "bot", text: nextStep.botUtterance, feedback: nextStep.feedback }
    ])
    setCurrentStepId(nextStepId)
    // Read aloud next bot response
    setTimeout(() => speakText(nextStep.botUtterance), 200)
  }

  // Quiz logic
  const handleSubmitQuiz = () => {
    if (selectedOptionIndex === null || quizSubmitted) return
    const currentQ = ENGLISH_QUIZ[currentQuizIndex]
    if (selectedOptionIndex === currentQ.answerIndex) {
      setQuizScore(prev => prev + 1)
    }
    setQuizSubmitted(true)
  }

  const handleNextQuiz = () => {
    setSelectedOptionIndex(null)
    setQuizSubmitted(false)
    if (currentQuizIndex + 1 < ENGLISH_QUIZ.length) {
      setCurrentQuizIndex(prev => prev + 1)
    } else {
      // Completed, reset
      setCurrentQuizIndex(0)
      setQuizScore(0)
    }
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

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI English Teaching Agent</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Improve your English grammar, vocabulary, pronunciation, and speaking roleplay — fully offline.
          </p>
        </div>
        
        {/* Accent / Voice global controller */}
        <Card className="border border-border/80 shadow-sm bg-muted/10 p-3 flex flex-wrap items-center gap-3">
          {voices.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Voice:</span>
              <select
                value={selectedVoiceName}
                onChange={e => setSelectedVoiceName(e.target.value)}
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

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase whitespace-nowrap">Speed: {speedRate}x</span>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={speedRate}
              onChange={e => setSpeedRate(parseFloat(e.target.value))}
              className="w-16 h-1 accent-primary cursor-pointer"
            />
          </div>

          {isSpeaking && (
            <div className="flex items-center gap-1">
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handlePlayPause}>
                {isPaused ? <Play className="h-3.5 w-3.5 text-primary" /> : <Pause className="h-3.5 w-3.5 text-primary" />}
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={handleStopSpeech}>
                <Square className="h-3.5 w-3.5" />
              </Button>
              {renderAudioWave()}
            </div>
          )}
        </Card>
      </div>

      <Separator />

      <Tabs value={activeTab} onValueChange={val => {
        setActiveTab(val)
        handleStopSpeech()
      }} className="space-y-4">
        <TabsList className="grid grid-cols-4 max-w-xl h-10 bg-muted/40 border border-border/40 p-1">
          <TabsTrigger value="lessons" className="text-xs gap-1.5"><BookOpen className="h-4 w-4" /> Lessons</TabsTrigger>
          <TabsTrigger value="roleplay" className="text-xs gap-1.5"><MessageSquare className="h-4 w-4" /> Roleplay</TabsTrigger>
          <TabsTrigger value="pronounce" className="text-xs gap-1.5"><Mic className="h-4 w-4" /> Accent Trainer</TabsTrigger>
          <TabsTrigger value="quiz" className="text-xs gap-1.5"><Award className="h-4 w-4" /> Quiz Zone</TabsTrigger>
        </TabsList>

        {/* 1. LESSONS TAB */}
        <TabsContent value="lessons" className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Lessons Sidebar Menu */}
          <div className="lg:col-span-4 space-y-3">
            <Card className="border-border/80 shadow-sm">
              <CardHeader className="py-3 px-4 bg-muted/30 border-b border-border/60">
                <span className="font-semibold text-sm flex items-center gap-2"><GraduationCap className="h-4 w-4 text-primary" />Course Syllabus</span>
              </CardHeader>
              <CardContent className="p-3 space-y-2">
                {ENGLISH_LESSONS.map(lesson => (
                  <Button
                    key={lesson.id}
                    variant={selectedLesson.id === lesson.id ? "default" : "outline"}
                    className="w-full justify-start text-xs font-semibold h-10 border-muted/50 transition-all text-left block truncate"
                    onClick={() => {
                      setSelectedLesson(lesson)
                      handleStopSpeech()
                    }}
                  >
                    {lesson.title}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Lesson Main View */}
          <div className="lg:col-span-8">
            <Card className="border-border/80 shadow-sm">
              <CardHeader className="p-6 bg-muted/15 border-b border-border/60">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] tracking-wider uppercase font-bold text-primary bg-primary/5">
                    {selectedLesson.category}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 text-xs h-7"
                    onClick={() => speakText(`${selectedLesson.title}. ${selectedLesson.introduction}`, "lesson-intro")}
                  >
                    <Volume2 className="h-3.5 w-3.5" /> Speak Section
                  </Button>
                </div>
                <CardTitle className="text-2xl font-bold mt-3">{selectedLesson.title}</CardTitle>
                <p className="text-sm font-sans mt-2 leading-relaxed text-muted-foreground">
                  {selectedLesson.introduction}
                </p>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {selectedLesson.sections.map((sec, sIdx) => (
                  <div key={sIdx} className="space-y-3 p-4 rounded-lg bg-muted/20 border border-border/40">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-bold text-foreground">{sec.heading}</h4>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-muted-foreground hover:text-primary"
                        onClick={() => speakText(`${sec.heading}. ${sec.body}`, `sec-${sIdx}`)}
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed font-sans">
                      {sec.body}
                    </p>

                    <div className="space-y-2 mt-3 pt-3 border-t border-border/40">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">Examples:</span>
                      {sec.examples.map((ex, eIdx) => {
                        const isSpeakingThis = activeLessonSpeechId === `ex-${sIdx}-${eIdx}`
                        return (
                          <div
                            key={eIdx}
                            onClick={() => speakText(ex.original, `ex-${sIdx}-${eIdx}`)}
                            className={`p-2.5 rounded border border-border/60 bg-background hover:border-primary/30 transition-all cursor-pointer flex justify-between items-center gap-4 ${
                              isSpeakingThis ? "bg-primary/5 border-primary/20 scale-[1.01]" : ""
                            }`}
                          >
                            <div className="space-y-0.5">
                              <p className={`text-xs font-mono font-bold ${isSpeakingThis ? "text-primary" : "text-foreground"}`}>
                                &quot;{ex.original}&quot;
                              </p>
                              <p className="text-[10px] text-muted-foreground font-sans">
                                {ex.explanation}
                              </p>
                            </div>
                            <Volume2 className={`h-4 w-4 flex-shrink-0 ${isSpeakingThis ? "text-primary" : "text-muted-foreground"}`} />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 2. ROLEPLAY TAB */}
        <TabsContent value="roleplay" className="space-y-4">
          {!scenarioStarted ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto py-6">
              {ROLEPLAY_SCENARIOS.map(sc => (
                <Card
                  key={sc.id}
                  className="border border-border/80 hover:border-primary/30 shadow-sm hover:shadow transition-all flex flex-col justify-between"
                >
                  <CardHeader className="p-5">
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <Sparkles className="h-4.5 w-4.5 text-amber-500" />
                      {sc.title}
                    </CardTitle>
                    <CardDescription className="text-xs font-sans leading-relaxed mt-1.5">
                      {sc.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-5 pt-0">
                    <Button
                      className="w-full text-xs font-semibold h-9"
                      onClick={() => handleStartRoleplay(sc)}
                    >
                      Start Conversation Roleplay
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-border/80 shadow-md max-w-4xl mx-auto overflow-hidden">
              <CardHeader className="py-3 px-5 bg-muted/20 border-b border-border/50 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <CardTitle className="text-sm font-semibold text-foreground">{selectedScenario.title}</CardTitle>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={() => setScenarioStarted(false)}
                >
                  Change Scenario
                </Button>
              </CardHeader>
              
              <CardContent className="p-0 flex flex-col justify-between min-h-[460px] bg-zinc-950/10">
                {/* Chat Message Window */}
                <div className="p-5 flex-1 space-y-4 overflow-y-auto max-h-[340px]">
                  {chatHistory.map((chat, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col gap-1.5 max-w-[80%] ${
                        chat.sender === "bot" ? "mr-auto items-start" : "ml-auto items-end"
                      }`}
                    >
                      <div
                        onClick={() => speakText(chat.text)}
                        className={`p-3 rounded-lg text-xs leading-relaxed transition-all cursor-pointer flex items-start gap-2.5 shadow-sm border ${
                          chat.sender === "bot"
                            ? "bg-muted/80 text-foreground border-border/60 hover:border-primary/20 rounded-tl-none"
                            : "bg-primary text-primary-foreground border-primary rounded-tr-none"
                        }`}
                        title="Click to read message"
                      >
                        {chat.sender === "bot" && <Volume2 className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-muted-foreground" />}
                        <span>{chat.text}</span>
                      </div>
                      
                      {chat.feedback && (
                        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-2 rounded text-[10px] leading-relaxed font-sans flex items-start gap-1.5">
                          <HelpCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-amber-500" />
                          <span>{chat.feedback}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Choices / Responses panel */}
                <div className="p-4 bg-muted/30 border-t border-border/40 space-y-3.5">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Select your response:</div>
                  <div className="grid grid-cols-1 gap-2.5">
                    {selectedScenario.steps[currentStepId]?.userChoices.map((choice, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        className="justify-start gap-2.5 h-auto py-3 px-4 text-xs font-semibold leading-relaxed border-border/80 hover:bg-primary/5 hover:border-primary/30 text-left transition-all"
                        onClick={() => handleUserChoice(choice.text, choice.nextStepId)}
                      >
                        <Send className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                        <span>{choice.text}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* 3. PRONUNCIATION TRAINER TAB */}
        <TabsContent value="pronounce" className="max-w-3xl mx-auto space-y-5">
          <Card className="border-border/80 shadow-sm">
            <CardHeader className="py-4 px-5 bg-muted/30 border-b border-border/60">
              <CardTitle className="text-sm font-semibold">Pronunciation Coach & Accent Trainer</CardTitle>
              <CardDescription className="text-xs">
                Type any English text below, choose a target voice/dialect, and click play to hear correct word stress.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-5">
              {/* Practice phrases lists */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Practice Phrase Presets:</span>
                <div className="flex flex-wrap gap-2">
                  {PRACTICE_PHRASES.map((ph, idx) => (
                    <Button
                      key={idx}
                      size="sm"
                      variant="outline"
                      className={`text-[10px] h-8 truncate max-w-[200px] ${
                        trainerInput === ph ? "border-primary text-primary bg-primary/5 font-bold" : ""
                      }`}
                      onClick={() => setTrainerInput(ph)}
                    >
                      Preset {idx + 1}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Text Input area */}
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">Custom Text to Speak</label>
                <textarea
                  value={trainerInput}
                  onChange={e => setTrainerInput(e.target.value)}
                  placeholder="Type anything here to practice..."
                  rows={3}
                  className="w-full bg-background border border-border/80 text-xs font-mono p-3 rounded focus:outline-none focus:ring-1 focus:ring-primary/20 leading-relaxed resize-none"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => speakText(trainerInput)}
                  className="flex-1 gap-2 text-xs font-semibold h-10"
                >
                  <Volume2 className="h-4 w-4" /> Listen &amp; Repeat
                </Button>
                {isSpeaking && (
                  <Button
                    variant="destructive"
                    onClick={handleStopSpeech}
                    className="h-10 text-xs font-semibold px-4"
                  >
                    <Square className="h-4 w-4" /> Stop
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. QUIZ TAB */}
        <TabsContent value="quiz" className="max-w-2xl mx-auto">
          {(() => {
            const currentQ = ENGLISH_QUIZ[currentQuizIndex]
            return (
              <Card className="border border-border/80 shadow-sm overflow-hidden">
                <CardHeader className="py-4.5 px-5 bg-muted/20 border-b border-border/60 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-4.5 w-4.5 text-amber-500" />
                    <span className="font-semibold text-sm">Grammar Quiz — Question {currentQuizIndex + 1}/{ENGLISH_QUIZ.length}</span>
                  </div>
                  <span className="text-xs font-bold text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10">Score: {quizScore}</span>
                </CardHeader>

                <CardContent className="p-6 space-y-5">
                  <div className="p-4 rounded bg-muted/20 border border-border/40 font-bold text-sm text-foreground leading-relaxed">
                    {currentQ.question}
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {currentQ.options.map((opt, oIdx) => {
                      const isSelected = selectedOptionIndex === oIdx
                      const isCorrect = currentQ.answerIndex === oIdx
                      const showResult = quizSubmitted

                      let btnVariant: "outline" | "default" | "secondary" = "outline"
                      let borderClass = "border-border/80"
                      let bgClass = "bg-background"
                      let iconEl = null

                      if (isSelected) {
                        btnVariant = "default"
                        borderClass = "border-primary"
                      }

                      if (showResult) {
                        if (isCorrect) {
                          borderClass = "border-emerald-500/80 bg-emerald-500/10 text-emerald-400"
                          iconEl = <CheckCircle className="h-4.5 w-4.5 text-emerald-500" />
                        } else if (isSelected) {
                          borderClass = "border-destructive/80 bg-destructive/10 text-destructive"
                          iconEl = <XCircle className="h-4.5 w-4.5 text-destructive" />
                        }
                      }

                      return (
                        <Button
                          key={oIdx}
                          disabled={showResult}
                          variant={btnVariant}
                          className={`justify-between h-auto py-3 px-4 text-xs font-semibold leading-relaxed text-left transition-all ${borderClass} ${bgClass}`}
                          onClick={() => setSelectedOptionIndex(oIdx)}
                        >
                          <span className="truncate">{opt}</span>
                          {iconEl}
                        </Button>
                      )
                    })}
                  </div>

                  {/* Submission and explanations */}
                  <div className="space-y-4 pt-4 border-t border-border/40">
                    {quizSubmitted ? (
                      <div className="space-y-4">
                        <div className="p-3.5 rounded bg-muted/40 border border-border/50 text-xs leading-relaxed text-muted-foreground flex items-start gap-2.5 font-sans">
                          <CheckCircle className="h-4.5 w-4.5 text-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-foreground block mb-1">Explanation:</span>
                            {currentQ.explanation}
                          </div>
                        </div>
                        
                        <Button
                          onClick={handleNextQuiz}
                          className="w-full text-xs font-semibold h-10"
                        >
                          {currentQuizIndex + 1 < ENGLISH_QUIZ.length ? "Next Question" : "Complete Quiz & Restart"}
                        </Button>
                      </div>
                    ) : (
                      <Button
                        disabled={selectedOptionIndex === null}
                        onClick={handleSubmitQuiz}
                        className="w-full text-xs font-semibold h-10"
                      >
                        Submit Answer
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })()}
        </TabsContent>
      </Tabs>
    </div>
  )
}
