"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Search, BookOpen, CheckCircle, ArrowRight, BookMarked, Sparkles } from "lucide-react"
import { LEARN_CONTENT } from "@/lib/learn-content"

export function LearnHub() {
  const [searchQuery, setSearchQuery] = useState("")
  const [completedTopics, setCompletedTopics] = useState<string[]>([])

  // Load progress from localStorage
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem("dsa_learn_progress")
      if (savedProgress) {
        setCompletedTopics(JSON.parse(savedProgress))
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  const topics = Object.values(LEARN_CONTENT)
  const totalTopics = topics.length
  const completedCount = completedTopics.length
  const progressPct = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0

  // Filter topics
  const filteredTopics = topics.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Group by category
  const categories: Record<string, typeof topics> = {}
  filteredTopics.forEach(t => {
    if (!categories[t.category]) categories[t.category] = []
    categories[t.category].push(t)
  })

  return (
    <div className="space-y-6">
      {/* Header and Progress */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Learn DSA Hub</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Master structures and algorithms with interactive text roadmaps and code snippets.
          </p>
        </div>
        
        {/* Progress Card */}
        <Card className="w-full md:w-[280px] border-border/80 shadow-sm bg-muted/20">
          <CardContent className="p-4 space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-muted-foreground flex items-center gap-1.5"><BookMarked className="h-4 w-4 text-primary" />Roadmap Progress</span>
              <span className="text-primary">{progressPct}% ({completedCount}/{totalTopics})</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search topics (e.g. Binary Search, Stacks, Big O)..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="pl-9 h-10 border-border/80 focus-visible:ring-primary/20"
        />
      </div>

      {/* Grid Categories */}
      {Object.keys(categories).length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No topics matched your search query. Try another term.
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(categories).map(([catName, catTopics]) => (
            <div key={catName} className="space-y-4">
              <h2 className="text-lg font-bold text-muted-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                {catName}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {catTopics.map(topic => {
                  const isDone = completedTopics.includes(topic.id)
                  return (
                    <Card
                      key={topic.id}
                      className="border border-border/80 hover:border-primary/30 shadow-sm hover:shadow transition-all duration-200 flex flex-col justify-between group overflow-hidden"
                    >
                      <CardHeader className="p-5 pb-3">
                        <div className="flex justify-between items-start gap-2">
                          <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground bg-muted/40">
                            {topic.id}
                          </Badge>
                          {isDone && (
                            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] gap-1 px-1.5 h-5 font-bold">
                              <CheckCircle className="h-3 w-3" /> Completed
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-base font-bold mt-2.5 group-hover:text-primary transition-colors">
                          {topic.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-5 pt-0 flex-1 flex flex-col justify-between gap-5">
                        <CardDescription className="text-xs leading-relaxed text-muted-foreground font-sans line-clamp-3">
                          {topic.summary}
                        </CardDescription>
                        <Button
                          asChild
                          size="sm"
                          variant="ghost"
                          className="w-full text-xs font-semibold justify-between bg-muted/30 group-hover:bg-primary/5 hover:text-primary border border-border/30 group-hover:border-primary/20 h-9 transition-all"
                        >
                          <a href={`/visualizer/learn/${topic.id}`}>
                            <span>Start Reading</span>
                            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
