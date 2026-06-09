import { LearnHub } from "@/components/visualizer/learn/learn-hub"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Learn DSA - DSA Visualizer",
  description: "Roadmaps, core concepts, complexities, and code examples for Data Structures & Algorithms.",
}

export default function LearnPage() {
  return (
    <div className="container py-8 max-w-7xl mx-auto">
      <LearnHub />
    </div>
  )
}
