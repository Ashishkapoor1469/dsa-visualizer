import { SystemDesignMaker } from "@/components/visualizer/system-design/system-design-maker"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "System Design Maker - DSA Visualizer",
  description: "Offline interactive system design diagram builder to model distributed systems.",
}

export default function SystemDesignPage() {
  return <SystemDesignMaker />
}
