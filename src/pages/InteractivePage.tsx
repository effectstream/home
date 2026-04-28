import PipelineViz from '../components/pipeline/PipelineViz'
import '../index.css'

export default function InteractivePage() {
  return (
    <div style={{ minHeight: '100vh', paddingTop: 40 }}>
      <PipelineViz />
    </div>
  )
}
