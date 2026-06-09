import { EnglishTeacher } from "@/components/visualizer/english-teacher/english-teacher"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI English Teacher - DSA Visualizer",
  description: "Offline English teaching assistant with interactive tenses lessons, accent trainers, and dialogue roleplay.",
}

export default function EnglishTeacherPage() {
  return (
    <div className="container py-8 max-w-7xl mx-auto">
      <EnglishTeacher />
    </div>
  )
}
