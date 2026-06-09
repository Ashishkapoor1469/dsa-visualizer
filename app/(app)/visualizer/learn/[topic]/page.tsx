import { TopicContentDetail } from "@/components/visualizer/learn/topic-content"

interface PageProps {
  params: Promise<{
    topic: string
  }>
}

export default async function TopicPage({ params }: PageProps) {
  const { topic } = await params
  
  return (
    <div className="container py-8 max-w-7xl mx-auto">
      <TopicContentDetail topicId={topic} />
    </div>
  )
}
